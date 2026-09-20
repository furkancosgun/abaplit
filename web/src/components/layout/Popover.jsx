import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { getBoundValue } from '../../core/binding';

export default function Popover({ node, state, renderChildren }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const rawLabel = node.label || 'Options';
  const label = getBoundValue(rawLabel, state);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="st-popover-container" ref={popoverRef}>
      <button
        type="button"
        className="st-btn st-popover-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="st-popover-card">
          <div className="st-popover-header">
            <span>{label}</span>
            <button
              type="button"
              className="st-dialog-close"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="st-popover-content">
            {renderChildren(node.children)}
          </div>
        </div>
      )}
    </div>
  );
}
