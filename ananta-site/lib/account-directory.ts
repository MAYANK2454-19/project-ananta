import type { AdminRole } from './admin';

export type AuthDirectoryUser = {
  id: string;
  email?: string | null;
  created_at: string;
  email_confirmed_at?: string | null;
  confirmed_at?: string | null;
  last_sign_in_at?: string | null;
};

export type RegistrationDirectoryRow = {
  user_id: string | null;
  participant_name: string | null;
  entry_number: string | null;
  submitted_at: string | null;
};

export type AdminDirectoryRow = {
  user_id: string;
  role: AdminRole;
  is_active: boolean;
};

export type AccountDirectoryEntry = {
  email: string;
  createdAt: string;
  emailConfirmedAt: string | null;
  lastSignInAt: string | null;
  registrationStatus: 'registered' | 'not_registered';
  registrationSubmittedAt: string | null;
  participantName: string | null;
  entryNumber: string | null;
  adminRole: AdminRole | null;
  adminActive: boolean | null;
};

/** Joins private Auth metadata to registration status without exposing auth IDs. */
export function buildAccountDirectory(
  users: AuthDirectoryUser[],
  registrations: RegistrationDirectoryRow[],
  admins: AdminDirectoryRow[],
  includeAdminAccounts: boolean,
): AccountDirectoryEntry[] {
  const registrationByUser = new Map<string, RegistrationDirectoryRow>();
  for (const row of registrations) {
    if (!row.user_id) continue;
    const prior = registrationByUser.get(row.user_id);
    if (!prior || (row.submitted_at ?? '') > (prior.submitted_at ?? '')) {
      registrationByUser.set(row.user_id, row);
    }
  }

  const roleByUser = new Map(
    admins.map((row) => [
      row.user_id,
      { role: row.role, isActive: Boolean(row.is_active) },
    ]),
  );

  return users
    .filter((user) => includeAdminAccounts || !roleByUser.has(user.id))
    .map((user) => {
      const registration = registrationByUser.get(user.id);
      const admin = roleByUser.get(user.id);
      return {
        email: user.email ?? '',
        createdAt: user.created_at,
        emailConfirmedAt: user.email_confirmed_at ?? user.confirmed_at ?? null,
        lastSignInAt: user.last_sign_in_at ?? null,
        registrationStatus: registration ? 'registered' : 'not_registered',
        registrationSubmittedAt: registration?.submitted_at ?? null,
        participantName: registration?.participant_name ?? null,
        entryNumber: registration?.entry_number ?? null,
        adminRole: admin?.role ?? null,
        adminActive: admin?.isActive ?? null,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastSignInAt ?? a.createdAt;
      const bTime = b.lastSignInAt ?? b.createdAt;
      return bTime.localeCompare(aTime);
    });
}
