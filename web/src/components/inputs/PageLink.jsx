import React from 'react';
import { getBoundValue } from '../../core/binding';
import { navigateToInternalUrl } from '../../core/utils';

export default function PageLink({ node, state }) {
  const { label, page, url } = node;
  const boundPage = getBoundValue(page, state);
  const boundUrl = getBoundValue(url, state);
  const boundLabel = getBoundValue(label, state);
  const href = boundPage || boundUrl || '#';

  const handleClick = (e) => {
    if (boundPage && boundPage.startsWith('?')) {
      e.preventDefault();
      navigateToInternalUrl(boundPage);
    }
  };

  return (
    <a className="st-page-link" href={href} onClick={handleClick}>
      {boundLabel || href}
    </a>
  );
}
