
import { GoogleGenAI, Type } from "@google/genai";
import { BidAnalysisResult, SubItem, BidFormat, MarketProfile } from "../types";

const extractJson = (text: string) => {
  const codeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1];
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];
  return text;
};

const getSystemInstruction = (selectedScopes: string[], profile: MarketProfile) => {
  const laborTierMult = { 'Low': 0.92, 'Average': 1.00, 'High': 1.12 }[profile.laborMarketTier];
  const projectTypeMult = {
    'Multifamily': 1.00, 'Retail': 1.05, 'Office': 1.04, 'Industrial': 1.06,
    'Hospitality': 1.08, 'Healthcare': 1.12, 'Education': 1.07, 'Mixed-Use': 1.09
  }[profile.projectType];
  const complexityMult = { 'Low': 0.95, 'Normal': 1.00, 'High': 1.10 }[profile.complexity];
  const urgencyMult = { 'Normal': 1.00, 'Accelerated': 1.08 }[profile.scheduleUrgency];
  
  const unionUplift = (profile.unionLabor || profile.prevailingWage) ? 1.15 : 1.00;
  const totalLaborMult = Math.min(1.30, laborTierMult * complexityMult * urgencyMult * unionUplift);
  
  const overhead = { 'Competitive': 0.08, 'Standard': 0.10, 'Premium': 0.12 }[profile.positioning];
  const profit = { 'Competitive': 0.10, 'Standard': 0.15, 'Premium': 0.20 }[profile.positioning];
  const contingency = profile.includeContingency ? profile.contingencyPct : 0;

  return `
ACT AS: Senior Construction Estimator & AI Takeoff Specialist.
APP: Prime Bid Pro.

MARKET CONTEXT:
Region: ${profile.marketRegion} | Type: ${profile.projectType} | Positioning: ${profile.positioning}

MULTIPLIERS:
- Labor: ${totalLaborMult.toFixed(2)} | Production: /${(complexityMult * urgencyMult).toFixed(2)} | Material: x${(projectTypeMult * complexityMult).toFixed(2)}
- Overhead: ${(overhead * 100)}% | Profit: ${(profit * 100)}% | Contingency: ${(contingency * 100)}%

OBJECTIVE:
Analyze architectural blueprints. Provide spatial polygons [0-1000 coords], cost line items, and an AIA proposal.

SCHEMA:
Return a JSON object with:
- markdown: string
- costWorksheet: [{ id, name, items: [{ id, scope, qty, unit, laborCosts, materialCosts, total, notes }] }]
- visualTakeoff: { polygons: [{ id, scopeCode, points: [{x, y}], label, qty, unit, explanation, color }] }
`;
};

export const generateBid = async (file: File, selectedSubItems: SubItem[], bidFormat: BidFormat, profile: MarketProfile): Promise<BidAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = await fileToGenerativePart(file);
  const scopeNames = selectedSubItems.map(s => `${s.code} ${s.title}`);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: getSystemInstruction(scopeNames, profile),
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
    },
    contents: {
      parts: [
        { inlineData: { mimeType: file.type, data: base64Data } },
        { text: "Analyze the blueprint and generate the full JSON takeoff and bid package." }
      ]
    }
  });

  return sanitizeResponse(response.text, `data:${file.type};base64,${base64Data}`);
};

export const editTakeoff = async (currentResult: BidAnalysisResult, command: string, profile: MarketProfile): Promise<BidAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are refining an existing construction bid. 
      CURRENT DATA (JSON): ${JSON.stringify({ costWorksheet: currentResult.costWorksheet, visualTakeoff: { polygons: currentResult.visualTakeoff.polygons } })}
      USER COMMAND: "${command}"
      
      TASK:
      1. Modify the JSON data (polygons, quantities, costs) based on the user's natural language command.
      2. If they say "exclude X", remove relevant polygons and cost lines.
      3. If they say "increase Y", update calculations and logic.
      4. Ensure the AIA proposal (markdown) reflects these changes.
      5. Return the FULL updated JSON object.`,
      thinkingConfig: { thinkingBudget: 2000 },
      responseMimeType: "application/json",
    },
    contents: "Apply the requested modifications to the bid result."
  });

  return sanitizeResponse(response.text, currentResult.visualTakeoff.baseImage);
};

const sanitizeResponse = (text: string | undefined, baseImage: string): BidAnalysisResult => {
  if (!text) throw new Error("Empty AI response.");

  try {
    const jsonString = extractJson(text);
    const raw = JSON.parse(jsonString);
    
    return {
      markdown: raw.markdown || "No proposal generated.",
      costWorksheet: (raw.costWorksheet || []).map((div: any) => ({
        id: String(div.id || "00"),
        name: String(div.name || "Unknown Division"),
        items: (div.items || []).map((item: any) => ({
          id: String(item.id || Math.random().toString(36).substr(2, 9)),
          scope: String(item.scope || ""),
          qty: String(item.qty || "0"),
          unit: String(item.unit || "EA"),
          laborCosts: Number(item.laborCosts || 0),
          materialCosts: Number(item.materialCosts || 0),
          total: Number(item.total || 0),
          notes: String(item.notes || ""),
          subMarkup: ""
        }))
      })),
      visualTakeoff: {
        polygons: (raw.visualTakeoff?.polygons || []).map((p: any) => ({
          id: String(p.id || Math.random().toString(36).substr(2, 9)),
          scopeCode: String(p.scopeCode || ""),
          points: (p.points || []).map((pt: any) => ({ x: Number(pt.x), y: Number(pt.y) })),
          label: String(p.label || "Area"),
          qty: String(p.qty || "0"),
          unit: String(p.unit || "EA"),
          explanation: String(p.explanation || ""),
          color: String(p.color || "#3b82f6")
        })),
        baseImage
      }
    };
  } catch (e) {
    console.error("Parse error:", e);
    throw new Error("Formatting failed. Please refine your command.");
  }
};

const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
