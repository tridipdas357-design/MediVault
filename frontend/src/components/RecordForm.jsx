import { useState } from 'react';
import { RECORD_TYPES } from '../utils/labels';

const empty = {
  title: '',
  type: 'PRESCRIPTION',
  doctor: '',
  date: '',
  notes: '',
};

export default function RecordForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...empty, ...initial, date: initial?.date || '' });
  const [file, setFile] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(
      {
        title: form.title.trim(),
        type: form.type,
        doctor: form.doctor.trim() || null,
        date: form.date,
        notes: form.notes.trim() || null,
      },
      file
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="record-title">
          Title
        </label>
        <input
          id="record-title"
          className="input"
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="record-type">
            Type
          </label>
          <select
            id="record-type"
            className="input"
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
          >
            {RECORD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="record-date">
            Date
          </label>
          <input
            id="record-date"
            type="date"
            className="input"
            required
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="record-doctor">
          Doctor
        </label>
        <input
          id="record-doctor"
          className="input"
          value={form.doctor || ''}
          onChange={(e) => update('doctor', e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="record-notes">
          Notes
        </label>
        <textarea
          id="record-notes"
          className="input min-h-[96px] resize-y"
          value={form.notes || ''}
          onChange={(e) => update('notes', e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="record-file">
          Scan or PDF
        </label>
        <input
          id="record-file"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="input file:mr-3 file:rounded-lg file:border-0 file:bg-sage-100 file:px-3 file:py-1 file:text-sage-800"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save record'}
        </button>
      </div>
    </form>
  );
}
