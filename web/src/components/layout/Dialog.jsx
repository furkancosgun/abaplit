import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function Dialog({ node, renderChildren }) {
  const [isOpen, setIsOpen] = useState(true);
  const { title } = node;

  if (!isOpen) {
    return (
      <button
        type="button"
        className="st-btn"
        style={{ marginBottom: '1rem' }}
        onClick={() => setIsOpen(true)}
      >
        Open Dialog: {title || 'Details'}
      </button>
    );
  }

  return (
    <div className="st-dialog-overlay" onClick={() => setIsOpen(false)}>
      <div className="st-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="st-dialog-header">
          <h3>{title || 'Dialog'}</h3>
          <button
            type="button"
            className="st-dialog-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="st-dialog-body">
          {renderChildren(node.children)}
        </div>
      </div>
    </div>
  );
}
