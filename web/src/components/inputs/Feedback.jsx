import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export default function Feedback({ node, state, onValueChange, onEvent }) {
  const { label, value, options, event } = node;
  const bound = resolveBinding(value, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (Feedback)" />;
  }

  const currentValue = bound.isBound ? bound.value : value;
  const mode = options === 'thumbs' ? 'thumbs' : 'stars';
  const [hovered, setHovered] = useState(null);

  const handleClick = (ratingVal) => {
    if (bound.isBound) {
      onValueChange(bound.key, ratingVal);
    }
    if (event) {
      onEvent(event, { rating: ratingVal });
    }
  };

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <div className="st-feedback-container">
        {mode === 'thumbs' ? (
          <div className="st-feedback-thumbs">
            <button
              type="button"
              className={`st-feedback-btn ${currentValue === 'up' ? 'active' : ''}`}
              onClick={() => handleClick('up')}
              title="Thumbs Up"
            >
              <ThumbsUp size={18} />
            </button>
            <button
              type="button"
              className={`st-feedback-btn ${currentValue === 'down' ? 'active' : ''}`}
              onClick={() => handleClick('down')}
              title="Thumbs Down"
            >
              <ThumbsDown size={18} />
            </button>
          </div>
        ) : (
          <div className="st-feedback-stars">
            {[1, 2, 3, 4, 5].map((starNum) => {
              const activeLevel = hovered !== null ? hovered : (Number(currentValue) || 0);
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
                  <Star size={20} fill={isFilled ? '#ffbb00' : 'none'} color={isFilled ? '#ffbb00' : 'var(--text-muted)'} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
