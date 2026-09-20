import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { getBoundValue } from '../../core/binding';

const ALERT_CONFIG = {
  success: { icon: CheckCircle2, color: '#09ab3b', className: 'success' },
  info: { icon: Info, color: '#1e88e5', className: 'info' },
  warning: { icon: AlertTriangle, color: '#ffaa00', className: 'warning' },
  error: { icon: AlertCircle, color: '#ff2b2b', className: 'error' },
};

export default function AlertWidget({ type, text, state }) {
  const boundText = state ? getBoundValue(text, state) : text;
  const config = ALERT_CONFIG[type] || ALERT_CONFIG.error;
  const IconComponent = config.icon;

  return (
    <div className={`st-alert ${config.className}`}>
      <IconComponent size={18} color={config.color} />
      <span>{boundText}</span>
    </div>
  );
}
