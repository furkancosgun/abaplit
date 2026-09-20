import React from 'react';

export default function Form({ node, renderChildren }) {
  const key = node.key || node.form_key || '';
  return (
    <div className="st-form" data-form-key={key}>
      {renderChildren(node.children)}
    </div>
  );
}
