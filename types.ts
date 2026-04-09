
export interface Point {
  x: number;
  y: number;
}

export interface TakeoffPolygon {
  id: string;
  scopeCode: string;
  points: Point[]; 
  label: string;
  qty: string;
  unit: string;
  explanation: string;
  color: string;
}

export interface CostEstimateLineItem {
  id: string; 
  scope: string;
  qty: string;
  unit: string;
  laborCosts: number;
  materialCosts: number;
  subMarkup: string;
  total: number;
  notes?: string;
}

export interface CostEstimateDivision {
  id: string;
  name: string;
  items: CostEstimateLineItem[];
}

export interface BidAnalysisResult {
  markdown: string;
  costWorksheet: CostEstimateDivision[];
  visualTakeoff: {
    baseImage: string;
    polygons: TakeoffPolygon[];
  };
}

export interface SubItem {
  code: string;
  title: string;
  description: string;
  selected: boolean;
}

export interface Trade {
  id: string;
  title: string;
  selected: boolean;
  subItems: SubItem[];
}

export interface Division {
  id: string;
  title: string;
  isOpen?: boolean;
  trades: Trade[];
}

// Market Profile Types
export type LaborTier = 'Low' | 'Average' | 'High';
export type Positioning = 'Competitive' | 'Standard' | 'Premium';
export type ProjectType = 'Multifamily' | 'Retail' | 'Office' | 'Industrial' | 'Hospitality' | 'Healthcare' | 'Education' | 'Mixed-Use';
export type Complexity = 'Low' | 'Normal' | 'High';
export type ScheduleUrgency = 'Normal' | 'Accelerated';
export type RiskTolerance = 'Low' | 'Normal' | 'High';

export interface MarketProfile {
  id: string;
  name: string;
  marketRegion: string;
  laborMarketTier: LaborTier;
  positioning: Positioning;
  projectType: ProjectType;
  complexity: Complexity;
  scheduleUrgency: ScheduleUrgency;
  unionLabor: boolean;
  prevailingWage: boolean;
  riskTolerance: RiskTolerance;
  includeContingency: boolean;
  contingencyPct: number;
  notes: string;
}

export const DEFAULT_MARKET_PROFILE: MarketProfile = {
  id: 'default',
  name: 'Standard Profile',
  marketRegion: 'Charleston, SC',
  laborMarketTier: 'Average',
  positioning: 'Standard',
  projectType: 'Multifamily',
  complexity: 'Normal',
  scheduleUrgency: 'Normal',
  unionLabor: false,
  prevailingWage: false,
  riskTolerance: 'Normal',
  includeContingency: true,
  contingencyPct: 0.03,
  notes: ''
};

