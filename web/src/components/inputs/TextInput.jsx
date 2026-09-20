import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function TextInput({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown, getProp } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  return (
    <FormField label={label}>
      <input
        type={node.input_type || 'text'}
        className="st-text-input"
        value={value}
        placeholder={getProp('placeholder', '')}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </FormField>
  );
}
