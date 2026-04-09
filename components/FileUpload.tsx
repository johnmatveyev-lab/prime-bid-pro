import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const validateAndSelect = (file: File) => {
    // Basic validation
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (validTypes.includes(file.type)) {
      onFileSelect(file);
    } else {
      alert("Please upload a PDF or Image file.");
    }
  };

  return (
    <div 
      className={`w-full max-w-2xl p-10 border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer group
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.01]' 
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50 bg-white'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileInput} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png,.webp"
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-slate-800 mb-2">Upload Architectural Set</h3>
        <p className="text-slate-500 mb-6 max-w-sm">
          Drag & drop your PDF here, or click to browse.
          <br/>
          <span className="text-xs text-slate-400 mt-2 block">Supports PDF, PNG, JPG</span>
        </p>
        <button className="px-6 py-2 bg-slate-900 text-white text-sm font-medium rounded-md shadow hover:bg-slate-800 transition-colors pointer-events-none">
          Select File
        </button>
      </div>
    </div>
  );
};