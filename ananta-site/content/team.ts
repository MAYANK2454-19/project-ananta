/**
 * The people behind ANANTA.
 *
 * Static on purpose — no database, no Supabase. Editing this file is the whole
 * job of adding someone. See "Adding a team member" in the root README.
 *
 * Every entry below is a PLACEHOLDER. Real names go in only when Aryaveer adds
 * them. A production build refuses to run while any `TODO Name` remains:
 * see scripts/check-team.mjs.
 */

export type TeamGroupId =
  'faculty' | 'organising-core' | 'devgrowth' | 'codeclub' | 'web';

export type Club = 'sangam' | 'devgrowth' | 'codeclub' | 'smvdu';

export type Person = {
  name: string;
  role: string;
  group: TeamGroupId;
  club?: Club;
  year?: string;
  /** Slug of the file in public/team/raw/<slug>.jpg. Omit for an initials card. */
  photo?: string;
  linkedin?: string;
  github?: string;
};

export type TeamGroup = {
  id: TeamGroupId;
  title: string;
  blurb: string;
  club?: Club;
  /** Faculty are shown larger. */
  featured?: boolean;
};

/** Order matters — this is the order they appear on the page. */
export const GROUPS: TeamGroup[] = [
  {
    id: 'faculty',
    title: 'Faculty coordinators',
    blurb: 'School of CSE, SMVDU.',
    club: 'smvdu',
    featured: true,
  },
  {
    id: 'organising-core',
    title: 'Organising core',
    blurb: 'SANGAM, the SoCSE tech community.',
    club: 'sangam',
  },
  {
    id: 'devgrowth',
    title: 'DevGrowth',
    blurb: 'Workshops, mentoring and the developer track.',
    club: 'devgrowth',
  },
  {
    id: 'codeclub',
    title: 'Code Club',
    blurb: 'Contests, sessions and the student build community.',
    club: 'codeclub',
  },
  {
    id: 'web',
    title: 'Website & design',
    blurb: 'This site.',
    club: 'sangam',
  },
];

export const TEAM: Person[] = [
  // --- Faculty coordinators ------------------------------------------------
  { name: 'TODO Name', role: 'Faculty coordinator', group: 'faculty', club: 'smvdu' },
  { name: 'TODO Name', role: 'Faculty coordinator', group: 'faculty', club: 'smvdu' },

  // --- Organising core (SANGAM) --------------------------------------------
  {
    name: 'TODO Name',
    role: 'President',
    group: 'organising-core',
    club: 'sangam',
    year: '4th year',
  },
  {
    name: 'TODO Name',
    role: 'Vice president',
    group: 'organising-core',
    club: 'sangam',
    year: '3rd year',
  },
  {
    name: 'TODO Name',
    role: 'Event lead',
    group: 'organising-core',
    club: 'sangam',
    year: '3rd year',
  },

  // --- DevGrowth -----------------------------------------------------------
  {
    name: 'TODO Name',
    role: 'Lead',
    group: 'devgrowth',
    club: 'devgrowth',
    year: '3rd year',
  },
  {
    name: 'TODO Name',
    role: 'Technical lead',
    group: 'devgrowth',
    club: 'devgrowth',
    year: '3rd year',
  },

  // --- Code Club -----------------------------------------------------------
  {
    name: 'TODO Name',
    role: 'Lead',
    group: 'codeclub',
    club: 'codeclub',
    year: '3rd year',
  },
  {
    name: 'TODO Name',
    role: 'Contests lead',
    group: 'codeclub',
    club: 'codeclub',
    year: '2nd year',
  },

  // --- Website & design ----------------------------------------------------
  {
    name: 'TODO Name',
    role: 'Frontend & design',
    group: 'web',
    club: 'sangam',
    year: '3rd year',
  },
  {
    name: 'TODO Name',
    role: 'Backend & admin',
    group: 'web',
    club: 'sangam',
    year: '3rd year',
  },
];

/** True while a row is still a placeholder. */
export const isPlaceholder = (p: Person) =>
  p.name.trim().toUpperCase().startsWith('TODO');

export const peopleIn = (group: TeamGroupId) => TEAM.filter((p) => p.group === group);

export const placeholders = () => TEAM.filter(isPlaceholder);

/** "Asha Rani" -> "AR". Placeholders say so rather than showing "TN". */
export function initials(name: string): string {
  if (isPlaceholder({ name } as Person)) return 'TBC';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
