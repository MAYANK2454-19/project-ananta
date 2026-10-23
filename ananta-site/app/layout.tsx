import type { Metadata } from 'next';
import './globals.css';
import { SiteNav } from '@/components/SiteNav';
export const metadata: Metadata = { title: 'ANANTA — Build it. Ship it.', description: 'A six-week product hackathon at the School of Computer Science & Engineering, SMVDU.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SiteNav />{children}<footer className="footer"><span>ANANTA / 2026</span><span>DEVGROWTH × CODE CLUB · SoCSE, SMVDU</span><a href="/admin">ADMIN ↗</a></footer></body></html>; }
