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
  participant_email: string | null;
  participant_name: string | null;
  entry_number: string | null;
  submitted_at: string | null;
  imported_at: string;
  source: 'website' | 'google_forms';
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
  registrationDate: string | null;
  registrationSource: 'website' | 'google_forms' | null;
  participantName: string | null;
  entryNumber: string | null;
  adminRole: AdminRole | null;
  adminActive: boolean | null;
};

function registrationTime(row: RegistrationDirectoryRow): number {
  const parsed = Date.parse(row.submitted_at ?? row.imported_at);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function keepNewest(
  index: Map<string, RegistrationDirectoryRow>,
  key: string,
  candidate: RegistrationDirectoryRow,
) {
  const prior = index.get(key);
  if (!prior || registrationTime(candidate) > registrationTime(prior)) {
    index.set(key, candidate);
  }
}

/**
 * Joins private ￿￿￿ֻǱ˞￿￿￿