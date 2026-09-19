import React from 'react';

export default function Columns({ node, renderChildren }) {
  const colCount = parseInt(node.count, 10) || 2;
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
