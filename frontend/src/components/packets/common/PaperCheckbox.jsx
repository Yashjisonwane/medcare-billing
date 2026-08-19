// src/components/packets/common/PaperCheckbox.jsx
import React from 'react';

/**
 * Absolute-Positioned Paper Checkbox Component
 * Preserves fixed PDF proportions and supports manual/auto toggling
 */
export const PaperCheckbox = ({
  label,
  checked = false,
  onChange,
  source = 'AUTO',
  readOnly = false,
  x,
  y,
  size = 14,
  style = {}
}) => {
  const handleClick = (e) => {
    e.stopPropagation();
    if (readOnly || !onChange) return;
    onChange(!checked);
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute flex items-center gap-1 font-mono text-[10px] select-none ${
        readOnly ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
      }`}
      style={{ left: `${x}px`, top: `${y}px`, ...style }}
      title={source === 'MANUAL' ? 'Manually Modified Field' : 'Auto-Populated Field'}
    >
      <div
        className={`relative flex items-center justify-center border ${
          source === 'MANUAL' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-800 bg-white'
        } print:border-black print:bg-transparent`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {checked && (
          <svg className="w-full h-full p-0.5 text-slate-900 print:text-black font-bold" viewBox="0 0 12 12">
            <path
              d="M 2 2 L 10 10 M 10 2 L 2 10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      {label && <span className="text-slate-900 print:text-black font-bold leading-none">{label}</span>}
    </div>
  );
};
