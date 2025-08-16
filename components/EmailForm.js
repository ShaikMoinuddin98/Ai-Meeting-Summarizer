import { useState } from 'react';
import { Mail, Plus, X, Loader2 } from 'lucide-react';

export default function EmailForm({ onSendEmail, isSending }) {
  const [recipients, setRecipients] = useState(['']);
  const [subject, setSubject] = useState('Meeting Summary');
  const [message, setMessage] = useState(
    'Please find the meeting summary attached below:\n\n'
  );
  const [priority, setPriority] = useState('normal');

  const addRecipient = () => {
    setRecipients([...recipients, '']);
  };

  const removeRecipient = (index) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const updateRecipient = (index, value) => {
    const updated = [...recipients];
    updated[index] = value;
    setRecipients(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validRecipients = recipients.filter((email) => email.trim() !== '');

    if (validRecipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    onSendEmail({
      recipients: validRecipients,
      subject,
      message,
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      {/* Recipients */}
      <div className="mb-3">
        <label className="form-label">Recipients</label>
        {recipients.map((recipient, index) => (
          <div key={index} className="input-group mb-2">
            <input
              type="email"
              value={recipient}
              onChange={(e) => updateRecipient(index, e.target.value)}
              className="form-control"
              placeholder="email@example.com"
              required
            />
            {recipients.length > 1 && (
              <button
                type="button"
                onClick={() => removeRecipient(index)}
                className="btn btn-outline-danger"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRecipient}
          className="btn btn-link text-decoration-none p-0"
        >
          <Plus size={16} className="me-1" />
          Add Another Recipient
        </button>
      </div>

      {/* Subject */}
      <div className="mb-3">
        <label className="form-label">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="form-control"
          required
        />
      </div>

      {/* Message */}
      <div className="mb-3">
        <label className="form-label">Email Message (optional)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="form-control"
          rows="3"
          placeholder="Add a personal message..."
        />
      </div>

      {/* Priority */}
      <div className="mb-3">
        <label className="form-label">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="form-select"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={isSending}
        className="btn btn-success w-100 d-flex align-items-center justify-content-center"
      >
        {isSending ? (
          <>
            <Loader2 className="me-2 spinner-border spinner-border-sm" />
            Sending Emails...
          </>
        ) : (
          <>
            <Mail className="me-2" />
            Send Summary to All Recipients
          </>
        )}
      </button>
    </form>
  );
}
