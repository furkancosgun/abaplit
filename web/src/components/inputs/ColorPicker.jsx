import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function ColorPicker({ node, state, onValueChange, onEvent }) {
  const { label, value, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (ColorPicker)" />;
  }

  const curVal = bound.isBound ? (bound.value || '#ff4b4b') : (value || '#ff4b4b');

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <div className="st-color-picker-wrap">
        <input
          type="color"
          className="st-color-picker"
          value={curVal}
          onChange={(e) => {
            if (bound.isBound) {
              onValueChange(bound.key, e.target.value);
            }
            if (on_change) onEvent(on_change);
          if (on_submit) onEvent(on_submit);
          }}
        />
        <span className="st-color-badge">{curVal}</span>
      </div>
    </div>
  );
}
