import React from 'react';
import { getBoundValue } from '../../core/binding';

export default function HtmlWidget({ node, state }) {
  const raw = node.body ?? node.text ?? '';
  const html = getBoundValue(raw, state);
  return <div className="st-html" dangerouslySetInnerHTML={{ __html: String(html ?? '') }} />;
}
