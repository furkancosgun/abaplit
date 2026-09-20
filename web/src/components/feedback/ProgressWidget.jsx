import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function ProgressWidget({ node, state }) {
  const { value, text } = node;
  const boundValue = getBoundValue(value, state);
  const boundText = getBoundValue(text, state);
  const pct = Math.max(0, Math.min(100, parseFloat(boundValue) || 0));

  return (
    <div className="st-progress-group">
      {boundText && <span className="st-progress-text">{boundText}</span>}
      <div className="st-progress-track">
        <div className="st-progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
