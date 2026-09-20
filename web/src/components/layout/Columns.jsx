import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function Columns({ node, state, renderChildren }) {
  const boundCount = getBoundValue(node.count, state);
  const colCount = parseInt(boundCount, 10) || 2;
  const columns = node.children || [];

  return (
    <div className="st-columns" style={{ '--col-count': colCount }}>
      {columns.map((col, idx) => (
        <div key={idx} className="st-column">
          {renderChildren(col.children)}
        </div>
      ))}
    </div>
  );
}
