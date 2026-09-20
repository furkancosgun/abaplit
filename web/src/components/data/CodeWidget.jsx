import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { getBoundValue } from '../../core/binding';
import { copyToClipboard } from '../../core/utils';

export default function CodeWidget({ node, state }) {
  const [copied, setCopied] = useState(false);
  const rawCode = node.code || node.text || node.body || '';
  const codeContent = getBoundValue(rawCode, state);
  const boundLanguage = getBoundValue(node.language, state);

  const handleCopy = async () => {
    await copyToClipboard(String(codeContent ?? ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="st-code-wrapper">
      <div className="st-code-header">
        <span className="st-code-lang">{boundLanguage || 'abap'}</span>
        <button
          type="button"
          className="st-code-copy-btn"
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} color="#09ab3b" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="st-code">
        <code>{String(codeContent ?? '')}</code>
      </pre>
    </div>
  );
}
