import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { getBoundValue } from '../../core/binding';

const STATUS_CONFIG = {
  running: { icon: Loader2, className: 'st-spinner-icon' },
  error: { icon: AlertCircle, color: '#ff2b2b' },
  complete: { icon: CheckCircle2, color: '#09ab3b' },
};

export default function StatusContainer({ node, state, renderChildren }) {
  const [isOpen, setIsOpen] = useState(false);
  const statusState = getBoundValue(node.state, state) || 'complete';
  const label = getBoundValue(node.label, state) || 'Status';

  const config = STATUS_CONFIG[statusState] || STATUS_CONFIG.complete;
  const IconComponent = config.icon;

  return (
    <div className={`st-status-container ${statusState}`}>
      <div className="st-status-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="st-status-info">
          <IconComponent size={18} color={config.color} className={config.className} />
          <span className="st-status-title">{label}</span>
        </div>
        <div className="st-status-toggle">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
      {isOpen && <div className="st-status-body">{renderChildren(node.children)}</div>}
    </div>
  );
}
