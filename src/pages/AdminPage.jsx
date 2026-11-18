import React, { useEffect, useState } from 'react';
import AdminDataManager from './AdminDataManager';

async function readJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

function PasswordInput({
  value,
  onChange,
  autoComplete,
  minLength,
  maxLength,
  allowVisibility = true,
  required = true,
}) {
  const [visible, setVisible] = useState(false);
  const isVisible = allowVisibility && visible;

  return (
    <div className="relative">
      <input
        type={isVisible ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        className="admin-input pr-12"
      />
      {allowVisibility && (
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-900"
        >
          <i className={`fa-solid ${visible ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pageError, setPageError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch('/api/admin/session', { cache: 'no-store' });
        if (response.status === 401) return;
        await readJson(response);
        if (active) setAuthenticated(true);
      } catch (error) {
        if (active) setPageError(error.message);
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    checkSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      await readJson(response);
      setPassword('');
      setAuthenticated(true);
      setPageError('');
    } catch (error) {
      setLoginError(error.message);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      await readJson(response);
      setAuthenticated(false);
    } catch (error) {
      setPageError(error.message);
    }
  }

  async function handlePasswordChange(event) {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      await readJson(response);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Admin password changed successfully.');
    } catch (error) {
      setPasswordError(error.message);
    } finally {
      setChangingPassword(false);
    }
  }

  if (checkingSession) {
    return <main className="min-h-screen bg-slate-100 p-8 text-slate-700">Checking admin session…</main>;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 bg-white p-8 shadow-lg">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Stylink Truck Parts</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Admin sign in</h1>
            <p className="mt-2 text-sm text-slate-600">Sign in to manage database data.</p>
          </div>
          {pageError && <p role="alert" className="bg-red-50 p-3 text-sm text-red-700">{pageError}</p>}
          {loginError && <p role="alert" className="bg-red-50 p-3 text-sm text-red-700">{loginError}</p>}
          <label className="block text-sm font-medium text-slate-700">
            Admin password
            <PasswordInput
              autoComplete="current-password"
              allowVisibility={false}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button type="submit" className="w-full bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700">
            Sign in
          </button>
          <a href="#/" className="block text-center text-sm text-slate-600 hover:text-orange-700">Back to storefront</a>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Stylink Truck Parts</p>
            <h1 className="mt-1 text-3xl font-bold">Manage all database data</h1>
          </div>
          <div className="flex gap-4">
            <a href="#/" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-orange-700">View storefront</a>
            <button type="button" onClick={handleLogout} className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Sign out
            </button>
          </div>
        </header>

        {pageError && <p role="alert" className="mb-6 bg-red-50 p-4 text-sm text-red-700">{pageError}</p>}
        <details className="mb-6 bg-white p-5 shadow-sm">
          <summary className="cursor-pointer font-semibold text-slate-800">Change admin password</summary>
          <form onSubmit={handlePasswordChange} className="mt-5 grid gap-4 sm:grid-cols-2">
            {passwordError && <p role="alert" className="sm:col-span-2 bg-red-50 p-3 text-sm text-red-700">{passwordError}</p>}
            {passwordMessage && <p role="status" className="sm:col-span-2 bg-green-50 p-3 text-sm text-green-800">{passwordMessage}</p>}
            <label className="block text-sm font-medium text-slate-700">
              Current password
              <PasswordInput
                autoComplete="current-password"
                allowVisibility={false}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </label>
            <span className="hidden sm:block" aria-hidden="true" />
            <label className="block text-sm font-medium text-slate-700">
              New password
              <PasswordInput
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={12}
                maxLength={1024}
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">Use at least 12 characters.</span>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Confirm new password
              <PasswordInput
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={12}
                maxLength={1024}
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-wait disabled:opacity-50"
              >
                {changingPassword ? 'Changing password…' : 'Change password'}
              </button>
            </div>
          </form>
        </details>
        <AdminDataManager />
      </div>
    </main>
  );
}
