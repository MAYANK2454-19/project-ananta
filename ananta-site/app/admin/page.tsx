'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

/**
 * useSearchParams() opts the subtree into client-side rendering, and Next
 * requires a Suspense boundary around it or `next build` fails at the
 * prerender step. This boundary is the whole fix; the sign-in logic below is
 * unchanged. See the note for Mayank in the PR.
 */
export default function Admin() {
  return (
    <Suspense fallback={null}>
      <AdminSignIn />
    </Suspense>
  );
}

function AdminSignIn() {
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (params.get('login'))
      setMessage('Sign in with the administrator account approved for this site.');
  }, [params]);
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setMessage(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Check your configuration.',
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="admin-wrap">
      <div className="admin-card">
        <span className="eyebrow">ANANTA / CONTROL ROOM</span>
        <h1>
          Admin <em>access.</em>
        </h1>
        <p>This area is restricted to the authorised organiser account.</p>
        <form onSubmit={signIn}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button className="button button-dark" disabled={loading}>
            {loading ? 'CHECKING…' : 'SIGN IN ↗'}
          </button>
        </form>
        {message && <p className="form-message">{message}</p>}
        <small>
          Admin access is restricted by the server-side ADMIN_EMAIL allowlist. Create the
          approved account in Supabase; never put credentials in source code.
        </small>
      </div>
    </main>
  );
}
