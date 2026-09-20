import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';
import { parseOptions } from '../../core/utils';

export default function Radio({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const optionList = parseOptions(node.options, state);

  return (
    <FormField label={label}>
      <div className="st-radio-group">
        {optionList.map((opt, i) => (
          <label key={i} className="st-radio-label">
            <input
              type="radio"
              name={label || 'radio'}
              checked={value === opt}
              onChange={() => handleChange(opt)}
              onKeyDown={(e) => handleKeyDown(e, opt)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </FormField>
  );
}
