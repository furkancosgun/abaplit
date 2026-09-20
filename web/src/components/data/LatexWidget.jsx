import React from 'react';

export default function LatexWidget({ node }) {
  return <div className="st-latex"><code>{node.body || node.text || ''}</code></div>;
}
