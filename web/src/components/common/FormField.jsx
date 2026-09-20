import React from 'react';

export default function FormField({
  label,
  children,
  className = '',
  containerRef,
  onKeyDown,
  tabIndex,
}) {
  return (
    <div
      ref={containerRef}
      className={`st-input-group ${className}`.trim()}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
    >
      {label && <label className="st-label">{label}</label>}
      {children}
    </div>
  );
}
