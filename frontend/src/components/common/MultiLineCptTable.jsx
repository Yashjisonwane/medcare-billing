// src/components/common/MultiLineCptTable.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, Tag, Info, Sparkles, ChevronDown, Check, Search, X } from 'lucide-react';
import { COMMON_CPT_CODES, COMMON_MODIFIERS, createDefaultServiceLine } from '../../constants/servicesCatalog';

/**
 * High-End Portal Modifier Dropdown:
 * Renders directly onto document.body using createPortal with calculated fixed positioning.
 * Guaranteed 100% visible - NEVER clipped by table overflow, modal borders, or scroll containers!
 */
const ModifierPortalDropdown = ({ value, onChange, placeholder = "--", title = "Modifier" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [search, setSearch] = useState('');
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Position calculation on open
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Position dropdown centered under button
      const dropdownWidth = 260;
      let leftPos = rect.left + rect.width / 2 - dropdownWidth / 2;
      
      // Screen edge boundary safety
      if (leftPos < 10) leftPos = 10;
      if (leftPos + dropdownWidth > window.innerWidth - 10) {
        leftPos = window.innerWidth - dropdownWidth - 10;
      }

      setCoords({
        top: rect.bottom + 6,
        left: leftPos
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setSearch('');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close on outside click or window scroll
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const filteredModifiers = COMMON_MODIFIERS.filter(m => 
    !search || 
    m.code.toLowerCase().includes(search.toLowerCase()) || 
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    onChange(code);
    setIsOpen(false);
  };

  const handleCustomType = (e) => {
    if (e.key === 'Enter') {
      const customCode = search.toUpperCase().trim().slice(0, 2);
      if (customCode) {
        handleSelect(customCode);
      }
    }
  };

  return (
    <>
      {/* Pill Dropdown Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        title={`${title}: ${value || 'Click to select or type modifier'}`}
        className={`w-12 h-8 px-1.5 rounded-xl text-xs font-mono font-bold flex items-center justify-between gap-1 border transition-all cursor-pointer select-none active:scale-95 ${
          value
            ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-2xs ring-1 ring-teal-200'
            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white hover:border-slate-300 hover:text-slate-700'
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : 'text-slate-400'}`} />
      </button>

      {/* Portal Dropdown Menu (Mounted on document.body to bypass all table overflow clipping) */}
      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 99999
          }}
          className="w-[260px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search & Custom Type Input */}
          <div className="p-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Search or type code (e.g. 25, RT)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleCustomType}
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 outline-none font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Clear Option */}
          <div className="px-2 py-1 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <span>Standard Modifiers</span>
            {value && (
              <button
                type="button"
                onClick={() => handleSelect('')}
                className="text-rose-600 hover:underline cursor-pointer lowercase font-bold"
              >
                clear selection
              </button>
            )}
          </div>

          {/* List of Modifiers with Full Descriptions */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-100 touch-scroll">
            <div
              onClick={() => handleSelect('')}
              className={`px-2.5 py-1.5 rounded-xl cursor-pointer text-xs flex items-center justify-between transition ${
                !value ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-500'
              }`}
            >
              <span>-- None / No Modifier --</span>
              {!value && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
            </div>

            {filteredModifiers.map((m) => {
              const isSelected = value === m.code;
              return (
                <div
                  key={m.code}
                  onClick={() => handleSelect(m.code)}
                  className={`px-2.5 py-2 rounded-xl cursor-pointer text-xs flex items-start gap-2 transition ${
                    isSelected ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="font-mono font-bold px-1.5 py-0.5 bg-slate-100 rounded text-[11px] text-teal-800 border border-slate-200 shrink-0">
                    {m.code}
                  </span>
                  <span className="text-[11px] text-slate-600 leading-snug flex-1">
                    {m.description}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />}
                </div>
              );
            })}

            {filteredModifiers.length === 0 && search && (
              <div
                onClick={() => handleSelect(search.toUpperCase().trim().slice(0, 2))}
                className="p-3 text-center cursor-pointer hover:bg-teal-50 rounded-xl transition"
              >
                <p className="text-[11px] text-slate-700">Use custom typed modifier:</p>
                <span className="inline-block mt-1 font-mono font-bold text-xs px-2.5 py-1 bg-teal-600 text-white rounded-lg shadow-2xs">
                  {search.toUpperCase().trim().slice(0, 2)} (Click or press Enter)
                </span>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export const MultiLineCptTable = ({ lines = [], onChange, title = "Appointment CPT Billing Lines & Modifiers" }) => {

  const handleAddLine = () => {
    const nextLineNum = lines.length + 1;
    const defaultCpt = nextLineNum === 1 ? '99204' : nextLineNum === 2 ? '97039' : nextLineNum === 3 ? '0101T' : '97110';
    const matched = COMMON_CPT_CODES.find(c => c.code === defaultCpt);
    const newLine = createDefaultServiceLine(
      nextLineNum,
      defaultCpt,
      matched ? matched.description : 'Therapeutic Modality Session',
      matched ? matched.defaultFee : 150.00
    );
    const pointerLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    newLine.diagnosisPointer = pointerLetters[(nextLineNum - 1) % pointerLetters.length] || 'A';
    onChange([...lines, newLine]);
  };

  const handleRemoveLine = (idx) => {
    if (lines.length <= 1) return;
    const updated = lines.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleUpdateLine = (idx, field, val) => {
    const updated = lines.map((line, i) => {
      if (i !== idx) return line;
      const updatedLine = { ...line, [field]: val };
      
      // Auto-fill description & standard fee if CPT code changes
      if (field === 'cptCode') {
        const matched = COMMON_CPT_CODES.find(c => c.code === val);
        if (matched) {
          updatedLine.description = matched.description;
          updatedLine.charge = matched.defaultFee;
        }
      }
      return updatedLine;
    });
    onChange(updated);
  };

  const totalCharges = lines.reduce((acc, line) => {
    const units = parseFloat(line.units) || 1;
    const charge = parseFloat(line.charge) || 0;
    return acc + (units * charge);
  }, 0);

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg border border-teal-100">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">{title}</h3>
            <span className="text-[10px] text-slate-500">Service lines with CPT procedure dropdowns &amp; 4-box Modifier selectors</span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 bg-teal-50 text-teal-800 text-[11px] font-bold rounded-xl border border-teal-200 font-mono">
            {lines.length} {lines.length === 1 ? 'Procedure Line' : 'Procedure Lines'}
          </span>
          <button
            type="button"
            onClick={handleAddLine}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add CPT Line
          </button>
        </div>
      </div>

      {/* High-Density Responsive Table Layout */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-2 text-center w-8">#</th>
              <th className="py-2.5 px-2 min-w-[140px]">CPT Code</th>
              <th className="py-2.5 px-2 min-w-[180px]">Procedure Description</th>
              <th className="py-2.5 px-2 min-w-[210px] text-center">Modifiers (Mod 1 - 4)</th>
              <th className="py-2.5 px-2 min-w-[90px] text-center">Diag Ptr</th>
              <th className="py-2.5 px-2 min-w-[55px] text-center">Units</th>
              <th className="py-2.5 px-2 min-w-[80px] text-right">Fee ($)</th>
              <th className="py-2.5 px-2 min-w-[85px] text-right">Total ($)</th>
              <th className="py-2.5 px-2 text-center w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 bg-white">
            {lines.map((line, idx) => {
              const lineTotal = ((parseFloat(line.units) || 1) * (parseFloat(line.charge) || 0)).toFixed(2);
              return (
                <tr key={line.id || idx} className="hover:bg-slate-50 transition">
                  {/* Line Number */}
                  <td className="py-2.5 px-2 text-center font-bold text-slate-400 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-100 inline-flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                  </td>

                  {/* CPT Code Picker */}
                  <td className="py-2 px-2">
                    <select
                      value={line.cptCode}
                      onChange={(e) => handleUpdateLine(idx, 'cptCode', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-teal-800 bg-teal-50/70 border border-teal-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
                    >
                      {COMMON_CPT_CODES.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {c.description.substring(0, 22)}...
                        </option>
                      ))}
                      {!COMMON_CPT_CODES.some(c => c.code === line.cptCode) && (
                        <option value={line.cptCode}>{line.cptCode}</option>
                      )}
                    </select>
                  </td>

                  {/* Description Input */}
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleUpdateLine(idx, 'description', e.target.value)}
                      placeholder="Clinical description"
                      className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* 4 Clean Modifier Dropdowns with Portal Overlay Rendering */}
                  <td className="py-2 px-2">
                    <div className="flex items-center justify-center gap-1.5">
                      {['modifier1', 'modifier2', 'modifier3', 'modifier4'].map((modKey, mIdx) => (
                        <ModifierPortalDropdown
                          key={modKey}
                          value={line[modKey]}
                          onChange={(val) => handleUpdateLine(idx, modKey, val)}
                          title={`Modifier ${mIdx + 1}`}
                          placeholder="--"
                        />
                      ))}
                    </div>
                  </td>

                  {/* Diagnosis Pointer */}
                  <td className="py-2 px-2 text-center">
                    <select
                      value={line.diagnosisPointer || 'A'}
                      onChange={(e) => handleUpdateLine(idx, 'diagnosisPointer', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none cursor-pointer"
                    >
                      <option value="A">Ptr A (Primary)</option>
                      <option value="B">Ptr B (Secondary)</option>
                      <option value="C">Ptr C</option>
                      <option value="D">Ptr D</option>
                      <option value="AB">Ptr A, B</option>
                      <option value="ABCD">Ptr A-D</option>
                    </select>
                  </td>

                  {/* Units */}
                  <td className="py-2 px-2 text-center">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={line.units || 1}
                      onChange={(e) => handleUpdateLine(idx, 'units', parseInt(e.target.value) || 1)}
                      className="w-full px-1 py-1.5 text-xs text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Unit Fee ($) */}
                  <td className="py-2 px-2 text-right">
                    <input
                      type="number"
                      step="0.01"
                      value={line.charge || ''}
                      onChange={(e) => handleUpdateLine(idx, 'charge', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-2 py-1.5 text-xs text-right font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Total Line Charge ($) */}
                  <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                    ${lineTotal}
                  </td>

                  {/* Delete Button */}
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      disabled={lines.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 rounded-lg transition cursor-pointer"
                      title={lines.length <= 1 ? "At least one service line is required" : "Delete Line"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Total Summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
          <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>Click any <strong>[ Mod v ]</strong> pill to search, type, or pick modifiers with instant descriptions.</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto font-bold text-xs">
          <span className="text-slate-500 uppercase text-[10px]">Total Calculated Charges:</span>
          <span className="text-sm font-mono font-extrabold text-teal-700">${totalCharges.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
