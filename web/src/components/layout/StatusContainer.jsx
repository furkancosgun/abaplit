import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

export default function StatusContainer({ node, renderChildren }) {
  const [isOpen, setIsOpen] = useState(false);
  const statusState = node.state || 'complete';
  const label = node.label || 'Status';

  const renderIcon = () => {
    switch (statusState) {
      case 'running':
        return <Loader2 size={18} className="st-spinner-icon" />;
      case 'error':
        return <AlertCircle size={18} color="#ff2b2b" />;
      case 'complete':
      default:
        return <CheckCircle2 size={18} color="#09ab3b" />;
    }
  };

  return (
    <div className={`st-status-container ${statusState}`}>
      <div className="st-status-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="st-status-info">
          {renderIcon()}
          <span className="st-status-title">{label}</span>
        </div>
        <div className="st-status-toggle">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </div>
      {isOpen && (
        <div className="st-status-body">
          {renderChildren(node.children)}
        </div>
      )}
    </div>
  );
}
