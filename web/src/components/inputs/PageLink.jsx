import React from 'react';

export default function PageLink({ node }) {
  const { label, page, url } = node;
  const href = page || url || '#';
  const handleClick = (e) => {
    if (page && page.startsWith('?')) {
      e.preventDefault();
      window.history.pushState(null, '', page);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };
  return (
    <a className="st-page-link" href={href} onClick={handleClick}>
      {label || href}
    </a>
  );
}
