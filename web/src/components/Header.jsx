import React from 'react';
import { Play, RotateCw, Moon, Sun, Flame } from 'lucide-react';

export default function Header({ isRunning, onRerun, isDark, onToggleTheme, appName }) {
  return (
    <header className="st-header">
      <div className="st-header-actions">
        {isRunning ? (
          <div className="st-status-badge st-running-indicator">
            <RotateCw size={14} className="st-spinner-icon" />
            <span>Running...</span>
          </div>
        ) : (
          <div className="st-status-badge">
            <Flame size={14} color="#ff4b4b" />
            <span>{appName || 'abaplit'}</span>
          </div>
        )}

        <button
          className="st-icon-btn"
          onClick={onRerun}
          title="Rerun application (Shortcut: R)"
        >
          <RotateCw size={16} />
        </button>

        <button
          className="st-icon-btn"
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
