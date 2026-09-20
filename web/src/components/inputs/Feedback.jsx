import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import FormField from '../common/FormField';
import { useBoundInput } from '../../hooks/useBoundInput';

export default function Feedback({ node, state, onValueChange, onEvent }) {
  const { value, label, handleChange, handleKeyDown, getProp } = useBoundInput(node, state, {
    onValueChange,
    onEvent,
    defaultValue: '',
  });

  const [hovered, setHovered] = useState(null);
  const mode = getProp('options') === 'thumbs' ? 'thumbs' : 'stars';

  const handleClick = (ratingVal) => {
    handleChange(String(ratingVal));
  };

  return (
    <FormField
      label={label}
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e, String(value ?? ''))}
    >
      <div className="st-feedback-container">
        {mode === 'thumbs' ? (
          <div className="st-feedback-thumbs">
            <button
              type="button"
              className={`st-feedback-btn ${value === 'up' ? 'active' : ''}`}
              onClick={() => handleClick('up')}
              title="Thumbs Up"
            >
              <ThumbsUp size={18} />
            </button>
            <button
              type="button"
              className={`st-feedback-btn ${value === 'down' ? 'active' : ''}`}
              onClick={() => handleClick('down')}
              title="Thumbs Down"
            >
              <ThumbsDown size={18} />
            </button>
          </div>
        ) : (
          <div className="st-feedback-stars">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const activeLevel = hovered !== null ? hovered : Number(value) || 0;
              const isFilled = starNum <= activeLevel;
              return (
                <button
                  key={starNum}
                  type="button"
                  className={`st-star-btn ${isFilled ? 'filled' : ''}`}
                  onMouseEnter={() => setHovered(starNum)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleClick(starNum)}
                >
                  <Star
                    size={20}
                    fill={isFilled ? '#ffbb00' : 'none'}
                    color={isFilled ? '#ffbb00' : 'var(--text-muted)'}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </FormField>
  );
}
