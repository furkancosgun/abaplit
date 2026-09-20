import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function DateTimeInput({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const stringVal = String(value ?? '');
  const datePart = stringVal ? stringVal.slice(0, 10) : '';
  const timePart =
    stringVal.includes(' ') || stringVal.includes('T') ? stringVal.slice(11, 16) : '';

  const emit = (date, time) => {
    let next = '';
    if (date && time) next = `${date} ${time}`;
    else if (date) next = date;
    else if (time) next = time;
    handleChange(next);
  };

  return (
    <FormField label={label}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="date"
          className="st-date-input"
          value={datePart}
          onChange={(e) => emit(e.target.value, timePart)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="time"
          className="st-time-input"
          value={timePart}
          onChange={(e) => emit(datePart, e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </FormField>
  );
}
