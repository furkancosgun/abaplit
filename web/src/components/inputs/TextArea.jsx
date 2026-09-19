import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function TextArea({ node, state, onValueChange }) {
  const { label, value, placeholder, height } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (TextArea)" />;
  }

  const currentValue = bound.isBound ? (bound.value ?? '') : (value ?? '');

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <textarea
        className="st-text-area"
        rows={parseInt(height, 10) || 4}
        value={currentValue}
        placeholder={placeholder || ''}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
        }}
      />
    </div>
  );
}
