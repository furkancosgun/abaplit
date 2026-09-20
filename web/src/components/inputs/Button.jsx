import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function Button({
  node,
  state,
  onEvent,
  isRunning,
  defaultLabel = 'Button',
}) {
  const { text, label, btn_type, on_click } = node;
  const isPrimary = btn_type === 'primary';
  const rawLabel = text ?? label ?? defaultLabel;
  const buttonText = getBoundValue(rawLabel, state) || defaultLabel;

  return (
    <button
      type="button"
      className={`st-btn ${isPrimary ? 'st-btn-primary' : ''}`}
      disabled={isRunning}
      onClick={() => {
        if (on_click && onEvent) {
          onEvent(on_click);
        }
      }}
    >
      {buttonText}
    </button>
  );
}
