import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function BadgeWidget({ node, state }) {
  const { text, color } = node;
  const boundText = getBoundValue(text, state);
  const boundColor = getBoundValue(color, state);
  const badgeColor = boundColor || 'var(--primary-color)';

  return (
    <span
      className="st-badge"
      style={{
        backgroundColor: `color-mix(in srgb, ${badgeColor} 15%, transparent)`,
        color: badgeColor,
        borderColor: `color-mix(in srgb, ${badgeColor} 30%, transparent)`,
      }}
    >
      {boundText !== undefined && boundText !== null ? String(boundText) : ''}
    </span>
  );
}
