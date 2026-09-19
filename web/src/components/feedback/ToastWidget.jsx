import React from 'react';

export default function ToastWidget({ node }) {
  const message = node.text || node.body || node.val || '';

  return (
    <div className="st-toast-notification">
      <span>{message}</span>
    </div>
  );
}
