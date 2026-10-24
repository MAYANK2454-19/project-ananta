import type { Metadata } from 'next';

/**
 * The admin pages are client components, so they cannot export metadata
 * themselves. This gives them a real title and keeps them out of search.
 */
export const metadata: Metadata = {
  title: 'Organiser access',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
