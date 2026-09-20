import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';
import { parseOptions } from '../../core/utils';

export default function MultiSelect({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: [],
  });

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

  const selectedValues = Array.isArray(value)
    ? value
    : typeof value === 'string' && value
    ? value.split(',').map((v) => v.trim())
    : [];

  const optionList = parseOptions(node.options, state);
  const availableOptions = optionList.filter((opt) => !selectedValues.includes(opt));

  const handleSelect = (opt) => {
    handleChange([...selectedValues, opt]);
  };

  const handleRemove = (opt, e) => {
    e.stopPropagation();
    handleChange(selectedValues.filter((v) => v !== opt));
  };

  return (
    <FormField label={label} containerRef={containerRef}>
      <div
        className="st-multiselect-container"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e, selectedValues)}
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
    </FormField>
  );
}
