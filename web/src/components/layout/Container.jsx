import React from 'react';

export default function Container({ node, renderChildren }) {
  return (
    <div className="st-container">
      {renderChildren(node.children)}
    </div>
  );
}
