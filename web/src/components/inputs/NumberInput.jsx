import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function NumberInput({ node, state, onValueChange, onEvent }) {
  const { label, value, min, max, step, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (NumberInput)" />;
  }

  const currentValue = bound.isBound ? (bound.value ?? 0) : (value ?? 0);

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <input
        type="number"
        className="st-number-input"
        value={currentValue}
        min={min}
        max={max}
        step={step || '1'}
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
