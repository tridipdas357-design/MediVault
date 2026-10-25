import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, QrCode, RefreshCw } from 'lucide-react';
import api from '../api';

export default function ShareQr() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSet, setPasswordSet] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const shareUrl = useMemo(() => {
    if (!token) return '';
    return `${window.location.origin}/share/${token}`;
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const { data } = await api.get('/api/profile/share');
        if (!cancelled) {
          setToken(data.token);
          setPasswordSet(data.passwordSet);
        }
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

  async function copyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function refresh() {
    setRefreshing(true);
    try {
      const { data } = await api.post('/api/profile/share/refresh');
      setToken(data.token);
    } catch {
      /* interceptor */
    } finally {
      setRefreshing(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    if (password !== confirmPassword) {
      setPasswordError('The passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const { data } = await api.post('/api/profile/share/password', { password });
      setPasswordSet(data.passwordSet);
      setPassword('');
      setConfirmPassword('');
      setPasswordSaved(true);
    } catch (error) {
      setPasswordError(error.message || 'Unable to save the password.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Doctor QR</h1>
        <p className="muted mt-1">
          Show this code at a clinic. Your doctor must enter the password you set to open your read-only summary.
        </p>
      </div>

      <div className="card p-6">
        {loading ? (
          <p className="muted text-sm">Loading…</p>
        ) : (
          <div className="space-y-6">
            <form onSubmit={savePassword} className="rounded-xl border border-stone-200 bg-linen-50 p-4">
              <h2 className="font-semibold">
                {passwordSet ? 'Change doctor access password' : 'Set a doctor access password'}
              </h2>
              <p className="muted mt-1 text-sm">
                Share this password with your doctor separately from the QR code. Use at least 8 characters.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="share-password">Password</label>
                  <input
                    id="share-password"
                    className="input"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="share-password-confirm">Confirm password</label>
                  <input
                    id="share-password-confirm"
                    className="input"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-primary" disabled={savingPassword}>
                  {savingPassword ? 'Saving…' : passwordSet ? 'Update password' : 'Save password'}
                </button>
                {passwordSaved ? <span className="accent text-sm">Password saved</span> : null}
                {passwordError ? <span className="text-sm text-critical">{passwordError}</span> : null}
              </div>
            </form>
            {passwordSet ? (
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                <div className="rounded-2xl border border-stone-200 bg-linen-50 p-4">
                  <QRCodeSVG value={shareUrl} size={196} bgColor="#FFFFFF" fgColor="#0F9D8A" level="M" />
                </div>
                <div className="w-full space-y-4">
                  <div className="flex items-start gap-2">
                    <QrCode size={18} className="mt-0.5 text-sage-600" />
                    <p className="text-sm text-stone-600">
                      Doctors do not need an account. After password verification, they can view your identity,
                      allergies, medications, records, and appointments.
                    </p>
                  </div>
                  <div>
                    <label className="label">Share link</label>
                    <p className="break-all rounded-xl border border-stone-200 bg-linen-50 px-3 py-2 text-xs text-stone-600">
                      {shareUrl}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn-primary" onClick={copyLink}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy link'}
                    </button>
                    <button type="button" className="btn-ghost" onClick={refresh} disabled={refreshing}>
                      <RefreshCw size={16} />
                      {refreshing ? 'Refreshing…' : 'New code'}
                    </button>
                  </div>
                  <p className="text-xs text-stone-400">
                    Creating a new code invalidates the previous QR so an old printout no longer works.
                  </p>
                </div>
              </div>
            ) : (
              <p className="muted text-sm">Save a password to enable access through your doctor QR.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
