import Link from 'next/link';
import LoopScene from '@/components/LoopScene';
const stages = [
  ['01', 'IDEATION', '06—12 NOV', '20 PTS'],
  ['02', 'UI / UX', '13—18 NOV', '20 PTS'],
  ['03', 'SHIP IT', '19—25 NOV', '30 PTS'],
  ['04', 'THE FINAL', '04 DEC', '30 PTS'],
];
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-kicker">
          <span>SANGAM PRESENTS</span>
          <span>A PROJECT HACKATHON · SMVDU</span>
        </div>
        <div className="hero-title">
          <h1>ANANTA</h1>
          <span className="hero-index">
            NO SHORTCUTS.
            <br />
            JUST THE BUILD.
          </span>
        </div>
        <div className="hero-stage">
          <div className="hero-copy">
            <p className="eyebrow">23 OCTOBER — 04 DECEMBER 2026</p>
            <h2>
              Don’t pitch it.
              <br />
              <em>Ship it.</em>
            </h2>
            <p>
              A six-week run from a real problem to a product that works, lives online,
              and has your name in the commit history.
            </p>
            <Link className="button button-dark" href="/register">
              MAKE YOUR ENTRY <span>↗</span>
            </Link>
          </div>
          <LoopScene />
          <div className="orbit-note">
            A WORKING PRODUCT
            <br />
            OR IT ISN’T DONE.
          </div>
        </div>
        <div className="hero-bottom">
          <span>01 / THE BUILD</span>
          <span>SCROLL TO EXPLORE ↓</span>
          <span>KATRA, J&K · INDIA</span>
        </div>
      </section>
      <section className="manifesto section-pad">
        <div className="section-label">
          [ THE POINT ] <span>01—04</span>
        </div>
        <div className="manifesto-grid">
          <h2>
            Twenty-four hours makes a demo.
            <br />
            <em>Six weeks makes a product.</em>
          </h2>
          <div>
            <p>
              ANANTA is a project-based hackathon built around the part that usually gets
              skipped: finishing. Pick a problem, plan the system, design the experience,
              build it, deploy it, and stand behind what you made.
            </p>
            <Link className="text-link" href="/about">
              WHY ANANTA EXISTS <span>↗</span>
            </Link>
          </div>
        </div>
        <div className="metrics">
          <div>
            <b>06</b>
            <span>WEEKS TO BUILD</span>
          </div>
          <div>
            <b>04</b>
            <span>ROUNDS TO CLEAR</span>
          </div>
          <div>
            <b>01</b>
            <span>LIVE PRODUCT PER TEAM</span>
          </div>
          <div>
            <b>₹10K</b>
            <span>PRIZE POOL</span>
          </div>
        </div>
      </section>
      <section className="journey-preview section-pad">
        <div className="section-label">
          [ THE ROUTE ] <span>02—04</span>
        </div>
        <div className="split-heading">
          <h2>
            Every round
            <br />
            moves the build <em>forward.</em>
          </h2>
          <Link className="text-link" href="/journey">
            FULL TIMELINE ↗
          </Link>
        </div>
        <div className="stage-list">
          {stages.map(([n, name, date, pts]) => (
            <Link href="/journey" className="stage-row" key={n}>
              <span>{n}</span>
              <h3>{name}</h3>
              <span>{date}</span>
              <b>{pts}</b>
              <i>↗</i>
            </Link>
          ))}
        </div>
      </section>
      <section className="red-cta">
        <span className="eyebrow">THE BUILD STARTS HERE</span>
        <h2>
          Make something
          <br />
          <em>worth shipping.</em>
        </h2>
        <Link href="/register" className="button button-light">
          REGISTRATION DETAILS ↗
        </Link>
        <div className="cta-stamp">
          ANANTA
          <br />
          2026
        </div>
      </section>
    </main>
  );
}
