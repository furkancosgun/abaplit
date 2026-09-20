import React from 'react';
import { Loader2 } from 'lucide-react';
import { getBoundValue } from '../../core/binding';

export default function SpinnerWidget({ node, state }) {
  const raw = node.text || node.body || node.val || 'Loading...';
  const message = getBoundValue(raw, state);

  return (
    <div className="st-spinner-box">
      <Loader2 size={20} className="st-spinner-icon" />
      <span>{message}</span>
    </div>
  );
}
