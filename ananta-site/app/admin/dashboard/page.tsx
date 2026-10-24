'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import styles from '../admin.module.css';
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
    <section className={styles.wrap}>
      <div className="shell">
        <div className={styles.top}>
          <p className={`meta ${styles.label}`}>ANANTA / Admin</p>
          <button className={styles.signOut} onClick={logout}>
            Sign out
          </button>
        </div>

        <h1 className={styles.title}>
          Control <em>room.</em>
        </h1>
        <p className={styles.intro}>
          Signed in as {email}. Ready to connect to event content and registration data.
        </p>

        <ul className={styles.modules}>
          <li className={styles.module}>
            <span className={`meta ${styles.moduleNo}`}>01 / Event content</span>
            <h2 className={styles.moduleName}>Site updates</h2>
            <p className={styles.moduleBody}>
              Connect this module to a Supabase table to edit announcements, dates and
              public-page content without redeploying.
            </p>
            <span className={styles.status}>Database setup required</span>
          </li>
          <li className={styles.module}>
            <span className={`meta ${styles.moduleNo}`}>02 / Registrations</span>
            <h2 className={styles.moduleName}>Team entries</h2>
            <p className={styles.moduleBody}>
              Registration records belong in a private table with row-level security,
              exposed here only to the allowlisted admin.
            </p>
            <span className={styles.status}>Database setup required</span>
          </li>
          <li className={styles.module}>
            <span className={`meta ${styles.moduleNo}`}>03 / Round management</span>
            <h2 className={styles.moduleName}>Submissions &amp; reviews</h2>
            <p className={styles.moduleBody}>
              Next module: submission links, round status, review notes and organiser
              announcements.
            </p>
            <span className={styles.status}>Database setup required</span>
          </li>
        </ul>

        <p className={styles.notice}>
          Authentication is wired for Supabase. This panel does not pretend to show
          registration data until the schema and access policies exist.
        </p>
      </div>
    </section>
  );
}
