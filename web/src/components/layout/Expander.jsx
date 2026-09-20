import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getBoundValue } from '../../core/binding';

export default function Expander({ node, state, renderChildren }) {
  const [isOpen, setIsOpen] = useState(false);
  const { label } = node;
  const boundLabel = getBoundValue(label, state);

  return (
    <div className="st-expander">
      <div className="st-expander-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{boundLabel || 'Details'}</span>
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
