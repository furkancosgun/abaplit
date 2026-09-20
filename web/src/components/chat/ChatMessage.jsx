import React from 'react';
import { Bot, User } from 'lucide-react';
import { getBoundValue } from '../../core/binding';

export default function ChatMessage({ node, state, renderChildren }) {
  const { name, avatar, text, body } = node;
  const boundName = getBoundValue(name, state);
  const boundAvatar = getBoundValue(avatar, state);
  const boundText = getBoundValue(text ?? body, state);
  const isAssistant = boundName === 'assistant' || boundName === 'bot' || boundName === 'ai';
  const isUser = boundName === 'user' || boundName === 'human';

  const renderAvatar = () => {
    if (boundAvatar) {
      if (boundAvatar.startsWith('http') || boundAvatar.startsWith('data:image')) {
        return <img src={boundAvatar} alt={boundName} className="st-chat-avatar-img" />;
      }
      return <span className="st-chat-avatar-emoji">{boundAvatar}</span>;
    }
    if (isUser) {
      return <User size={18} />;
    }
    return <Bot size={18} />;
  };

  return (
    <div className={`st-chat-message ${isAssistant ? 'assistant' : 'user'}`}>
      <div className="st-chat-avatar">{renderAvatar()}</div>
      <div className="st-chat-content">
        <div className="st-chat-name">{boundName || (isAssistant ? 'Assistant' : 'User')}</div>
        {node.children && node.children.length > 0 ? (
          renderChildren(node.children)
        ) : (
          <p className="st-chat-text">{boundText || ''}</p>
        )}
      </div>
    </div>
  );
}
