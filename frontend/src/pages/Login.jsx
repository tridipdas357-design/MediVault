import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const { token, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (token) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setLocalError(error.message || 'Unable to sign in.');
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
            <h1 className="text-xl font-semibold">Welcome back</h1>
            <p className="muted text-sm">Sign in to MediVault</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {localError ? <p className="text-sm text-critical">{localError}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="muted mt-6 text-center text-sm">
          New here?{' '}
          <Link to="/register" className="accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
