// src/components/packets/common/PaperTextField.jsx
import React from 'react';

/**
 * Absolute-Positioned Paper Text Field Component
 */
export const PaperTextField = ({
  value = '',
  onChange,
  source = 'AUTO',
  readOnly = false,
  x,
  y,
  width,
  fontSize = 11,
  fontWeight = 'bold',
  multiline = false,
  className = ''
}) => {
  const handleChange = (e) => {
    if (readOnly || !onChange) return;
    onChange(e.target.value);
  };

  return (
    <div
      className="absolute font-mono leading-none"
      style={{ left: `${x}px`, top: `${y}px`, width: width ? `${width}px` : 'auto' }}
    >
      {readOnly ? (
        <span
          className={`text-slate-900 print:text-black uppercase ${
            source === 'MANUAL' ? 'bg-amber-100/60 font-bold' : ''
          } ${className}`}
          style={{ fontSize: `${fontSize}px`, fontWeight }}
        >
          {value}
        </span>
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`w-full bg-transparent border-b border-dashed border-slate-300 focus:border-teal-600 focus:bg-teal-50/50 text-slate-900 font-bold uppercase p-0.5 outline-none font-mono ${
            source === 'MANUAL' ? 'bg-amber-50 text-amber-900 border-amber-400' : ''
          } ${className}`}
          style={{ fontSize: `${fontSize}px` }}
        />
      )}
    </div>
  );
};
