import React, { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import FormField from '../common/FormField';
import { resolveBinding, getBoundValue } from '../../core/binding';

export default function FileUploader({ node, state, onValueChange, onEvent }) {
  const [fileInfo, setFileInfo] = useState(null);
  const { label, accept, value, file_name, on_change, on_submit } = node;

  const boundValue = value ? resolveBinding(value, state) : null;
  const boundFileName = file_name ? resolveBinding(file_name, state) : null;

  const boundLabel = getBoundValue(label, state);
  const boundAccept = getBoundValue(accept, state);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIndex = dataUrl.indexOf(',');
      const base64Content = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;

      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      if (boundValue?.isBound && !boundValue.error && onValueChange) {
        onValueChange(boundValue.key, base64Content);
      }
      if (boundFileName?.isBound && !boundFileName.error && onValueChange) {
        onValueChange(boundFileName.key, selectedFile.name);
      }

      const eventPayload = [
        selectedFile.name,
        base64Content,
        selectedFile.type || 'application/octet-stream',
        String(selectedFile.size),
      ];

      if (on_change && onEvent) {
        onEvent(on_change, eventPayload);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && on_submit && onEvent && fileInfo) {
      onEvent(on_submit, [fileInfo.name, fileInfo.type, String(fileInfo.size)]);
    }
  };

  return (
    <FormField label={boundLabel}>
      <label className="st-file-uploader">
        {fileInfo ? (
          <CheckCircle2 size={22} className="st-upload-icon" color="#09ab3b" />
        ) : (
          <Upload size={22} className="st-upload-icon" />
        )}
        <span className="st-upload-title">
          {fileInfo?.name || 'Drag and drop file here'}
        </span>
        <span className="st-upload-sub">
          {fileInfo ? `${Math.round(fileInfo.size / 1024)} KB` : 'Limit 200MB per file'}
        </span>
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
