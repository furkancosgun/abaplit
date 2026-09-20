import React from 'react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';
import { parseOptions } from '../../core/utils';

export default function SelectSlider({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const optionList = parseOptions(node.options, state);
  const currentIndex = optionList.indexOf(String(value));
  const sliderIndex = currentIndex >= 0 ? currentIndex : 0;
  const percent = optionList.length > 1 ? (sliderIndex / (optionList.length - 1)) * 100 : 0;

  return (
    <FormField label={label}>
      <input
        type="range"
        min={0}
        max={Math.max(0, optionList.length - 1)}
        value={sliderIndex}
        className="st-slider"
        style={{ '--value-percent': `${percent}%` }}
        onChange={(e) => {
          const idx = parseInt(e.target.value, 10);
          handleChange(optionList[idx] ?? '');
        }}
        onKeyDown={(e) => handleKeyDown(e, String(value))}
      />
      <div className="st-select-slider-value">{optionList[sliderIndex] ?? ''}</div>
    </FormField>
  );
}
