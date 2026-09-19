import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Checkbox({ node, state, onValueChange, onEvent }) {
  const { label, value, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Checkbox)" />;
  }

  const isChecked = bound.isBound ? Boolean(bound.value) : Boolean(value);

  return (
    <label className="st-checkbox-label">
      <input
        type="checkbox"
        className="st-checkbox"
        checked={isChecked}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.checked);
          }
          if (event) {
            onEvent(event);
          }
        }}
      />
      <span>{label}</span>
    </label>
  );
}
