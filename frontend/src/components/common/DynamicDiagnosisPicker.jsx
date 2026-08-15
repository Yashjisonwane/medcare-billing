// src/components/common/DynamicDiagnosisPicker.jsx
import React, { useState } from 'react';
import { Plus, X, Search, Activity, Sparkles, Check, Tag } from 'lucide-react';
import { COMMON_ICD10_CODES } from '../../constants/servicesCatalog';

const POINTER_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const DynamicDiagnosisPicker = ({ selectedCodes = [], onChange, label = "ICD-10 Diagnosis Codes (CMS Box 21 Alignment)" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customList, setCustomList] = useState([]);

  // Merge default list with any newly added custom codes
  const allAvailableCodes = [...COMMON_ICD10_CODES, ...customList];

  const filtered = allAvailableCodes.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleCode = (codeStr) => {
    let current = Array.isArray(selectedCodes) ? [...selectedCodes] : [];
    if (current.includes(codeStr)) {
      current = current.filter(c => c !== codeStr);
    } else {
      if (current.length >= 12) {
        alert('Maximum 12 ICD-10 diagnosis codes can be mapped per CMS-1500 claim standard (Box 21 A-L).');
        return;
      }
      current.push(codeStr);
    }
    onChange(current);
  };

  const handleRemoveCode = (codeStr) => {
    const current = (Array.isArray(selectedCodes) ? selectedCodes : []).filter(c => c !== codeStr);
    onChange(current);
  };

  const handleAddCustomCode = (e) => {
    if (e) e.preventDefault();
    if (!customCode.trim()) return;

    const formattedCode = customCode.trim().toUpperCase();
    const newEntry = {
      code: formattedCode,
      description: customDesc.trim() || 'Custom diagnosis description'
    };

    setCustomList(prev => [...prev.filter(c => c.code !== formattedCode), newEntry]);
    
    // Auto-select the newly added custom code
    if (!selectedCodes.includes(formattedCode)) {
      onChange([...selectedCodes, formattedCode]);
    }

    setCustomCode('');
    setCustomDesc('');
    setShowAddCustom(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>{label}</span>
          <span className="text-[10px] font-normal text-slate-500">
            ({selectedCodes.length}/12 Mapped)
          </span>
        </label>
        
        <button
          type="button"
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> {showAddCustom ? 'Close Custom Code Entry' : '+ Add Custom ICD-10 Code'}
        </button>
      </div>

      {/* Selected Diagnosis Badges with CMS Box 21 Pointer Letters (A, B, C, D...) */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] flex flex-wrap items-center gap-2">
        {selectedCodes.length === 0 ? (
          <span className="text-xs text-slate-400 italic">
            No diagnosis codes selected yet. Click from the suggestions below or type to search/add custom codes.
          </span>
        ) : (
          selectedCodes.map((codeStr, idx) => {
            const letter = POINTER_LETTERS[idx] || `${idx + 1}`;
            const matched = allAvailableCodes.find(c => c.code === codeStr);
            return (
              <span
                key={codeStr}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-teal-300 shadow-2xs rounded-lg text-xs text-slate-900 font-semibold"
              >
                <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-extrabold flex items-center justify-center font-mono">
                  {letter}
                </span>
                <span className="font-mono font-bold text-teal-900">{codeStr}</span>
                {matched && (
                  <span className="text-slate-500 text-[11px] max-w-[140px] truncate hidden md:inline">
                    {matched.description}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveCode(codeStr)}
                  className="p-0.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 cursor-pointer"
                  title="Remove diagnosis"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })
        )}
      </div>

      {/* Inline Custom Code Creator */}
      {showAddCustom && (
        <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-900">Add New Dynamic ICD-10 Code</span>
            <span className="text-[10px] text-teal-700 font-medium">Auto-saves to current session</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <input
                type="text"
                value={customCode}
                onChange={e => setCustomCode(e.target.value)}
                placeholder="ICD Code (e.g. M54.16)"
                className="w-full px-2.5 py-1.5 text-xs font-mono font-bold uppercase rounded-lg border border-teal-300 bg-white text-teal-950 focus:ring-1 focus:ring-teal-600 outline-none"
              />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <input
                type="text"
                value={customDesc}
                onChange={e => setCustomDesc(e.target.value)}
                placeholder="Diagnosis Description (e.g. Radiculopathy, lumbar region)"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-teal-300 bg-white text-slate-900 focus:ring-1 focus:ring-teal-600 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomCode}
                className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Add Code
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Suggestions Picker */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search ICD-10 codes by name or code (e.g. cervicalgia, low back pain, strain, M54)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-none transition"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
          {filtered.map(item => {
            const isSelected = selectedCodes.includes(item.code);
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleToggleCode(item.code)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40'
                }`}
              >
                <span className="font-mono font-bold">{item.code}</span>
                <span className="text-[10px] opacity-90 truncate max-w-[160px]">{item.description}</span>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
