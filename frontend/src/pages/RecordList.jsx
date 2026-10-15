import { useEffect, useMemo, useState } from 'react';
import { FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import api from '../api';
import Modal from '../components/Modal';
import RecordForm from '../components/RecordForm';
import { formatDate, RECORD_TYPES, typeLabel } from '../utils/labels';

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const { data } = await api.get('/api/records');
    setRecords(data);
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const { data } = await api.get('/api/records');
        if (!cancelled) setRecords(data);
      } catch {
        /* interceptor */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery = !q || record.title.toLowerCase().includes(q);
      const matchesType = !type || record.type === type;
      return matchesQuery && matchesType;
    });
  }, [records, query, type]);

  async function save(payload, file) {
    setSubmitting(true);
    try {
      let saved;
      if (editing?.id) {
        const { data } = await api.put(`/api/records/${editing.id}`, payload);
        saved = data;
      } else {
        const { data } = await api.post('/api/records', payload);
        saved = data;
      }
      if (file) {
        const body = new FormData();
        body.append('file', file);
        await api.post(`/api/records/${saved.id}/file`, body);
      }
      await load();
      setOpen(false);
      setEditing(null);
    } catch {
      /* interceptor */
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await api.delete(`/api/records/${pendingDelete.id}`);
      setRecords((prev) => prev.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      /* interceptor */
    }
  }

  async function openFile(record) {
    try {
      const response = await api.get(`/api/records/${record.id}/file`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      /* interceptor */
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Records</h1>
          <p className="mt-1 text-slate-400">Prescriptions, labs, vaccines, and notes.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus size={16} />
          Add record
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-3 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Search by title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input sm:w-56" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {RECORD_TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
          <FileText className="text-slate-500" />
          <p className="text-sm text-slate-400">No records match this view.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => (
            <article key={record.id} className="card card-hover p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-medium">{record.title}</h2>
                  <p className="text-sm text-slate-400">
                    {typeLabel(record.type)} · {formatDate(record.date)}
                    {record.doctor ? ` · ${record.doctor}` : ''}
                  </p>
                  {record.notes ? (
                    <p className="mt-2 text-sm text-slate-500">{record.notes}</p>
                  ) : null}
                  {record.fileUrl ? (
                    <button
                      type="button"
                      className="mt-2 text-sm text-cyan-400 hover:underline"
                      onClick={() => openFile(record)}
                    >
                      Open attachment
                    </button>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn-ghost px-3"
                    onClick={() => {
                      setEditing(record);
                      setOpen(true);
                    }}
                    aria-label="Edit record"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-danger px-3"
                    onClick={() => setPendingDelete(record)}
                    aria-label="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {open ? (
        <Modal
          title={editing ? 'Edit record' : 'New record'}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
        >
          <RecordForm
            initial={editing}
            submitting={submitting}
            onSubmit={save}
            onCancel={() => {
              setOpen(false);
              setEditing(null);
            }}
          />
        </Modal>
      ) : null}

      {pendingDelete ? (
        <Modal title="Delete record" onClose={() => setPendingDelete(null)}>
          <p className="text-sm text-slate-400">
            Delete “{pendingDelete.title}”? This cannot be undone.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" className="btn-ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
