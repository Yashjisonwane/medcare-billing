// src/components/modals/Modal.jsx
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl',
  full: 'max-w-6xl'
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  size = 'xl',
  children,
  footer,
  iconColor = 'text-teal-600',
  iconBg = 'bg-teal-50'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-2 sm:p-4 md:p-6 text-center">
        <div
          className={`w-full ${SIZES[size] || SIZES.xl} transform overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[94dvh] sm:max-h-[90vh]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/90 flex-shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
              {Icon && (
                <div className={`p-2 sm:p-2.5 rounded-xl ${iconBg} ${iconColor} flex-shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate">{title}</h3>
                {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition flex-shrink-0 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body with Touch Momentum Scrolling */}
          <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4 touch-scroll flex-1 text-slate-800">
            {children}
          </div>

          {/* Footer (Responsive Stacking on Mobile) */}
          {footer && (
            <div className="border-t border-slate-200 px-4 sm:px-6 py-3 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
