import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Radio({ node, state, onValueChange, onEvent }) {
  const { label, value, options, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Radio)" />;
  }

  const currentValue = bound.isBound ? (bound.value ?? '') : (value ?? '');
  const optionList = options ? options.split(',').map((o) => o.trim()) : [];

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <div className="st-radio-group">
        {optionList.map((opt, i) => (
          <label key={i} className="st-radio-label">
            <input
              type="radio"
              name={label || 'radio'}
              checked={currentValue === opt}
              onChange={() => {
                if (bound.isBound) {
                  onValueChange(bound.key, opt);
                }
                if (on_change) onEvent(on_change, opt);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && on_submit) {
                  onEvent(on_submit, opt);
                }
              }}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
