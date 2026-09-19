import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SpinnerWidget({ node }) {
  const message = node.text || node.body || node.val || 'Loading...';

  return (
    <div className="st-spinner-box">
      <Loader2 size={20} className="st-spinner-icon" />
      <span>{message}</span>
    </div>
  );
}
