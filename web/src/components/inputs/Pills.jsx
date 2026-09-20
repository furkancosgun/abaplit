import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';
import { parseOptions } from '../../core/utils';

export default function Pills({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const optionList = parseOptions(node.options, state);

  const handlePillClick = (opt) => {
    const nextVal = value === opt ? '' : opt;
    handleChange(nextVal);
  };

  return (
    <FormField label={label}>
      <div
        className="st-pills-container"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, String(value ?? ''))}
      >
        {optionList.map((opt, idx) => {
          const isSelected = value === opt;
          return (
            <button
              key={idx}
              type="button"
              className={`st-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handlePillClick(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}