export const HIERARCHICAL_SCOPES: Division[] = [
  {
    id: '01',
    title: 'General Requirements',
    trades: [
      {
        id: '01 50 00',
        title: 'Temporary Facilities',
        selected: false,
        subItems: [
          { code: '01 51 00', title: 'Temporary Utilities', description: 'Includes temporary electricity, water, gas, and telecommunications during construction.', selected: false },
          { code: '01 52 00', title: 'Construction Facilities', description: 'Includes field offices, storage sheds, and temporary sanitary facilities.', selected: false },
        ]
      }
    ]
  },
  {
    id: '02',
    title: 'Existing Conditions',
    trades: [
      {
        id: '02 41 00',
        title: 'Demolition',
        selected: false,
        subItems: [
          { code: '02 41 16', title: 'Structure Demolition', description: 'Full removal of existing structural elements and load-bearing walls.', selected: false },
          { code: '02 41 19', title: 'Selective Demolition', description: 'Removal of specific interior finishes, partitions, or equipment while preserving the main structure.', selected: false },
        ]
      }
    ]
  },
  {
    id: '03',
    title: 'Concrete',
    trades: [
      {
        id: '03 30 00',
        title: 'Cast-in-Place Concrete',
        selected: false,
        subItems: [
          { code: '03 31 00', title: 'Structural Concrete', description: 'Foundations, slabs-on-grade, elevated slabs, and structural columns.', selected: false },
          { code: '03 35 00', title: 'Concrete Finishing', description: 'Troweling, polishing, coloring, or applying protective sealants to concrete surfaces.', selected: false },
        ]
      }
    ]
  },
  {
    id: '04',
    title: 'Masonry',
    trades: [
      {
        id: '04 20 00',
        title: 'Unit Masonry',
        selected: false,
        subItems: [
          { code: '04 21 13', title: 'Brick Masonry', description: 'Installation of clay or calcium silicate brick for veneers or load-bearing walls.', selected: false },
          { code: '04 22 00', title: 'Concrete Unit Masonry', description: 'Standard CMU (Concrete Masonry Unit) block walls and reinforced lintels.', selected: false },
        ]
      }
    ]
  },
  {
    id: '05',
    title: 'Metals',
    trades: [
      {
        id: '05 12 00',
        title: 'Structural Steel',
        selected: false,
        subItems: [
          { code: '05 12 00.A', title: 'Structural Steel Framing', description: 'Beams, columns, and joists forming the primary building skeleton.', selected: false },
          { code: '05 50 00', title: 'Metal Fabrications', description: 'Handrails, stairs, ladders, and miscellaneous supports.', selected: false },
        ]
      }
    ]
  },
  {
    id: '06',
    title: 'Wood, Plastics, and Composites',
    trades: [
      {
        id: '06 10 00',
        title: 'Rough Carpentry',
        selected: false,
        subItems: [
          { code: '06 11 00', title: 'Wood Framing', description: 'Wall studs, roof rafters, and floor joists for wood-frame construction.', selected: false },
          { code: '06 20 00', title: 'Finish Carpentry', description: 'Installation of trim, molding, cabinetry, and interior millwork.', selected: false },
        ]
      }
    ]
  },
  {
    id: '07',
    title: 'Thermal and Moisture Protection',
    trades: [
      {
        id: '07 21 00',
        title: 'Thermal Insulation',
        selected: false,
        subItems: [
          { code: '07 21 13', title: 'Board Insulation', description: 'Rigid foam boards for exterior walls or roofing systems.', selected: false },
          { code: '07 50 00', title: 'Membrane Roofing', description: 'TPO, EPDM, or PVC flat roofing systems and accessories.', selected: false },
        ]
      }
    ]
  },
  {
    id: '08',
    title: 'Openings',
    trades: [
      {
        id: '08 11 00',
        title: 'Metal Doors & Frames',
        selected: false,
        subItems: [
          { code: '08 11 13', title: 'Hollow Metal Doors', description: 'Heavy-duty steel doors and knockdown or welded frames.', selected: false },
          { code: '08 11 16', title: 'Aluminum Entrances', description: 'Storefront entrance systems including hardware and automatic operators.', selected: false },
        ]
      },
      {
        id: '08 50 00',
        title: 'Windows',
        selected: false,
        subItems: [
          { code: '08 51 13', title: 'Aluminum Windows', description: 'Commercial-grade operable or fixed aluminum window units.', selected: false },
          { code: '08 80 00', title: 'Glazing', description: 'Insulated glass units, safety glass, and specialty films.', selected: false },
        ]
      }
    ]
  },
  {
    id: '09',
    title: 'Finishes',
    isOpen: true,
    trades: [
      {
        id: '09 91 00',
        title: 'Painting',
        selected: true,
        subItems: [
          { code: '09 91 23', title: 'Interior Painting', description: 'Standard drywall painting, trim coating, and specialty finishes.', selected: true },
          { code: '09 91 13', title: 'Exterior Painting', description: 'Masonry, metal, and wood exterior surface protection and decoration.', selected: false },
          { code: '09 91 33', title: 'Wood Staining', description: 'Staining and sealing of interior millwork, doors, and floors.', selected: false },
        ]
      },
      {
        id: '09 72 00',
        title: 'Wall Coverings',
        selected: false,
        subItems: [
          { code: '09 72 13', title: 'Vinyl Wallcovering', description: 'Heavy-duty commercial vinyl for high-traffic corridors and rooms.', selected: false },
          { code: '09 72 16', title: 'Fabric Wallcovering', description: 'Acoustic or decorative fabric panels and rolls.', selected: false },
        ]
      },
      {
        id: '09 29 00',
        title: 'Gypsum Board',
        selected: false,
        subItems: [
          { code: '09 29 00.A', title: 'Drywall Hanging', description: 'Installation of standard, moisture-resistant, or fire-rated boards.', selected: false },
          { code: '09 29 00.B', title: 'Level 5 Finishing', description: 'Premium smooth skim-coat finish for high-end lighting environments.', selected: false },
        ]
      },
      {
        id: '09 30 00',
        title: 'Tiling',
        selected: false,
        subItems: [
          { code: '09 30 13', title: 'Ceramic Tiling', description: 'Wall and floor tiling including waterproofing membranes and grouting.', selected: false },
          { code: '09 60 00', title: 'Flooring', description: 'Resilient flooring, carpet, LVT, and wood floor systems.', selected: false },
        ]
      }
    ]
  },
  {
    id: '10',
    title: 'Specialties',
    trades: [
      {
        id: '10 14 00',
        title: 'Signage',
        selected: false,
        subItems: [
          { code: '10 28 00', title: 'Toilet Accessories', description: 'Paper towel dispensers, grab bars, mirrors, and soap dispensers.', selected: false },
          { code: '10 44 00', title: 'Fire Protection Specialties', description: 'Fire extinguishers, cabinets, and mounting hardware.', selected: false },
        ]
      }
    ]
  },
  {
    id: '21',
    title: 'Fire Suppression',
    trades: [
      {
        id: '21 10 00',
        title: 'Water-Based Fire Suppression',
        selected: false,
        subItems: [
          { code: '21 13 13', title: 'Wet-Pipe Sprinkler Systems', description: 'Standard overhead sprinkler piping and heads for typical occupancy.', selected: false },
        ]
      }
    ]
  },
  {
    id: '22',
    title: 'Plumbing',
    trades: [
      {
        id: '22 10 00',
        title: 'Plumbing Piping',
        selected: false,
        subItems: [
          { code: '22 40 00', title: 'Plumbing Fixtures', description: 'Sinks, toilets, water heaters, and associated trim/fittings.', selected: false },
        ]
      }
    ]
  },
  {
    id: '23',
    title: 'HVAC',
    trades: [
      {
        id: '23 30 00',
        title: 'HVAC Air Distribution',
        selected: false,
        subItems: [
          { code: '23 31 13', title: 'Metal Ducts', description: 'Supply, return, and exhaust ductwork fabrication and installation.', selected: false },
        ]
      }
    ]
  },
  {
    id: '26',
    title: 'Electrical',
    trades: [
      {
        id: '26 05 00',
        title: 'Common Work Results for Electrical',
        selected: false,
        subItems: [
          { code: '26 20 00', title: 'Low-Voltage Electrical Distribution', description: 'Switchboards, panelboards, and branch circuit wiring.', selected: false },
          { code: '26 50 00', title: 'Lighting', description: 'Interior and exterior luminaires, emergency lighting, and controls.', selected: false },
        ]
      }
    ]
  },
  {
    id: '31',
    title: 'Earthwork',
    trades: [
      {
        id: '31 20 00',
        title: 'Earth Moving',
        selected: false,
        subItems: [
          { code: '31 23 16', title: 'Excavation', description: 'Mass grading, trenching for utilities, and backfilling.', selected: false },
        ]
      }
    ]
  },
  {
    id: '32',
    title: 'Exterior Improvements',
    trades: [
      {
        id: '32 10 00',
        title: 'Bases, Ballasts, and Paving',
        selected: false,
        subItems: [
          { code: '32 12 16', title: 'Asphalt Paving', description: 'Driveways, parking lots, and road surfaces including striping.', selected: false },
          { code: '32 90 00', title: 'Planting', description: 'Trees, shrubs, groundcover, and irrigation systems.', selected: false },
        ]
      }
    ]
  },
  {
    id: '33',
    title: 'Utilities',
    trades: [
      {
        id: '33 40 00',
        title: 'Storm Drainage Utilities',
        selected: false,
        subItems: [
          { code: '33 41 00', title: 'Storm Utility Drainage Piping', description: 'Exterior storm sewers, catch basins, and detention systems.', selected: false },
        ]
      }
    ]
  }
];

export type BidFormat = 'TM' | 'UNIT' | 'BOTH';

export interface ScopeOption {
  code: string;
  title: string;
  description: string;
  selected: boolean;
}
export const AIA_SCOPES: ScopeOption[] = [];
