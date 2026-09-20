import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function DateInput({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  return (
    <FormField label={label}>
      <input
        type="date"
        className="st-text-input"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </FormField>
  );
}
