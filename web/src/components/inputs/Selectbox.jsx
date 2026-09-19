import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Selectbox({ node, state, onValueChange, onEvent }) {
  const { label, value, options, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Selectbox)" />;
  }

  const currentValue = bound.isBound ? (bound.value ?? '') : (value ?? '');
  const optionList = options ? options.split(',').map((o) => o.trim()) : [];

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <select
        className="st-select"
        value={currentValue}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
          if (event) {
            onEvent(event);
          }
        }}
      >
        {optionList.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
