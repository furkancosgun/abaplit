import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Slider({ node, state, onValueChange, onEvent }) {
  const { label, value, min, max, step, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Slider)" />;
  }

  const curVal = bound.isBound ? (bound.value ?? min ?? '0') : (value ?? min ?? '0');
  const minNum = parseFloat(min ?? '0') || 0;
  const maxNum = parseFloat(max ?? '100') || 100;
  const curNum = parseFloat(curVal) || 0;
  const pct = Math.max(0, Math.min(100, ((curNum - minNum) / (maxNum - minNum || 1)) * 100));

  return (
    <div className="st-input-group">
      <div className="st-slider-header">
        {label && <label className="st-label">{label}</label>}
        <span className="st-slider-val">{curVal}</span>
      </div>
      <input
        type="range"
        className="st-slider"
        min={min || '0'}
        max={max || '100'}
        step={step || '1'}
        value={curVal}
        style={{ '--value-percent': `${pct}%` }}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
          if (on_change) onEvent(on_change, e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && on_submit) {
            onEvent(on_submit, e.target.value);
          }
        }}
      />
    </div>
  );
}
