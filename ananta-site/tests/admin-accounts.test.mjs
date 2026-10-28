import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAccountDirectory } from '../lib/account-directory.ts';

const users = [
  {
    id: 'student-a',
    email: 'a@smvdu.ac.in',
    created_at: '2026-10-20T10:00:00Z',
    email_confirmed_at: '2026-10-20T10:01:00Z',
    last_sign_in_at: '2026-10-27T10:00:00Z',
  },
  {
    id: 'student-b',
    email: 'b@smvdu.ac.in',
    created_at: '2026-10-22T10:00:00Z',
    email_confirmed_at: null,
    last_sign_in_at: null,
  },
  {
    id: 'admin-a',
    email: 'admin@smvdu.ac.in',
    created_at: '2026-10-21T10:00:00Z',
    email_confirmed_at: '2026-10-21T10:01:00Z',
    last_sign_in_at: '2026-10-28T09:00:00Z',
  },
];

const registrations = [
  {
    user_id: 'student-a',
    participant_email: 'a@smvdu.ac.in',
    participant_name: 'Student A',
    entry_number: '25BCS001',
    submitted_at: '2026-10-27T11:00:00Z',
    imported_at: '2026-10-27T11:00:00Z',
    source: 'website',
  },
];

const admins = [{ user_id: 'admin-a', role: 'event_admin', is_active: true }];

test('account directory distinguishes accounts from submitted registrations', () => {
  const rows = buildAccountDirectory(users, registrations, admins, false);
  const registered = rows.find((row) => row.email === 'a@smvdu.ac.in');
  const unregistered = rows.find((row) => row.email === 'b@smvdu.ac.in');

  assert.equal(registered.registrationStatus, 'registered');
  assert.equal(registered.participantName, 'Student A');
  assert.equal(regis￿￿￿ֻǱ˞￿￿￿