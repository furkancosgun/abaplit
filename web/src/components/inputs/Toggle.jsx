import React from 'react';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function Toggle({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: false,
  });

  const isChecked = Boolean(value);

  return (
    <div className="st-toggle-container">
      <label className="st-toggle-switch">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleChange(e.target.checked, String(e.target.checked))}
          onKeyDown={(e) => handleKeyDown(e, String(isChecked))}
        />
        <span className="st-toggle-slider" />
      </label>
      {label && <span className="st-toggle-label">{label}</span>}
    </div>
  );
}
