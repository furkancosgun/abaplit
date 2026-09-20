import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function NumberInput({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown, getProp } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: 0,
  });

  return (
    <FormField label={label}>
      <input
        type="number"
        className="st-number-input"
        value={value}
        min={getProp('min', undefined)}
        max={getProp('max', undefined)}
        step={getProp('step', '1')}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </FormField>
  );
}
