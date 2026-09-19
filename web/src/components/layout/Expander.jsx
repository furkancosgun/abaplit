import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function Expander({ node, renderChildren }) {
  const [isOpen, setIsOpen] = useState(false);
  const { label } = node;

  return (
    <div className="st-expander">
      <div className="st-expander-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{label || 'Details'}</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>
      {isOpen && (
        <div className="st-expander-body">
          {renderChildren(node.children)}
        </div>
      )}
    </div>
  );
}
