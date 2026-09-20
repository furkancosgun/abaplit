import React from 'react';
import { Download } from 'lucide-react';
import { resolveBinding, getBoundValue } from '../../core/binding';

export function ImageWidget({ node, state }) {
  const { src, caption, width } = node;
  const boundSrc = getBoundValue(src, state);
  const boundCaption = getBoundValue(caption, state);
  const boundWidth = getBoundValue(width, state);
  return (
    <div className="st-media-container" style={{ maxWidth: boundWidth || '100%' }}>
      <img src={boundSrc} alt={boundCaption || 'image'} className="st-image" />
      {boundCaption && <p className="st-caption">{boundCaption}</p>}
    </div>
  );
}

export function AudioWidget({ node, state }) {
  const boundSrc = getBoundValue(node.src, state);
  return (
    <div className="st-media-container">
      <audio controls src={boundSrc} className="st-audio" />
    </div>
  );
}

export function VideoWidget({ node, state }) {
  const boundSrc = getBoundValue(node.src, state);
  return (
    <div className="st-media-container">
      <video controls src={boundSrc} className="st-video" />
    </div>
  );
}

export function DownloadButton({ node, state }) {
  const { data, label, mime, file_name } = node;
  const bound = resolveBinding(data, state);
  const content = bound.error ? data : (bound.isBound ? bound.value : (data || ''));
  const boundLabel = getBoundValue(label, state) || 'Download File';
  const boundMime = getBoundValue(mime, state) || 'text/plain;charset=utf-8';
  const boundFileName = getBoundValue(file_name, state) || 'download.txt';

  const handleDownload = () => {
    const textContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
    const blob = new Blob([textContent], { type: boundMime });
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = boundFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
  };

  return (
    <button type="button" className="st-btn" onClick={handleDownload}>
      <Download size={15} />
      <span>{boundLabel}</span>
    </button>
  );
}
