import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function FileUploader({ node, onEvent }) {
  const [fileName, setFileName] = useState('');
  const { label, accept, event } = node;

  return (
    <div className="st-input-group">
      {label && <label className="st-label">{label}</label>}
      <label className="st-file-uploader">
        <Upload size={22} className="st-upload-icon" />
        <span className="st-upload-title">
          {fileName || 'Drag and drop file here'}
        </span>
        <span className="st-upload-sub">Limit 200MB per file</span>
        <input
          type="file"
          accept={accept || '*'}
          className="st-file-input"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFileName(e.target.files[0].name);
              if (event) onEvent(event);
            }
          }}
        />
      </label>
    </div>
  );
}
