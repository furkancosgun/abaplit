import React from 'react';

export default function HtmlWidget({ node }) {
  const html = node.body || node.text || '';
  return <div className="st-html" dangerouslySetInnerHTML={{ __html: html }} />;
}
