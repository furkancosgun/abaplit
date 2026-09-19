import React from 'react';

export default function Button({ node, onEvent, isRunning }) {
  const { text, label, btn_type, event } = node;
  const isPrimary = btn_type === 'primary';

  return (
    <button
      type="button"
      className={`st-btn ${isPrimary ? 'st-btn-primary' : ''}`}
      disabled={isRunning}
      onClick={() => {
        if (event) onEvent(event);
      }}
    >
      {text || label || 'Button'}
    </button>
  );
}
