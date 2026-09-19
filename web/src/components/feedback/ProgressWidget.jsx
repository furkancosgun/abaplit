import React from 'react';

export default function ProgressWidget({ node }) {
  const { value, text } = node;
  const pct = Math.max(0, Math.min(100, parseFloat(value) || 0));

  return (
    <div className="st-progress-group">
      {text && <span className="st-progress-text">{text}</span>}
      <div className="st-progress-track">
        <div className="st-progress-bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
