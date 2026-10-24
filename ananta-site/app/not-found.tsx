import Link from 'next/link';
import type { Metadata } from 'next';
import { Strip } from '@/components/Marks';
import { Stamp } from '@/components/Stamp';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className={`section ${styles.wrap}`}>
      <div className="shell">
        <div className={styles.grid}>
          <div>
            <p className={`meta ${styles.code}`}>Error 404</p>

            <h1 className={styles.title}>
              Nothing shipped
              <br />
              <em>at this URL.</em>
            </h1>

            <p className={styles.strips}>
              <Strip tone="saffron" rotate={-1.6}>
                Try again.
              </Strip>
            </p>

            <p className={styles.body}>
              The page you asked for is not here. It may have moved, or the link may be
              wrong.
            </p>

            <ul className={styles.links}>
              <li>
                <Link href="/" className="link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/journey" className="link">
                  The journey
                </Link>
              </li>
              <li>
                <Link href="/register" className="link">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.stamp}>
            <Stamp size={160} />
          </div>
        </div>
      </div>
    </section>
  );
}
