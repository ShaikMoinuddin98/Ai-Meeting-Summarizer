import { useState } from 'react';
import { Copy, Download, RefreshCw } from 'lucide-react';

export default function SummaryEditor({ summary, onSummaryChange }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatSummary = () => {
    const formatted = summary
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n\n');
    onSummaryChange(formatted);
  };

  return (
    <div className="mb-4">
      {/* Toolbar */}
      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          onClick={copyToClipboard}
          className="btn btn-light d-flex align-items-center"
        >
          <Copy size={16} className="me-2" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={downloadSummary}
          className="btn btn-light d-flex align-items-center"
        >
          <Download size={16} className="me-2" />
          Download
        </button>
        <button
          type="button"
          onClick={formatSummary}
          className="btn btn-light d-flex align-items-center"
        >
          <RefreshCw size={16} className="me-2" />
          Format
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        className="form-control font-monospace"
        rows="15"
        placeholder="Your AI-generated summary will appear here..."
      />

      {/* Word & Character Count */}
      <div className="form-text mt-2">
        {summary.split(' ').filter(Boolean).length} words • {summary.length} characters
      </div>
    </div>
  );
}
