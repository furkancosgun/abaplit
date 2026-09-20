import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function TextInput({ node, state, onValueChange, onEvent }) {
  const { label, value, placeholder, input_type, on_change, on_submit } = node;
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
          if (on_change) onEvent(on_change, e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && on_submit) {
            onEvent(on_submit, e.target.value);
          }
        }}
      />
    </div>
  );
}
