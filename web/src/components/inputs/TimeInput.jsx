import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function TimeInput({ node, state, onValueChange, onEvent }) {
  const { label, value, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (TimeInput)" />;
  }

  const curVal = bound.isBound ? (bound.value ?? '') : (value ?? '');

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <input
        type="time"
        className="st-text-input"
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
