import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function DateInput({ node, state, onValueChange, onEvent }) {
  const { label, value, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (DateInput)" />;
  }

  const curVal = bound.isBound ? (bound.value ?? '') : (value ?? '');

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <input
        type="date"
        className="st-text-input"
        value={curVal}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
          if (on_change) onEvent(on_change);
          if (on_submit) onEvent(on_submit);
        }}
      />
    </div>
  );
}
