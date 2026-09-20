import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Toggle({ node, state, onValueChange, onEvent }) {
  const { label, value, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Toggle)" />;
  }

  const isChecked = bound.isBound ? Boolean(bound.value) : Boolean(value);

  return (
    <div className="st-toggle-container">
      <label className="st-toggle-switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            if (bound.isBound) {
              onValueChange(bound.key, e.target.checked);
            }
            if (on_change) {
              onEvent(on_change);
            }
          if (on_submit) {
            onEvent(on_submit);
          }
          }}
        />
        <span className="st-toggle-slider"></span>
      </label>
      {label && <span className="st-toggle-label">{label}</span>}
    </div>
  );
}
