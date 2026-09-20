import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function ToastWidget({ node, state }) {
  const raw = node.text || node.body || node.val || '';
  const message = getBoundValue(raw, state);

  return (
    <div className="st-toast-notification">
      <span>{message}</span>
    </div>
  );
}
