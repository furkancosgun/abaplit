import React from 'react';
import { resolveBinding } from '../../core/binding';

export default function JsonWidget({ node, state }) {
  const { data } = node;
  const bound = resolveBinding(data, state);
  const rawData = bound.error ? data : (bound.isBound ? bound.value : data);
  const formatted = typeof rawData === 'object' && rawData !== null
    ? JSON.stringify(rawData, null, 2)
    : String(rawData ?? '');

  return (
    <div className="st-json-box">
      <pre className="st-json-code">
        <code>{formatted}</code>
      </pre>
    </div>
  );
}
