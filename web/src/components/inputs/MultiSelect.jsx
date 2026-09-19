import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function MultiSelect({ node, state, onValueChange, onEvent }) {
  const { label, value, options, event } = node;
  const bound = resolveBinding(value, state);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (MultiSelect)" />;
  }

  const rawValue = bound.isBound ? bound.value : value;
  const selectedValues = Array.isArray(rawValue)
    ? rawValue
    : (typeof rawValue === 'string' && rawValue ? rawValue.split(',').map((v) => v.trim()) : []);

  const optionList = options ? options.split(',').map((o) => o.trim()) : [];
  const availableOptions = optionList.filter((opt) => !selectedValues.includes(opt));

  const handleSelect = (opt) => {
    const updated = [...selectedValues, opt];
    if (bound.isBound) {
      onValueChange(bound.key, updated);
    }
    if (event) onEvent(event);
  };

  const handleRemove = (opt, e) => {
    e.stopPropagation();
    const updated = selectedValues.filter((v) => v !== opt);
    if (bound.isBound) {
      onValueChange(bound.key, updated);
    }
    if (event) onEvent(event);
  };

  return (
    <div className="st-input-group" ref={containerRef}>
      {label && <label className="st-label">{label}</label>}
      <div
        className="st-multiselect-container"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="st-multiselect-tags">
          {selectedValues.map((val, idx) => (
            <span key={idx} className="st-multiselect-tag">
              <span>{val}</span>
              <button
                type="button"
                className="st-tag-remove"
                onClick={(e) => handleRemove(val, e)}
                aria-label={`Remove ${val}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          {selectedValues.length === 0 && (
            <span className="st-multiselect-placeholder">Choose options...</span>
          )}
        </div>
        <div className="st-multiselect-arrow">
          <ChevronDown size={16} />
        </div>
      </div>

      {dropdownOpen && availableOptions.length > 0 && (
        <div className="st-multiselect-dropdown">
          {availableOptions.map((opt, i) => (
            <div
              key={i}
              className="st-multiselect-option"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
