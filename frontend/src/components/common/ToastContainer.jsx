// src/components/common/ToastContainer.jsx
import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map((toast) => {
        let bg = 'bg-primary text-white border-primary-container';
        let icon = <Info className="w-5 h-5 text-secondary-container" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-900/90 text-white border-emerald-500/50';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        } else if (toast.type === 'error') {
          bg = 'bg-error-container text-on-error-container border-error/30';
          icon = <AlertCircle className="w-5 h-5 text-error" />;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center justify-between gap-3 p-4 rounded-lg border shadow-lg backdrop-blur transition-all duration-300 ${bg}`}
          >
            <div className="flex items-center gap-3">
              {icon}
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-70 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
