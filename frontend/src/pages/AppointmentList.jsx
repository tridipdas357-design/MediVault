import { useEffect, useMemo, useState } from 'react';
import { Calendar, Pencil, Plus, Trash2 } from 'lucide-react';
import api from '../api';
import Modal from '../components/Modal';
import { formatDate, formatTime } from '../utils/labels';

const empty = {
  doctor: '',
  specialty: '',
  date: '',
  time: '',
  location: '',
};

function isUpcoming(appointment) {
  return new Date(`${appointment.date}T${appointment.time}`).getTime() >= Date.now();
}

export default function AppointmentList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function load() {
    const { data } = await api.get('/api/appointments');
    setItems(data);
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const { data } = await api.get('/api/appointments');
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

  const upcoming = useMemo(() => items.filter(isUpcoming), [items]);
  const past = useMemo(() => [...items.filter((item) => !isUpcoming(item))].reverse(), [items]);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      doctor: item.doctor,
      specialty: item.specialty || '',
      date: item.date,
      time: item.time?.slice(0, 5) || '',
      location: item.location || '',
    });
    setOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const payload = {
      doctor: form.doctor.trim(),
      specialty: form.specialty.trim() || null,
      date: form.date,
      time: form.time.length === 5 ? `${form.time}:00` : form.time,
      location: form.location.trim() || null,
    };
    try {
      if (editing) {
        await api.put(`/api/appointments/${editing.id}`, payload);
      } else {
        await api.post('/api/appointments', payload);
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
      await api.delete(`/api/appointments/${pendingDelete.id}`);
      setItems((prev) => prev.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch {
      /* interceptor */
    }
  }

  function renderGroup(title, list) {
    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {list.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-10 text-center">
            <Calendar className="text-stone-400" />
            <p className="text-sm muted">No {title.toLowerCase()} appointments.</p>
          </div>
        ) : (
          list.map((item) => (
            <article key={item.id} className="card card-hover p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-medium">{item.doctor}</h3>
                  <p className="text-sm muted">
                    {item.specialty || 'General'} · {formatDate(item.date)} {formatTime(item.time)}
                  </p>
                  {item.location ? <p className="mt-1 text-sm text-stone-400">{item.location}</p> : null}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-ghost px-3" onClick={() => openEdit(item)} aria-label="Edit appointment">
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-danger px-3"
                    onClick={() => setPendingDelete(item)}
                    aria-label="Delete appointment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="mt-1 muted">Upcoming visits split from history automatically.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          <Plus size={16} />
          Add appointment
        </button>
      </div>

      {loading ? (
        <p className="text-sm muted">Loading…</p>
      ) : (
        <div className="space-y-8">
          {renderGroup('Upcoming', upcoming)}
          {renderGroup('Past', past)}
        </div>
      )}

      {open ? (
        <Modal title={editing ? 'Edit appointment' : 'New appointment'} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="appt-doctor">
                Doctor
              </label>
              <input
                id="appt-doctor"
                className="input"
                required
                value={form.doctor}
                onChange={(e) => setForm((prev) => ({ ...prev, doctor: e.target.value }))}
              />
            </div>
            <div>
              <label className="label" htmlFor="appt-spec">
                Specialty
              </label>
              <input
                id="appt-spec"
                className="input"
                value={form.specialty}
                onChange={(e) => setForm((prev) => ({ ...prev, specialty: e.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="appt-date">
                  Date
                </label>
                <input
                  id="appt-date"
                  type="date"
                  className="input"
                  required
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="label" htmlFor="appt-time">
                  Time
                </label>
                <input
                  id="appt-time"
                  type="time"
                  className="input"
                  required
                  value={form.time}
                  onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="appt-loc">
                Location
              </label>
              <input
                id="appt-loc"
                className="input"
                value={form.location}
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
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
        <Modal title="Delete appointment" onClose={() => setPendingDelete(null)}>
          <p className="text-sm muted">
            Delete the visit with {pendingDelete.doctor}? This cannot be undone.
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
