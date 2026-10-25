import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Register() {
  const { token, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (token) {
    return <Navigate to="/" replace />;
  }

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError('');
    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
    } catch (error) {
      setLocalError(error.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linen px-4">
      <ThemeToggle className="absolute right-4 top-4 p-2" />
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="icon-soft h-10 w-10">
            <ShieldPlus size={22} />
          </span>
          <div>
            <h1 className="text-xl font-semibold">Create your vault</h1>
            <p className="muted text-sm">Keep records in one secure place</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              minLength={8}
              className="input"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
            />
            <p className="mt-1 text-xs text-stone-400">At least 8 characters.</p>
          </div>
          {localError ? <p className="text-sm text-critical">{localError}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="muted mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
