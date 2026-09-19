import React from 'react';
import { X, Bell } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="st-toast-wrapper">
      {toasts.map((t) => (
        <div key={t.id} className="st-toast-item">
          <div className="st-toast-body">
            <Bell size={16} className="st-toast-icon" />
            <span className="st-toast-msg">{t.text}</span>
          </div>
          <button
            type="button"
            className="st-toast-close"
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
