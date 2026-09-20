import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import FormField from '../common/FormField';
import { getBoundValue } from '../../core/binding';

export default function FileUploader({ node, state, onEvent }) {
  const [fileName, setFileName] = useState('');
  const { label, accept, on_change, on_submit } = node;
  const boundLabel = getBoundValue(label, state);
  const boundAccept = getBoundValue(accept, state);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      if (on_change && onEvent) {
        onEvent(on_change, selectedFile.name);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && on_submit && onEvent) {
      onEvent(on_submit, fileName);
    }
  };

  return (
    <FormField label={boundLabel}>
      <label className="st-file-uploader">
        <Upload size={22} className="st-upload-icon" />
        <span className="st-upload-title">{fileName || 'Drag and drop file here'}</span>
        <span className="st-upload-sub">Limit 200MB per file</span>
        <input
          type="file"
          accept={boundAccept || '*'}
          className="st-file-input"
          onChange={handleFileChange}
          onKeyDown={handleKeyDown}
        />
      </label>
    </FormField>
  );
}
