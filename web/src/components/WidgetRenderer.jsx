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
} from 'lucide-react';

function resolveBinding(val, state) {
  if (typeof val === 'string' && val.startsWith('{/') && val.endsWith('}')) {
    const key = val.slice(2, -1).trim();
    return { isBound: true, key, value: state[key] !== undefined ? state[key] : '' };
  }
  return { isBound: false, key: null, value: val !== undefined ? val : '' };
}

export default function WidgetRenderer({ node, state, onValueChange, onEvent, isRunning }) {
  if (!node) return null;

  const { type, text, body, label, value, placeholder, event, delta, count, data, code, language, min, max, step, btn_type } = node;

  // Balloons effect
  useEffect(() => {
    if (type === 'balloons') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } else if (type === 'snow') {
      confetti({
        particleCount: 100,
        spread: 120,
        startVelocity: 15,
        origin: { y: 0 },
      });
    }
  }, [type]);

  switch (type) {
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

    case 'columns': {
      const colCount = parseInt(count, 10) || 2;
      return (
        <div className="st-columns" style={{ '--col-count': colCount }}>
          {node.children && node.children.map((col, idx) => (
            <div key={idx} className="st-column">
              {col.children && col.children.map((child, cIdx) => (
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

    case 'text_input': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || '');
      return (
        <div className="st-input-group">
          {label && <label className="st-label">{label}</label>}
          <input
            type="text"
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
            rows={4}
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

    case 'slider': {
      const bound = resolveBinding(value, state);
      const curVal = bound.isBound ? bound.value : (value || min || '0');
      return (
        <div className="st-input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {label && <label className="st-label">{label}</label>}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)' }}>{curVal}</span>
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

    case 'expander': {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div className="st-expander">
          <div className="st-expander-header" onClick={() => setIsOpen(!isOpen)}>
            <span>{label || 'Details'}</span>
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
          {isOpen && (
            <div className="st-expander-body">
              {node.children && node.children.map((child, idx) => (
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

    case 'container':
      return (
        <div className="st-container">
          {node.children && node.children.map((child, idx) => (
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

    default:
      return null;
  }
}
