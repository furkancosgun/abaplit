import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function LinkButton({ node }) {
  const { url, label, text } = node;
  const isInternal = url && (url.startsWith('/?') || url.startsWith('?'));

  return (
    <a
      href={url || '#'}
      target={isInternal ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="st-btn st-link-btn"
      onClick={(e) => {
        if (isInternal) {
          e.preventDefault();
          window.history.pushState({}, '', url);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      }}
    >
      <span>{label || text || 'Open Link'}</span>
      <ExternalLink size={14} />
    </a>
  );
}
