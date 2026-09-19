import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatMessage({ node, renderChildren }) {
  const { name, avatar, text, body } = node;
  const isAssistant = name === 'assistant' || name === 'bot' || name === 'ai';
  const isUser = name === 'user' || name === 'human';

  const renderAvatar = () => {
    if (avatar) {
      if (avatar.startsWith('http') || avatar.startsWith('data:image')) {
        return <img src={avatar} alt={name} className="st-chat-avatar-img" />;
      }
      return <span className="st-chat-avatar-emoji">{avatar}</span>;
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
        <div className="st-chat-name">{name || (isAssistant ? 'Assistant' : 'User')}</div>
        {node.children && node.children.length > 0 ? (
          renderChildren(node.children)
        ) : (
          <p className="st-chat-text">{text || body}</p>
        )}
      </div>
    </div>
  );
}
