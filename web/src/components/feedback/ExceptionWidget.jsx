import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function ExceptionWidget({ node, state }) {
  const raw = node.text || node.body || '';
  const text = getBoundValue(raw, state);
  return <div className="st-alert st-alert-error"><strong>Exception:</strong> {text}</div>;
}
