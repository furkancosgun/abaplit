import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function ColorPicker({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '#ff4b4b',
  });

  return (
    <FormField label={label}>
      <div className="st-color-picker-wrap">
        <input
          type="color"
          className="st-color-picker"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="st-color-badge">{value}</span>
      </div>
    </FormField>
  );
}
