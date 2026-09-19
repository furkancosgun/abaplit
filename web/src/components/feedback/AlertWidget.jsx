import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export default function AlertWidget({ type, text }) {
  const renderAlertContent = () => {
    switch (type) {
      case 'success':
        return (
          <div className="st-alert success">
            <CheckCircle2 size={18} color="#09ab3b" />
            <span>{text}</span>
          </div>
        );
      case 'info':
        return (
          <div className="st-alert info">
            <Info size={18} color="#1e88e5" />
            <span>{text}</span>
          </div>
        );
      case 'warning':
        return (
          <div className="st-alert warning">
            <AlertTriangle size={18} color="#ffaa00" />
            <span>{text}</span>
          </div>
        );
      case 'error':
      default:
        return (
          <div className="st-alert error">
            <AlertCircle size={18} color="#ff2b2b" />
            <span>{text}</span>
          </div>
        );
    }
  };

  return renderAlertContent();
}
