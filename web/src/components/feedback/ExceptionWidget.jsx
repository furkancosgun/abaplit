import React from 'react';

export default function ExceptionWidget({ node }) {
  const text = node.text || node.body || '';
  return <div className="st-alert st-alert-error"><strong>Exception:</strong> {text}</div>;
}
