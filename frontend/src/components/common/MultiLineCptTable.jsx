// src/components/common/MultiLineCptTable.jsx
import React from 'react';
import { Plus, Trash2, Tag, Info } from 'lucide-react';
import { COMMON_CPT_CODES, COMMON_MODIFIERS, createDefaultServiceLine } from '../../constants/servicesCatalog';

export const MultiLineCptTable = ({ lines = [], onChange, title = "Service & CPT Billing Lines (Multi-Code & Modifiers)" }) => {

  const handleAddLine = () => {
    const nextLineNum = lines.length + 1;
    const newLine = createDefaultServiceLine(
      nextLineNum,
      '97110',
      'Therapeutic Exercise (15 min)',
      110.00
    );
    // Auto assign diagnosis pointer sequence A, B, C, D...
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
      
      // If CPT code was selected from preset, auto-fill description & standard fee if empty
      if (field === 'cptCode') {
        const matched = COMMON_CPT_CODES.find(c => c.code === val);
        if (matched) {
          updatedLine.description = matched.description;
          if (!line.charge || line.charge === 0) {
            updatedLine.charge = matched.defaultFee;
          }
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
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-teal-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">{title}</h3>
          <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-full border border-teal-200">
            {lines.length} {lines.length === 1 ? 'Line Item' : 'Line Items'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddLine}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" /> Add Code Line
        </button>
      </div>

      <p className="text-[11px] text-slate-500">
        Enter multiple CPT procedure codes with up to 4 Modifiers (e.g. 25, 59, RT, LT) and linked ICD-10 Diagnosis Pointers (A, B, C, D) required for billing &amp; CMS-1500 claims.
      </p>

      {/* Lines Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-50/80 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-2 text-center w-10">#</th>
              <th className="py-2.5 px-2 min-w-[140px]">CPT Code</th>
              <th className="py-2.5 px-2 min-w-[200px]">Description</th>
              <th className="py-2.5 px-2 min-w-[70px]">Mod 1</th>
              <th className="py-2.5 px-2 min-w-[70px]">Mod 2</th>
              <th className="py-2.5 px-2 min-w-[70px]">Mod 3</th>
              <th className="py-2.5 px-2 min-w-[70px]">Mod 4</th>
              <th className="py-2.5 px-2 min-w-[90px]">Diag Ptr</th>
              <th className="py-2.5 px-2 min-w-[65px] text-center">Units</th>
              <th className="py-2.5 px-2 min-w-[90px] text-right">Fee ($)</th>
              <th className="py-2.5 px-2 min-w-[90px] text-right">Total ($)</th>
              <th className="py-2.5 px-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.map((line, idx) => {
              const lineTotal = ((parseFloat(line.units) || 1) * (parseFloat(line.charge) || 0)).toFixed(2);
              return (
                <tr key={line.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  {/* Line Number */}
                  <td className="py-2 px-2 text-center font-bold text-slate-500 text-xs">
                    {idx + 1}
                  </td>

                  {/* CPT Code */}
                  <td className="py-2 px-2">
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={line.cptCode}
                        onChange={(e) => handleUpdateLine(idx, 'cptCode', e.target.value)}
                        placeholder="e.g. 99204"
                        list={`cpt-list-${idx}`}
                        className="w-full px-2 py-1.5 text-xs font-mono font-bold text-teal-800 bg-teal-50/50 border border-teal-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                      />
                      <datalist id={`cpt-list-${idx}`}>
                        {COMMON_CPT_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.code} — {c.description}</option>
                        ))}
                      </datalist>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={line.description}
                      onChange={(e) => handleUpdateLine(idx, 'description', e.target.value)}
                      placeholder="Procedure description"
                      className="w-full px-2 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Modifier 1 */}
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={line.modifier1 || ''}
                      onChange={(e) => handleUpdateLine(idx, 'modifier1', e.target.value.toUpperCase())}
                      placeholder="25"
                      list="modifiers-list"
                      className="w-full px-1.5 py-1.5 text-xs text-center font-mono font-semibold uppercase text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Modifier 2 */}
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={line.modifier2 || ''}
                      onChange={(e) => handleUpdateLine(idx, 'modifier2', e.target.value.toUpperCase())}
                      placeholder="59"
                      list="modifiers-list"
                      className="w-full px-1.5 py-1.5 text-xs text-center font-mono font-semibold uppercase text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Modifier 3 */}
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={line.modifier3 || ''}
                      onChange={(e) => handleUpdateLine(idx, 'modifier3', e.target.value.toUpperCase())}
                      placeholder="RT"
                      list="modifiers-list"
                      className="w-full px-1.5 py-1.5 text-xs text-center font-mono font-semibold uppercase text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Modifier 4 */}
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      maxLength={2}
                      value={line.modifier4 || ''}
                      onChange={(e) => handleUpdateLine(idx, 'modifier4', e.target.value.toUpperCase())}
                      placeholder="GP"
                      list="modifiers-list"
                      className="w-full px-1.5 py-1.5 text-xs text-center font-mono font-semibold uppercase text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Diagnosis Pointer */}
                  <td className="py-2 px-2">
                    <select
                      value={line.diagnosisPointer || 'A'}
                      onChange={(e) => handleUpdateLine(idx, 'diagnosisPointer', e.target.value)}
                      className="w-full px-1.5 py-1.5 text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    >
                      <option value="A">Ptr A (Primary)</option>
                      <option value="B">Ptr B</option>
                      <option value="C">Ptr C</option>
                      <option value="D">Ptr D</option>
                      <option value="AB">Ptr A, B</option>
                      <option value="ABCD">Ptr A-D</option>
                    </select>
                  </td>

                  {/* Units */}
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={line.units || 1}
                      onChange={(e) => handleUpdateLine(idx, 'units', parseInt(e.target.value) || 1)}
                      className="w-full px-1 py-1.5 text-xs text-center font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Unit Fee */}
                  <td className="py-2 px-2">
                    <input
                      type="number"
                      step="0.01"
                      value={line.charge || ''}
                      onChange={(e) => handleUpdateLine(idx, 'charge', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-2 py-1.5 text-xs text-right font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-600 outline-none"
                    />
                  </td>

                  {/* Total Line Charge */}
                  <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                    ${lineTotal}
                  </td>

                  {/* Remove Button */}
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      disabled={lines.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition cursor-pointer"
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

      {/* Global Datalist for Modifiers */}
      <datalist id="modifiers-list">
        {COMMON_MODIFIERS.map(m => (
          <option key={m.code} value={m.code}>{m.code} — {m.description}</option>
        ))}
      </datalist>

      {/* Footer Total Summary & Quick Helpers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <Info className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Modifiers (e.g. <strong>25</strong> for separate E&amp;M, <strong>59</strong> for distinct procedure, <strong>RT/LT</strong> for anatomical side).</span>
        </div>
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Calculated Charges</span>
            <span className="text-sm font-extrabold text-teal-700 font-mono">
              ${totalCharges.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
