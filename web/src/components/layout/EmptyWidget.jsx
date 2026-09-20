import React from 'react';

export default function EmptyWidget({ node, renderChildren }) {
  if (node.children && node.children.length > 0) return <>{renderChildren(node.children)}</>;
  return <div className="st-empty" />;
}
