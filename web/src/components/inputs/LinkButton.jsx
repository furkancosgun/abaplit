import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getBoundValue } from '../../core/binding';
import { navigateToInternalUrl } from '../../core/utils';

export default function LinkButton({ node, state }) {
  const { url, label, text } = node;
  const boundUrl = getBoundValue(url, state) || '#';
  const boundLabel = getBoundValue(label ?? text, state) || 'Open Link';
  const isInternal = boundUrl.startsWith('/?') || boundUrl.startsWith('?');

  const handleClick = (e) => {
    if (isInternal) {
      e.preventDefault();
      navigateToInternalUrl(boundUrl);
    }
  };

  return (
    <a
      href={boundUrl}
      target={isInternal ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="st-btn st-link-btn"
      onClick={handleClick}
    >
      <span>{boundLabel}</span>
      <ExternalLink size={14} />
    </a>
  );
}
