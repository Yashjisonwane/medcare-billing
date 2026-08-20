// src/components/common/FMLogo.jsx
import React, { useState } from 'react';
import fmLogoImg from '../../assets/fm-logo.jpeg';
import { Maximize2, X } from 'lucide-react';

export const FMLogo = ({
  className = "w-14 h-14",
  showText = false,
  textClassName = "text-white",
  imgClassName = "",
  fit = "contain", // "contain" | "cover"
  shape = "rounded-xl", // "rounded-xl" | "rounded-full"
  allowEnlarge = true
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 select-none">
        <div
          onClick={() => allowEnlarge && setModalOpen(true)}
          className={`relative group flex items-center justify-center flex-shrink-0 ${shape} border border-amber-500/40 bg-[#FAF6F0] p-1 shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-amber-500/10 ${allowEnlarge ? 'cursor-pointer' : ''} ${className}`}
          title={allowEnlarge ? "Click to view full 6-modality logo" : "F&M Health & Wellness Logo"}
        >
          <img
            src={fmLogoImg}
            alt="F&M Health & Wellness Logo"
            className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${shape === 'rounded-full' ? 'rounded-full' : 'rounded-lg'} ${imgClassName}`}
            loading="eager"
          />

          {allowEnlarge && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <Maximize2 className="w-3.5 h-3.5 text-white filter drop-shadow" />
            </div>
          )}
        </div>

        {showText && (
          <div className="flex flex-col">
            <span className={`font-serif font-black tracking-widest text-base leading-none ${textClassName}`}>
              F&amp;M HEALTH &amp; WELLNESS
            </span>
            <span className="text-[10px] tracking-widest uppercase font-sans font-bold text-amber-400 mt-1">
              RELIEVE PAIN • HEAL MIND • RESTORE LIFE
            </span>
          </div>
        )}
      </div>

      {/* Full Logo Lightbox Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative bg-[#FAF6F0] rounded-2xl shadow-2xl p-4 sm:p-6 max-w-xl w-full border border-amber-500/30 overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between border-b border-amber-900/10 pb-3 mb-4">
              <div>
                <h3 className="font-serif font-black text-slate-900 text-lg">F&amp;M Health &amp; Wellness</h3>
                <p className="text-xs text-amber-800 font-medium">6-Modality Clinical &amp; Billing Brand Logo</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-auto rounded-xl bg-white p-2 shadow-inner border border-amber-200">
              <img
                src={fmLogoImg}
                alt="F&M Health & Wellness Full Logo & 6 Modalities"
                className="w-full h-auto object-contain max-h-[65vh] rounded-lg"
              />
            </div>

            <p className="text-center text-xs text-slate-500 font-medium mt-4">
              Click anywhere outside or hit ✕ to close preview
            </p>
          </div>
        </div>
      )}
    </>
  );
};


