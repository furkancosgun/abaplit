import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ node, onEvent, isRunning }) {
  const [inputVal, setInputVal] = useState('');
  const { placeholder, event } = node;

  const handleSend = () => {
    if (!inputVal.trim()) return;
    if (event) {
      onEvent(event, { text: inputVal });
    }
    setInputVal('');
  };

  return (
    <div className="st-chat-input-container">
      <input
        type="text"
        className="st-chat-input"
        value={inputVal}
        placeholder={placeholder || 'Send a message...'}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button
        type="button"
        className="st-chat-send-btn"
        disabled={!inputVal.trim() || isRunning}
        onClick={handleSend}
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
