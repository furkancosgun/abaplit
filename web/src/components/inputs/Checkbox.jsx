import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Checkbox({ node, state, onValueChange, onEvent }) {
  const { label, value, on_change, on_submit } = node;
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
          const nextVal = e.target.checked;
          const nextStr = String(nextVal);
          if (bound.isBound) {
            onValueChange(bound.key, nextVal);
          }
          if (on_change) onEvent(on_change, nextStr);
          if (on_submit) onEvent(on_submit, nextStr);
        }}
      />
      <span>{label}</span>
    </label>
  );
}
