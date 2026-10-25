import { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age ?? '',
    bloodGroup: user?.bloodGroup || '',
    allergies: user?.allergies || '',
    emergencyContact: user?.emergencyContact || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.put('/api/profile', {
        name: form.name.trim(),
        age: form.age === '' ? null : Number(form.age),
        bloodGroup: form.bloodGroup || null,
        allergies: form.allergies.trim() || null,
        emergencyContact: form.emergencyContact.trim() || null,
      });
      setUser(data);
      setSaved(true);
    } catch {
      /* interceptor */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="muted mt-1">Emergency details stay with your account.</p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label">Email</label>
          <input className="input" value={user?.email || ''} disabled />
        </div>
        <div>
          <label className="label" htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            className="input"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="profile-age">
              Age
            </label>
            <input
              id="profile-age"
              type="number"
              min="0"
              className="input"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="profile-blood">
              Blood group
            </label>
            <select
              id="profile-blood"
              className="input"
              value={form.bloodGroup}
              onChange={(e) => update('bloodGroup', e.target.value)}
            >
              <option value="">Not set</option>
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="profile-allergies">
            Allergies
          </label>
          <textarea
            id="profile-allergies"
            className="input min-h-[88px] resize-y"
            value={form.allergies}
            onChange={(e) => update('allergies', e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="profile-emergency">
            Emergency contact
          </label>
          <input
            id="profile-emergency"
            className="input"
            placeholder="Name and phone"
            value={form.emergencyContact}
            onChange={(e) => update('emergencyContact', e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button type="button" className="btn-ghost" onClick={logout}>
            Sign out
          </button>
          <div className="flex items-center gap-3">
            {saved ? <span className="accent text-sm">Saved</span> : null}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
