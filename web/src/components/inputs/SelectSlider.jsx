import React from 'react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function SelectSlider({ node, state, onValueChange, onEvent }) {
  const { label, options, value, on_change, on_submit } = node;
  const bound = resolveBinding(value, state);
  if (bound.error) return <ErrorDisplay error={bound.error} title="Binding Error (SelectSlider)" />;
  const currentValue = bound.isBound ? (bound.value ?? '') : (value ?? '');
  const optionList = options ? options.split(',').map((o) => o.trim()) : [];
  const currentIndex = optionList.indexOf(String(currentValue));
  const sliderIndex = currentIndex >= 0 ? currentIndex : 0;

  const pct = optionList.length > 1 ? (sliderIndex / (optionList.length - 1)) * 100 : 0;

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <input
        type="range"
        min={0}
        max={Math.max(0, optionList.length - 1)}
        value={sliderIndex}
        className="st-slider"
        style={{ '--value-percent': `${pct}%` }}
        onChange={(e) => {
          const idx = parseInt(e.target.value, 10);
          const nextVal = optionList[idx] ?? '';
          if (bound.isBound) onValueChange(bound.key, nextVal);
          if (on_change) onEvent(on_change, nextVal);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && on_submit) {
            onEvent(on_submit, String(currentValue));
          }
        }}
      />
      <div className="st-select-slider-value">{optionList[sliderIndex] ?? ''}</div>
    </div>
  );
}
