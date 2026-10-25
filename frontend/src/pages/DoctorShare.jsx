import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, FolderOpen, Pill, Printer, ShieldPlus, User } from 'lucide-react';
import api from '../api';
import ThemeToggle from '../components/ThemeToggle';
import { formatDate, formatTime, typeLabel } from '../utils/labels';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 text-sm text-stone-800">{value || '—'}</p>
    </div>
  );
}

export default function DoctorShare() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  async function unlock(event) {
    event.preventDefault();
    setError('');
    setUnlocking(true);
    try {
      const { data: summary } = await api.post(`/api/share/${token}/access`, { password });
      setData(summary);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Unable to access this patient summary.');
    } finally {
      setUnlocking(false);
    }
  }

  const upcoming = useMemo(() => {
    if (!data?.appointments) return [];
    return data.appointments.filter(
      (item) => new Date(`${item.date}T${item.time}`).getTime() >= Date.now()
    );
  }, [data]);

  const past = useMemo(() => {
    if (!data?.appointments) return [];
    return data.appointments.filter(
      (item) => new Date(`${item.date}T${item.time}`).getTime() < Date.now()
    );
  }, [data]);

  const activeMeds = useMemo(
    () => (data?.medications || []).filter((item) => item.active),
    [data]
  );
  const inactiveMeds = useMemo(
    () => (data?.medications || []).filter((item) => !item.active),
    [data]
  );

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen px-4">
        <div className="card w-full max-w-md p-8">
          <ShieldPlus className="mx-auto text-sage-600" />
          <h1 className="mt-3 text-center text-lg font-semibold">Patient record access</h1>
          <p className="muted mt-2 text-center text-sm">
            Enter the access password provided by the patient to view their read-only medical summary.
          </p>
          <form onSubmit={unlock} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="doctor-share-password">Access password</label>
              <input
                id="doctor-share-password"
                className="input"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError('');
                }}
              />
            </div>
            {error ? <p role="alert" className="text-sm text-critical">{error}</p> : null}
            <button type="submit" className="btn-primary w-full" disabled={unlocking}>
              {unlocking ? 'Verifying…' : 'View patient summary'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const patient = data.patient;

  return (
    <div className="min-h-screen bg-linen px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="icon-soft h-11 w-11">
              <ShieldPlus size={22} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-sage-700">
                MediVault clinical summary
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">{patient.name}</h1>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <ThemeToggle className="border border-stone-200 px-3 py-2 text-sm" />
            <button type="button" className="btn-ghost" onClick={() => window.print()}>
              <Printer size={16} />
              Print
            </button>
          </div>
        </header>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-sage-700">
            <User size={18} />
            <h2 className="font-semibold">Patient identity</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={patient.name} />
            <Field label="Age" value={patient.age} />
            <Field label="Blood group" value={patient.bloodGroup} />
            <Field label="Emergency contact" value={patient.emergencyContact} />
            <div className="sm:col-span-2">
              <Field label="Allergies" value={patient.allergies} />
            </div>
          </div>
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-sage-700">
            <Pill size={18} />
            <h2 className="font-semibold">Medications</h2>
          </div>
          {data.medications.length === 0 ? (
            <p className="muted text-sm">No medications on file.</p>
          ) : (
            <div className="space-y-4">
              {activeMeds.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">Active</p>
                  <ul className="divide-y divide-stone-100">
                    {activeMeds.map((item) => (
                      <li key={item.id} className="py-2">
                        <p className="font-medium">{item.name}</p>
                        <p className="muted text-sm">
                          {[item.dosage, item.frequency].filter(Boolean).join(' · ') || 'No dosage listed'}
                          {item.startDate ? ` · since ${formatDate(item.startDate)}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {inactiveMeds.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">Inactive</p>
                  <ul className="divide-y divide-stone-100">
                    {inactiveMeds.map((item) => (
                      <li key={item.id} className="py-2">
                        <p className="font-medium">{item.name}</p>
                        <p className="muted text-sm">
                          {[item.dosage, item.frequency].filter(Boolean).join(' · ') || 'No dosage listed'}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-sage-700">
            <FolderOpen size={18} />
            <h2 className="font-semibold">Medical records</h2>
          </div>
          {data.records.length === 0 ? (
            <p className="muted text-sm">No records on file.</p>
          ) : (
            <ul className="space-y-3">
              {data.records.map((record) => (
                <li key={record.id} className="rounded-xl border border-stone-100 bg-linen-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{record.title}</p>
                      <p className="muted text-sm">
                        {typeLabel(record.type)}
                        {record.doctor ? ` · ${record.doctor}` : ''}
                      </p>
                    </div>
                    <p className="text-sm text-stone-500">{formatDate(record.date)}</p>
                  </div>
                  {record.notes ? <p className="mt-2 text-sm text-stone-600">{record.notes}</p> : null}
                  {record.fileUrl ? (
                    <p className="mt-2 text-xs text-sage-700">Scanned document attached in MediVault</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-sage-700">
            <Calendar size={18} />
            <h2 className="font-semibold">Appointments</h2>
          </div>
          {data.appointments.length === 0 ? (
            <p className="muted text-sm">No appointments on file.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">Upcoming</p>
                {upcoming.length === 0 ? (
                  <p className="muted text-sm">None scheduled.</p>
                ) : (
                  <ul className="space-y-2">
                    {upcoming.map((item) => (
                      <li key={item.id} className="text-sm">
                        <span className="font-medium">{item.doctor}</span>
                        <span className="muted">
                          {' '}
                          · {item.specialty || 'General'} · {formatDate(item.date)} {formatTime(item.time)}
                          {item.location ? ` · ${item.location}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone-400">Past</p>
                {past.length === 0 ? (
                  <p className="muted text-sm">No past visits listed.</p>
                ) : (
                  <ul className="space-y-2">
                    {past.map((item) => (
                      <li key={item.id} className="text-sm">
                        <span className="font-medium">{item.doctor}</span>
                        <span className="muted">
                          {' '}
                          · {item.specialty || 'General'} · {formatDate(item.date)} {formatTime(item.time)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>

        <p className="text-center text-xs text-stone-400">
          Read-only snapshot
          {data.generatedAt ? ` · generated ${new Date(data.generatedAt).toLocaleString()}` : ''}.
          Do not store this page unless the patient consents.
        </p>
      </div>
    </div>
  );
}
