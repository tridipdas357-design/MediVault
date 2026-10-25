import { useEffect, useState } from 'react';
import { Pencil, Pill, Plus, Trash2 } from 'lucide-react';
import api from '../api';
import Modal from '../components/Modal';
import { formatDate } from '../utils/labels';

const empty = {
  name: '',
  dosage: '',
  frequency: '',
  startDate: '',
  active: true,
};

export default function MedicationList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function load() {
    const { data } = await api.get('/api/medications');
    setItems(data);
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const { data } = await api.get('/api/medications');
        if (!cancelled) setItems(data);
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

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name,
      dosage: item.dosage || '',
      frequency: item.frequency || '',
      startDate: item.startDate || '',
      active: item.active,
    });
    setOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      dosage: form.dosage.trim() || null,
      frequency: form.frequency.trim() || null,
      startDate: form.startDate || null,
      active: form.active,
    };
    try {
      if (editing) {
        await api.put(`/api/medications/${editing.id}`, payload);
      } else {
        await api.post('/api/medications', payload);
      }
      await load();
      setOpen(false);
    } catch {
      /* interceptor */
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await api.delete(`/api/medications/${pendingDelete.id}`);
      setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      /* interceptor */
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Medications</h1>
          <p className="mt-1 muted">Track what you are taking and when it started.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Add medication
        </button>
      </div>

      {loading ? (
        <p className="text-sm muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
          <Pill className="text-stone-400" />
          <p className="text-sm muted">No medications saved yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="card card-hover p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{item.name}</h2>
                  <p className="text-sm muted">
                    {[item.dosage, item.frequency].filter(Boolean).join(' · ') || 'No dosage listed'}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    Started {formatDate(item.startDate)} · {item.active ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-ghost px-3" onClick={() => openEdit(item)} aria-label="Edit medication">
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-danger px-3"
                    onClick={() => setPendingDelete(item)}
                    aria-label="Delete medication"
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
        <Modal title={editing ? 'Edit medication' : 'New medication'} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="med-name">
                Name
              </label>
              <input
                id="med-name"
                className="input"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="med-dosage">
                  Dosage
                </label>
                <input
                  id="med-dosage"
                  className="input"
                  placeholder="500mg"
                  value={form.dosage}
                  onChange={(e) => setForm((prev) => ({ ...prev, dosage: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="med-freq">
                  Frequency
                </label>
                <input
                  id="med-freq"
                  className="input"
                  placeholder="Twice daily"
                  value={form.frequency}
                  onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="med-start">
                Start date
              </label>
              <input
                id="med-start"
                type="date"
                className="input"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.checked }))}
              />
              Currently active
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {pendingDelete ? (
        <Modal title="Delete medication" onClose={() => setPendingDelete(null)}>
          <p className="text-sm muted">
            Delete “{pendingDelete.name}”? This cannot be undone.
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
