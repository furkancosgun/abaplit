import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Upload,
  Send,
  X,
  Bot,
  User,
  Loader2,
} from 'lucide-react';
import StreamlitChart from './StreamlitChart';

export function resolveBinding(val, state) {
  if (typeof val === 'string' && val.startsWith('{/') && val.endsWith('}')) {
    const key = val.slice(2, -1).trim();
    return { isBound: true, key, value: state[key] !== undefined ? state[key] : '' };
  }
  return { isBound: false, key: null, value: val !== undefined ? val : '' };
}

/* ============================================================
 * Sub-components with independent hook lifecycles
 * Prevents React Error #310 (Rules of Hooks violation)
 * ============================================================ */
function ConfettiEffect({ type }) {
  useEffect(() => {
    if (type === 'balloons') {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.7 },
      });
    } else if (type === 'snow') {
      confetti({
        particleCount: 120,
        spread: 120,
        startVelocity: 15,
        origin: { y: 0 },
      });
    }
  }, [type]);

  return null;
}

function ExpanderWidget({ node, state, onValueChange, onEvent, isRunning }) {
  const [isOpen, setIsOpen] = useState(false);
  const { label } = node;

  return (
    <div className="st-expander">
      <div className="st-expander-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{label || 'Details'}</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>
      {isOpen && (
        <div className="st-expander-body">
          {node.children &&
            node.children.map((child, idx) => (
              <WidgetRenderer
                key={idx}
                node={child}
                state={state}
                onValueChange={onValueChange}
                onEvent={onEvent}
                isRunning={isRunning}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function TabsWidget({ node, state, onValueChange, onEvent, isRunning }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabNodes = node.children || [];
  let tabTitles = [];

  if (node.titles) {
    tabTitles = node.titles.split(',').map((t) => t.trim());
  } else {
    tabTitles = tabNodes.map((_, i) => `Tab ${i + 1}`);
  }

  return (
    <div className="st-tabs-container">
      <div className="st-tabs-header">
        {tabTitles.map((title, idx) => (
          <button
            key={idx}
            className={`st-tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {title}
          </button>
        ))}
      </div>
      <div className="st-tab-content">
        {tabNodes[activeTab] &&
          tabNodes[activeTab].children &&
          tabNodes[activeTab].children.map((child, idx) => (
            <WidgetRenderer
              key={idx}
              node={child}
              state={state}
              onValueChange={onValueChange}
              onEvent={onEvent}
              isRunning={isRunning}
            />
          ))}
      </div>
    </div>
  );
}

function DialogWidget({ node, state, onValueChange, onEvent, isRunning }) {
  const [isOpen, setIsOpen] = useState(true);
  const { title } = node;

  if (!isOpen) {
    return (
      <button
        className="st-btn"
        style={{ marginBottom: '1rem' }}
        onClick={() => setIsOpen(true)}
      >
        Open Dialog: {title || 'Details'}
      </button>
    );
  }

  return (
    <div className="st-dialog-overlay" onClick={() => setIsOpen(false)}>
      <div className="st-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="st-dialog-header">
          <h3>{title || 'Dialog'}</h3>
          <button className="st-dialog-close" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="st-dialog-body">
          {node.children &&
            node.children.map((child, idx) => (
              <WidgetRenderer
                key={idx}
                node={child}
                state={state}
                onValueChange={onValueChange}
                onEvent={onEvent}
                isRunning={isRunning}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function ChatInputWidget({ node, onEvent, isRunning }) {
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
        className="st-chat-send-btn"
        disabled={!inputVal.trim() || isRunning}
        onClick={handleSend}
      >
        <Send size={16} />
      </button>
    </div>
  );
}

function FileUploaderWidget({ node, onEvent }) {
  const [fileName, setFileName] = useState('');
  const { label, accept, event } = node;

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <label className="st-file-uploader">
        <Upload size={22} className="st-upload-icon" />
        <span className="st-upload-title">
          {fileName ? fileName : 'Drag and drop file here'}
        </span>
        <span className="st-upload-sub">Limit 200MB per file</span>
        <input
          type="file"
          accept={accept || '*'}
          className="st-file-input"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFileName(e.target.files[0].name);
              if (event) onEvent(event);
            }
          }}
        />
      </label>
    </div>
  );
}

/* ============================================================
 * Main Pure Widget Renderer (Zero hooks to satisfy React rules)
 * ============================================================ */
export default function WidgetRenderer({ node, state, onValueChange, onEvent, isRunning }) {
  if (!node) return null;

  const {
    type,
    text,
    body,
    label,
    value,
    placeholder,
    event,
    delta,
    count,
    data,
    code,
    min,
    max,
    step,
    btn_type,
    input_type,
    url,
    file_name,
    mime,
    options,
    height,
    width,
    src,
    caption,
    name,
    avatar,
  } = node;

  switch (type) {
    /* ============================================================
     * Typography & Layout
     * ============================================================ */
    case 'title':
      return <h1 className="st-title">{text || body}</h1>;

    case 'header':
      return <h2 className="st-header-title">{text || body}</h2>;

    case 'subheader':
      return <h3 className="st-subheader">{text || body}</h3>;

    case 'write':
    case 'text':
    case 'markdown':
      return <p className="st-text">{text || body}</p>;

    case 'caption':
      return <p className="st-caption">{text || body}</p>;

    case 'divider':
      return <hr className="st-divider" />;

    case 'code':
      return (
        <pre className="st-code">
          <code>{code || text || body}</code>
        </pre>
      );

    case 'container':
      return (
        <div className="st-container">
          {node.children &&
            node.children.map((child, idx) => (
              <WidgetRenderer
                key={idx}
                node={child}
                state={state}
                onValueChange={onValueChange}
                onEvent={onEvent}
                isRunning={isRunning}
              />
            ))}
        </div>
      );

    case 'columns': {
      const colCount = parseInt(count, 10) || 2;
      return (
        <div className="st-columns" style={{ '--col-count': colCount }}>
          {node.children &&
            node.children.map((col, idx) => (
              <div key={idx} className="st-column">
                {col.children &&
                  col.children.map((child, cIdx) => (
                    <WidgetRenderer
                      key={cIdx}
                      node={child}
                      state={state}
                      onValueChange={onValueChange}
                      onEvent={onEvent}
                      isRunning={isRunning}
                    />
                  ))}
              </div>
            ))}
        </div>
      );
    }

    case 'expander':
      return (
        <ExpanderWidget
          node={node}
          state={state}
          onValueChange={onValueChange}
          onEvent={onEvent}
          isRunning={isRunning}
        />
      );

    /* ============================================================
     * Tabs & Dialog
     * ============================================================ */
    case 'tabs':
      return (
        <TabsWidget
          node={node}
          state={state}
          onValueChange={onValueChange}
          onEvent={onEvent}
          isRunning={isRunning}
        />
      );

    case 'dialog':
      return (
        <DialogWidget
          node={node}
          state={state}
          onValueChange={onValueChange}
          onEvent={onEvent}
          isRunning={isRunning}
        />
      );

    /* ============================================================
     * Chat UI
     * ============================================================ */
    case 'chat_message': {
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
              node.children.map((child, idx) => (
                <WidgetRenderer
                  key={idx}
                  node={child}
                  state={state}
                  onValueChange={onValueChange}
                  onEvent={onEvent}
                  isRunning={isRunning}
                />
              ))
            ) : (
              <p className="st-chat-text">{text || body}</p>
            )}
          </div>
        </div>
      );
    }

    case 'chat_input':
      return (
        <ChatInputWidget
          node={node}
          onEvent={onEvent}
          isRunning={isRunning}
        />
      );

    /* ============================================================
     * Inputs
     * ============================================================ */
    case 'button': {
      const isPrimary = btn_type === 'primary';
      return (
        <button
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

    case 'link_button': {
      const isInternal = url && (url.startsWith('/?') || url.startsWith('?'));
      return (
        <a
          href={url || '#'}
          target={isInternal ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className="st-btn st-link-btn"
          onClick={(e) => {
            if (isInternal) {
              e.preventDefault();
              window.history.pushState({}, '', url);
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
        >
          <span>{label || text || 'Open Link'}</span>
          <ExternalLink size={14} />
        </a>
      );
    }

    case 'download_button': {
      const handleDownload = () => {
        const bound = resolveBinding(data, state);
        const content = bound.isBound ? bound.value : (data || '');
        const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objUrl;
        a.download = file_name || 'download.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objUrl);
      };
      return (
        <button className="st-btn" onClick={handleDownload}>
          <Download size={15} />
          <span>{label || 'Download File'}</span>
        </button>
      );
    }

    case 'text_input': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <input
            type={input_type || 'text'}
            className="st-text-input"
            value={curVal}
            placeholder={placeholder || ''}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && event) {
                onEvent(event);
              }
            }}
          />
        </div>
      );
    }

    case 'number_input': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '0');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <input
            type="number"
            className="st-number-input"
            value={curVal}
            min={min}
            max={max}
            step={step || '1'}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, Number(e.target.value));
              }
            }}
          />
        </div>
      );
    }

    case 'text_area': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <textarea
            className="st-text-area"
            rows={parseInt(node.height, 10) || 4}
            value={curVal}
            placeholder={placeholder || ''}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.value);
              }
            }}
          />
        </div>
      );
    }

    case 'checkbox': {
      const bound = resolveBinding(value, state);
      const isChecked = bound.isBound ? Boolean(bound.value) : Boolean(value);
      return (
        <label className="st-checkbox-label">
          <input
            type="checkbox"
            className="st-checkbox"
            checked={isChecked}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.checked);
              }
              if (event) {
                onEvent(event);
              }
            }}
          />
          <span>{label}</span>
        </label>
      );
    }

    case 'toggle': {
      const bound = resolveBinding(value, state);
      const isChecked = bound.isBound ? Boolean(bound.value) : Boolean(value);
      return (
        <div className="st-toggle-container">
          <label className="st-toggle-switch">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                if (bound.isBound) {
                  onValueChange(bound.key, e.target.checked);
                }
                if (event) onEvent(event);
              }}
            />
            <span className="st-toggle-slider"></span>
          </label>
          {label && <span className="st-toggle-label">{label}</span>}
        </div>
      );
    }

    case 'color_picker': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '#ff4b4b');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <div className="st-color-picker-wrap">
            <input
              type="color"
              className="st-color-picker"
              value={curVal}
              onChange={(e) => {
                if (bound.isBound) {
                  onValueChange(bound.key, e.target.value);
                }
                if (event) onEvent(event);
              }}
            />
            <span className="st-color-badge">{curVal}</span>
          </div>
        </div>
      );
    }

    case 'file_uploader':
      return (
        <FileUploaderWidget
          node={node}
          onEvent={onEvent}
        />
      );

    case 'slider': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || min || '0');
      return (
        <div className="st-input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {label && <label className="st-label">{label}</label>}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              {curVal}
            </span>
          </div>
          <input
            type="range"
            className="st-slider"
            min={min || '0'}
            max={max || '100'}
            value={curVal}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.value);
              }
            }}
          />
        </div>
      );
    }

    case 'selectbox': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      let opts = [];
      if (options) {
        opts = options.split(',').map((o) => o.trim());
      }
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <select
            className="st-select"
            value={curVal}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.value);
              }
              if (event) onEvent(event);
            }}
          >
            {opts.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case 'radio': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      let opts = [];
      if (options) {
        opts = options.split(',').map((o) => o.trim());
      }
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <div className="st-radio-group">
            {opts.map((opt, i) => (
              <label key={i} className="st-radio-label">
                <input
                  type="radio"
                  name={label || 'radio'}
                  checked={curVal === opt}
                  onChange={() => {
                    if (bound.isBound) {
                      onValueChange(bound.key, opt);
                    }
                    if (event) onEvent(event);
                  }}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    case 'date_input': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <input
            type="date"
            className="st-text-input"
            value={curVal}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.value);
              }
              if (event) onEvent(event);
            }}
          />
        </div>
      );
    }

    case 'time_input': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <input
            type="time"
            className="st-text-input"
            value={curVal}
            onChange={(e) => {
              if (bound.isBound) {
                onValueChange(bound.key, e.target.value);
              }
              if (event) onEvent(event);
            }}
          />
        </div>
      );
    }

    /* ============================================================
     * Charts & Visualizations
     * ============================================================ */
    case 'line_chart':
    case 'bar_chart':
    case 'area_chart':
    case 'scatter_chart': {
      const bound = resolveBinding(data, state);
      const chartData = bound.isBound ? bound.value : data;
      return <StreamlitChart type={type} data={chartData} height={height} />;
    }

    /* ============================================================
     * Data & Metrics
     * ============================================================ */
    case 'metric': {
      const isPositive = delta && !delta.startsWith('-');
      return (
        <div className="st-metric">
          <span className="st-metric-label">{label}</span>
          <span className="st-metric-value">{value}</span>
          {delta && (
            <span className={`st-metric-delta ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {delta}
            </span>
          )}
        </div>
      );
    }

    case 'table':
    case 'dataframe': {
      const bound = resolveBinding(data, state);
      const rawData = bound.isBound ? bound.value : data;
      let rows = [];
      try {
        if (typeof rawData === 'string') {
          rows = JSON.parse(rawData);
        } else if (Array.isArray(rawData)) {
          rows = rawData;
        }
      } catch {
        rows = [];
      }

      if (!Array.isArray(rows) || rows.length === 0) {
        return <div className="st-caption">Empty dataset</div>;
      }

      const headers = Object.keys(rows[0] || {});
      return (
        <div className="st-table-wrapper">
          <table className="st-table">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {headers.map((h, cIdx) => (
                    <td key={cIdx}>{String(row[h] ?? '')}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'json': {
      const bound = resolveBinding(data, state);
      const rawData = bound.isBound ? bound.value : data;
      let formatted = '';
      try {
        if (typeof rawData === 'string') {
          formatted = JSON.stringify(JSON.parse(rawData), null, 2);
        } else {
          formatted = JSON.stringify(rawData, null, 2);
        }
      } catch {
        formatted = String(rawData);
      }

      return (
        <div className="st-json-box">
          <pre className="st-json-code">
            <code>{formatted}</code>
          </pre>
        </div>
      );
    }

    /* ============================================================
     * Media
     * ============================================================ */
    case 'image':
      return (
        <div className="st-media-container" style={{ maxWidth: width || '100%' }}>
          <img src={src} alt={caption || 'image'} className="st-image" />
          {caption && <p className="st-caption">{caption}</p>}
        </div>
      );

    case 'audio':
      return (
        <div className="st-media-container">
          <audio controls src={src} className="st-audio" />
        </div>
      );

    case 'video':
      return (
        <div className="st-media-container">
          <video controls src={src} className="st-video" />
        </div>
      );

    /* ============================================================
     * Feedback & Alerts
     * ============================================================ */
    case 'success':
      return (
        <div className="st-alert success">
          <CheckCircle2 size={18} color="#09ab3b" />
          <span>{text || body}</span>
        </div>
      );

    case 'info':
      return (
        <div className="st-alert info">
          <Info size={18} color="#1e88e5" />
          <span>{text || body}</span>
        </div>
      );

    case 'warning':
      return (
        <div className="st-alert warning">
          <AlertTriangle size={18} color="#ffaa00" />
          <span>{text || body}</span>
        </div>
      );

    case 'error':
      return (
        <div className="st-alert error">
          <AlertCircle size={18} color="#ff2b2b" />
          <span>{text || body}</span>
        </div>
      );

    case 'progress': {
      const pct = Math.max(0, Math.min(100, parseFloat(value) || 0));
      return (
        <div className="st-progress-group">
          {text && <span className="st-progress-text">{text}</span>}
          <div className="st-progress-track">
            <div className="st-progress-bar" style={{ width: `${pct}%` }}></div>
          </div>
        </div>
      );
    }

    case 'spinner':
      return (
        <div className="st-spinner-box">
          <Loader2 size={20} className="st-spinner-icon" />
          <span>{text || body || 'Loading...'}</span>
        </div>
      );

    case 'toast':
      return (
        <div className="st-toast-notification">
          <span>{text || body}</span>
        </div>
      );

    case 'balloons':
    case 'snow':
      return <ConfettiEffect type={type} />;

    default:
      return null;
  }
}
