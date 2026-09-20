import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Pills({ node, state, onValueChange, onEvent }) {
  const { label, value, options, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Pills)" />;
  }

  const currentValue = bound.isBound ? bound.value : value;
  const optionList = options ? options.split(',').map((o) => o.trim()) : [];

  const handlePillClick = (opt) => {
    const nextVal = currentValue === opt ? '' : opt;
    if (bound.isBound) {
      onValueChange(bound.key, nextVal);
    }
    if (on_change) onEvent(on_change);
          if (on_submit) onEvent(on_submit);
  };

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <div className="st-pills-container">
        {optionList.map((opt, idx) => {
          const isSelected = currentValue === opt;
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
    </div>
  );
}
