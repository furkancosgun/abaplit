import React from 'react';
import { resolveNodeText } from '../../core/utils';

function renderInlineMarkdown(text) {
  if (!text) return '';

  const tokens = [];
  const inlineRegex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5|(\[(.*?)\]\((.*?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }

    const [fullMatch, boldDelim, boldText, italicDelim, italicText, codeDelim, codeText, linkFull, linkText, linkUrl] = match;

    if (boldText !== undefined) {
      tokens.push(<strong key={tokens.length}>{boldText}</strong>);
    } else if (italicText !== undefined) {
      tokens.push(<em key={tokens.length}>{italicText}</em>);
    } else if (codeText !== undefined) {
      tokens.push(
        <code key={tokens.length} className="st-inline-code">
          {codeText}
        </code>
      );
    } else if (linkUrl !== undefined) {
      const isSafeUrl = /^(https?:|\/|#|mailto:)/i.test(linkUrl.trim());
      tokens.push(
        <a
          key={tokens.length}
          href={isSafeUrl ? linkUrl.trim() : '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

export default function MarkdownWidget({ node, state }) {
  const rawText = resolveNodeText(node, state);
  if (!rawText) return null;

  const lines = String(rawText).split('\n');
  const elements = [];
  let currentList = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={elements.length}>
          {currentList.items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );
    } else if (currentList.type === 'ol') {
      elements.push(
        <ol key={elements.length}>
          {currentList.items.map((item, idx) => (
            <li key={idx}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={elements.length} className="st-subheader">{renderInlineMarkdown(trimmed.slice(4))}</h3>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={elements.length} className="st-header-title">{renderInlineMarkdown(trimmed.slice(3))}</h2>);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={elements.length} className="st-title">{renderInlineMarkdown(trimmed.slice(2))}</h1>);
      continue;
    }

    if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={elements.length}>
          {renderInlineMarkdown(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(trimmed.slice(2));
      continue;
    }

    const orderedMatch = /^(\d+)\.\s+(.*)$/.exec(trimmed);
    if (orderedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(orderedMatch[2]);
      continue;
    }

    flushList();
    elements.push(
      <p key={elements.length}>
        {renderInlineMarkdown(line)}
      </p>
    );
  }

  flushList();

  return <div className="st-markdown">{elements}</div>;
}
