import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onTranscriptChange, transcript }) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onTranscriptChange(e.target.result);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const clearFile = () => {
    setFileName('');
    onTranscriptChange('');
  };

  return (
    <div className="mb-4">
      {/* Drag and Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        className={`border border-2 border-dashed rounded p-5 text-center ${
          dragOver ? 'border-primary bg-light' : 'border-secondary'
        }`}
        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
      >
        <Upload size={40} className="text-muted mb-3" />
        <p className="h5 mb-2">Drag & drop your transcript file here</p>
        <p className="text-muted small mb-3">
          Supports .txt, .md, .doc, .docx files
        </p>
        <label className="btn btn-primary">
          Choose File
          <input
            type="file"
            className="d-none"
            accept=".txt,.md,.doc,.docx"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />
        </label>
      </div>

      {/* File Name Display */}
      {fileName && (
        <div className="d-flex align-items-center justify-content-between bg-success bg-opacity-10 border border-success rounded p-3 mt-3">
          <div className="d-flex align-items-center">
            <FileText className="text-success me-2" />
            <span className="fw-medium text-success">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="btn btn-sm btn-link text-success"
          >
            <X />
          </button>
        </div>
      )}

      {/* Text Area */}
      <div className="mt-4">
        <label className="form-label">Or paste your transcript directly:</label>
        <textarea
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          className="form-control"
          rows="8"
          placeholder="Paste your meeting transcript here..."
        />
      </div>
    </div>
  );
}
