import React from 'react';
import { Send } from 'lucide-react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function ChatInput({ node, state, onValueChange, onEvent, isRunning }) {
  const { placeholder, value, on_change, on_submit } = node;
  const bound = value ? resolveBinding(value, state) : { isBound: false, error: null };

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (ChatInput)" />;
  }

  const curVal = bound.isBound ? (bound.value ?? '') : (value ?? '');

  const handleSend = () => {
    if (!String(curVal).trim()) return;
    if (on_submit) {
      onEvent(on_submit, String(curVal));
    }
    if (bound.isBound) {
      onValueChange(bound.key, '');
    }
  };

  return (
    <div className="st-chat-input-container">
      <input
        type="text"
        className="st-chat-input"
        value={curVal}
        placeholder={placeholder || 'Send a message...'}
        onChange={(e) => {
          if (bound.isBound) {
            onValueChange(bound.key, e.target.value);
          }
          if (on_change) onEvent(on_change, e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button
        type="button"
        className="st-chat-send-btn"
        disabled={!String(curVal).trim() || isRunning}
        onClick={handleSend}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
