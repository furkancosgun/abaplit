import React from 'react';

export default function FormSubmitButton({ node, onEvent, isRunning }) {
  const { label, text, btn_type, on_click } = node;
  const isPrimary = btn_type === 'primary';
  return (
    <button
      type="button"
      className={`st-btn ${isPrimary ? 'st-btn-primary' : ''}`}
      disabled={isRunning}
      onClick={() => {
        if (on_click) onEvent(on_click);
      }}
    >
      {label || text || 'Submit'}
    </button>
  );
}
