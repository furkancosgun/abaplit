import React from 'react';

export default function BadgeWidget({ node }) {
  const { text, color } = node;
  const badgeColor = color || 'var(--primary-color)';

  return (
    <span
      className="st-badge"
      style={{
        backgroundColor: `color-mix(in srgb, ${badgeColor} 15%, transparent)`,
        color: badgeColor,
        borderColor: `color-mix(in srgb, ${badgeColor} 30%, transparent)`,
      }}
    >
      {text}
    </span>
  );
}
