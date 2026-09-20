import React from 'react';
import { Send } from 'lucide-react';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function ChatInput({ node, state, onValueChange, onEvent, isRunning }) {
  const { value, isBound, bindingKey, handleChange, getProp } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const messageText = String(value ?? '');
  const hasText = Boolean(messageText.trim());

  const handleSend = () => {
    if (!hasText) return;
    if (node.on_submit && onEvent) {
      onEvent(node.on_submit, messageText);
    }
    if (isBound && onValueChange) {
      onValueChange(bindingKey, '');
    }
  };

  return (
    <div className="st-chat-input-container">
      <input
        type="text"
        className="st-chat-input"
        value={value}
        placeholder={getProp('placeholder', 'Send a message...')}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button
        type="button"
        className="st-chat-send-btn"
        disabled={!hasText || isRunning}
        onClick={handleSend}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
