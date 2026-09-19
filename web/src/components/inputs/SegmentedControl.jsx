import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function SegmentedControl({ node, state, onValueChange, onEvent }) {
  const { label, value, options, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (SegmentedControl)" />;
  }

  const currentValue = bound.isBound ? bound.value : value;
  const optionList = options ? options.split(',').map((o) => o.trim()) : [];

  const handleSelect = (opt) => {
    if (bound.isBound) {
      onValueChange(bound.key, opt);
    }
    if (event) onEvent(event);
  };

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <div className="st-segmented-control">
        {optionList.map((opt, idx) => {
          const isSelected = currentValue === opt;
          return (
            <button
              key={idx}
              type="button"
              className={`st-segment-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
