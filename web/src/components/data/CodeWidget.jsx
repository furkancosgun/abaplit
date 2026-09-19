import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeWidget({ node }) {
  const [copied, setCopied] = useState(false);
  const codeContent = node.code || node.text || node.body || '';

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(codeContent);
      } else {
        const ta = document.createElement('textarea');
        ta.value = codeContent;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="st-code-wrapper">
      <div className="st-code-header">
        <span className="st-code-lang">{node.language || 'abap'}</span>
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
        <code>{codeContent}</code>
      </pre>
    </div>
  );
}
