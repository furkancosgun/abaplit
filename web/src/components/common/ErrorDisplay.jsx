import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

export default function ErrorDisplay({ error, title = 'Application Error' }) {
  const [expanded, setExpanded] = useState(false);
  const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');
  const errorName = error?.name || title;

  return (
    <div className="st-error-box">
      <div className="st-error-header" onClick={() => setExpanded(!expanded)}>
        <AlertCircle size={20} className="st-error-icon" />
        <span className="st-error-title">{errorName}</span>
        <button
          type="button"
          className="st-error-toggle"
          aria-label={expanded ? 'Hide details' : 'Show details'}
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      <div className="st-error-summary">
        {errorMessage.split('\n')[0]}
      </div>
      {expanded && (
        <pre className="st-error-details">
          <code>{errorMessage}</code>
        </pre>
      )}
    </div>
  );
}
