import React from 'react';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function Checkbox({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: false,
  });

  const isChecked = Boolean(value);

  return (
    <label className="st-checkbox-label">
      <input
        type="checkbox"
        className="st-checkbox"
        checked={isChecked}
        onChange={(e) => handleChange(e.target.checked, String(e.target.checked))}
        onKeyDown={(e) => handleKeyDown(e, String(isChecked))}
      />
      <span>{label}</span>
    </label>
  );
}
