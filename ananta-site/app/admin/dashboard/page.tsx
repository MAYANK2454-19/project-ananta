'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
export default function Dashboard() {
  const [email, setEmail] = useState('Checking session…');
  useEffect(() => {
    (async () => {
      try {
        const s = createClient();
        const { data } = await s.auth.getUser();
        if (!data.user) {
          window.location.href = '/admin';
          return;
        }
        setEmail(data.user.email || 'Authorised administrator');
      } catch {
        window.location.href = '/admin';
      }
    })();
  }, []);
  async function logout() {
    const s = createClient();
    await s.auth.signOut();
    window.location.href = '/admin';
  }
  return (
    <main className="inner-page">
      <div className="page-top">
        <span>ANANTA / ADMIN</span>
        <button className="text-link" onClick={logout}>
          SIGN OUT ↗
        </button>
      </div>
      <h1 className="page-title">
        Control <em>room.</em>
      </h1>
      <p className="page-intro">
        Signed in as {email}. This starter dashboard is ready to connect to event content
        and registration data.
      </p>
      <div className="admin-grid">
        <article>
          <span>01 / EVENT CONTENT</span>
          <h2>Site updates</h2>
          <p>
            Connect this module to a Supabase table to edit announcements, dates and
            public-page content without redeploying.
          </p>
          <span className="status">DATABASE SETUP REQUIRED</span>
        </article>
        <article>
          <span>02 / REGISTRATIONS</span>
          <h2>Team entries</h2>
          <p>
            Registration records should be stored in a private table with row-level
            security and exposed here only to the allowlisted admin.
          </p>
          <span className="status">DATABASE SETUP REQUIRED</span>
        </article>
        <article>
          <span>03 / ROUND MANAGEMENT</span>
          <h2>Submissions & reviews</h2>
          <p>
            Next module: submission links, round status, review notes and organiser
            announcements.
          </p>
          <span className="status">DATABASE SETUP REQUIRED</span>
        </article>
      </div>
      <p className="notice">
        Authentication is wired for Supabase. The admin UI intentionally does not pretend
        to show registration data until the database schema and access policies have been
        configured.
      </p>
    </main>
  );
}
