import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Slider({ node, state, onValueChange, onEvent }) {
  const { label, value, min, max, step, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Slider)" />;
  }

  const curVal = bound.isBound ? (bound.value ?? min ?? '0') : (value ?? min ?? '0');

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
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
          if (event) onEvent(event);
        }}
      />
    </div>
  );
}
