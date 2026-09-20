import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';
import { parseOptions } from '../../core/utils';

export default function SegmentedControl({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const optionList = parseOptions(node.options, state);

  return (
    <FormField label={label}>
      <div
        className="st-segmented-control"
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, String(value ?? ''))}
      >
        {optionList.map((opt, idx) => {
          const isSelected = value === opt;
          return (
            <button
              key={idx}
              type="button"
              className={`st-segment-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handleChange(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}
