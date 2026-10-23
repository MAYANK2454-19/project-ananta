import Link from 'next/link';
const rules = [
  [
    '01',
    'Team structure',
    'Each team has a 3rd-year team leader, 1st- and 2nd-year core developers, a 4th-year senior student mentor and a faculty mentor.',
  ],
  ['02', 'Inclusive teams', 'Every team must include at least one female member.'],
  [
    '03',
    'Original work only',
    'Development must be original and completed within the event window. Commit history and commit authenticity will be audited.',
  ],
  [
    '04',
    'Deploy the product',
    'Projects must be deployed to a public cloud or hosting service so the jury can evaluate a live product.',
  ],
  [
    '05',
    'Be ready for reviews',
    'Teams should be prepared to explain their design, architecture, implementation, deployment and decisions at each round.',
  ],
];
export default function Rules() {
  return (
    <main className="inner-page">
      <div className="page-top">
        <span>ANANTA / RULES OF THE BUILD</span>
        <span>03—04</span>
      </div>
      <h1 className="page-title">
        Make it yours.
        <br />
        <em>Make it work.</em>
      </h1>
      <p className="page-intro">
        A few ground rules, so the work—and the people doing it—get a fair shot.
      </p>
      <div className="rules-list">
        {rules.map(([n, title, desc]) => (
          <article key={n}>
            <span>{n}</span>
            <div>
              <h2>{title}</h2>
              <p>{desc}</p>
            </div>
            <b>↗</b>
          </article>
        ))}
      </div>
      <div className="notice">
        If a requirement or deadline is unclear, check with the organisers before
        submitting. Final submission times and post-review advancement details are to be
        confirmed.
      </div>
      <Link href="/register" className="button button-dark">
        I’M READY TO BUILD ↗
      </Link>
    </main>
  );
}
