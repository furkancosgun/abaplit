import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function TextInput({ node, state, onValueChange, onEvent }) {
  const { label, value, placeholder, input_type, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (TextInput)" />;
  }

  const currentValue = bound.isBound ? (bound.value ?? '') : (value ?? '');

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <input
        type={input_type || 'text'}
        className="st-text-input"
        value={currentValue}
        placeholder={placeholder || ''}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && event) {
            onEvent(event);
          }
        }}
      />
    </div>
  );
}
