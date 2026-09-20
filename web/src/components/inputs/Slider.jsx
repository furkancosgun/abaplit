import React from 'react';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function Slider({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown, getProp } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '0',
  });

  const minVal = getProp('min', '0');
  const maxVal = getProp('max', '100');
  const stepVal = getProp('step', '1');

  const minNum = parseFloat(minVal) || 0;
  const maxNum = parseFloat(maxVal) || 100;
  const curNum = parseFloat(value) || 0;
  const percent = Math.max(0, Math.min(100, ((curNum - minNum) / (maxNum - minNum || 1)) * 100));

  return (
    <div className="st-input-group">
      <div className="st-slider-header">
        {label && <label className="st-label">{label}</label>}
        <span className="st-slider-val">{value}</span>
      </div>
      <input
        type="range"
        className="st-slider"
        min={minVal}
        max={maxVal}
        step={stepVal}
        value={value}
        style={{ '--value-percent': `${percent}%` }}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
