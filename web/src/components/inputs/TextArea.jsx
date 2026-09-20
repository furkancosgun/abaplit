import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function TextArea({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown, getProp } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const rowCount = parseInt(getProp('height', 4), 10) || 4;

  return (
    <FormField label={label}>
      <textarea
        className="st-text-area"
        rows={rowCount}
        value={value}
        placeholder={getProp('placeholder', '')}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </FormField>
  );
}
