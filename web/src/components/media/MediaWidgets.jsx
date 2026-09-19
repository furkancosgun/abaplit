import React from 'react';
import { Download } from 'lucide-react';
import { resolveBinding } from '../../core/binding';
import ErrorDisplay from '../common/ErrorDisplay';

export function ImageWidget({ node }) {
  const { src, caption, width } = node;
  return (
    <div className="st-media-container" style={{ maxWidth: width || '100%' }}>
      <img src={src} alt={caption || 'image'} className="st-image" />
      {caption && <p className="st-caption">{caption}</p>}
    </div>
  );
}

export function AudioWidget({ node }) {
  return (
    <div className="st-media-container">
      <audio controls src={node.src} className="st-audio" />
    </div>
  );
}

export function VideoWidget({ node }) {
  return (
    <div className="st-media-container">
      <video controls src={node.src} className="st-video" />
    </div>
  );
}

export function DownloadButton({ node, state }) {
  const { data, label, mime, file_name } = node;
  const bound = resolveBinding(data, state);

  if (bound.error) {
    return <ErrorDisplay error={bound.error} title="Binding Error (DownloadButton)" />;
  }

  const content = bound.isBound ? bound.value : (data || '');

  const handleDownload = () => {
    const textContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : String(content);
    const blob = new Blob([textContent], { type: mime || 'text/plain;charset=utf-8' });
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objUrl;
    a.download = file_name || 'download.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objUrl);
  };

  return (
    <button type="button" className="st-btn" onClick={handleDownload}>
      <Download size={15} />
      <span>{label || 'Download File'}</span>
    </button>
  );
}
