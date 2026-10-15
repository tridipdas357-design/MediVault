import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FolderOpen, Pill } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate, typeLabel } from '../utils/labels';

function isUpcoming(appointment) {
  const when = new Date(`${appointment.date}T${appointment.time}`);
  return when.getTime() >= Date.now();
}

export default function Dashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [r, m, a] = await Promise.all([
          api.get('/api/records'),
          api.get('/api/medications'),
          api.get('/api/appointments'),
        ]);
        if (!cancelled) {
          setRecords(r.data);
          setMedications(m.data);
          setAppointments(a.data);
        }
      } catch {
        /* surfaced by interceptor */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingCount = useMemo(
    () => appointments.filter(isUpcoming).length,
    [appointments]
  );
  const activeMeds = useMemo(
    () => medications.filter((item) => item.active).length,
    [medications]
  );
  const recent = records.slice(0, 5);

  const stats = [
    { label: 'Total records', value: records.length, icon: FolderOpen, to: '/records' },
    { label: 'Upcoming appointments', value: upcomingCount, icon: Calendar, to: '/appointments' },
    { label: 'Active medications', value: activeMeds, icon: Pill, to: '/medications' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-slate-400">
          {user?.name ? `Welcome back, ${user.name}.` : 'Your health snapshot.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="card card-hover p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{label}</p>
              <Icon size={18} className="text-cyan-400" />
            </div>
            <p className="mt-3 text-3xl font-semibold">{loading ? '—' : value}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent records</h2>
          <Link to="/records" className="text-sm text-cyan-400 hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : recent.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
            <FolderOpen className="text-slate-500" />
            <p className="text-sm text-slate-400">No records yet — add your first prescription or lab report.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((record) => (
              <div key={record.id} className="card card-hover p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{record.title}</p>
                    <p className="text-sm text-slate-400">
                      {typeLabel(record.type)}
                      {record.doctor ? ` · ${record.doctor}` : ''}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500">{formatDate(record.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
