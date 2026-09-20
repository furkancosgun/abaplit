import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function Form({ node, state, renderChildren }) {
  const raw = node.key || node.form_key || '';
  const key = getBoundValue(raw, state);
  return (
    <div className="st-form" data-form-key={key}>
      {renderChildren(node.children)}
    </div>
  );
}
