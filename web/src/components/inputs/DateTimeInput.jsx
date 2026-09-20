import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function DateTimeInput({ node, state, onValueChange, onEvent }) {
  const { label, value, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);
  if (bound.error) return <ErrorDisplay error={bound.error} title="Binding Error (DateTimeInput)" />;
  const currentValue = bound.isBound ? (bound.value ?? '') : (value ?? '');
  const datePart = currentValue ? String(currentValue).slice(0, 10) : '';
  const timePart = currentValue && String(currentValue).includes(' ') ? String(currentValue).slice(11, 16) : String(currentValue).includes('T') ? String(currentValue).slice(11, 16) : '';

  const emit = (d, t) => {
    if (!bound.isBound) return;
    let next = '';
    if (d && t) next = `${d} ${t}`;
    else if (d) next = d;
    else if (t) next = t;
    onValueChange(bound.key, next);
    if (on_change) onEvent(on_change, next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && on_submit) {
      onEvent(on_submit, String(currentValue));
    }
  };

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="date" className="st-date-input" value={datePart} onChange={(e) => emit(e.target.value, timePart)} onKeyDown={handleKeyDown} />
        <input type="time" className="st-time-input" value={timePart} onChange={(e) => emit(datePart, e.target.value)} onKeyDown={handleKeyDown} />
      </div>
    </div>
  );
}
