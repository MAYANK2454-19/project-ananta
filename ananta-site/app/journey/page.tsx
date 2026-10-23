import Link from 'next/link';
const rounds = [
  {
    n: '01',
    name: 'Ideation & planning',
    date: '06—12 NOVEMBER',
    points: '20 points',
    mode: 'ONLINE',
    desc: 'Define the problem and show that the solution can be built.',
    deliver: [
      'Problem statement and originality',
      'Architecture, schema, workflow and stack rationale',
      'Feasible plan and clear role division',
    ],
    due: 'PPT submission · 12 November',
  },
  {
    n: '02',
    name: 'UI / UX design',
    date: '13—18 NOVEMBER',
    points: '20 points',
    mode: 'ONLINE REVIEW',
    desc: 'Turn the plan into a coherent experience that can be tested before the code is finished.',
    deliver: [
      'Visual design and usability',
      'Complete user flow',
      'Clickable Figma or Adobe XD prototype',
    ],
    due: 'Prototype review · 18 November',
  },
  {
    n: '03',
    name: 'Pre-deployment review',
    date: '25 NOVEMBER',
    points: '30 points',
    mode: 'ON CAMPUS',
    desc: 'Bring the working build. The full team must be present for the hands-on review.',
    deliver: [
      'Functionality and completeness',
      'Code quality and integration',
      'Deployment and documentation',
    ],
    due: 'Hands-on review and elimination round',
  },
  {
    n: '04',
    name: 'The final',
    date: '04 DECEMBER',
    points: '30 points',
    mode: 'ON CAMPUS',
    desc: 'Put the live product in front of the jury and demonstrate what it does.',
    deliver: [
      'Live product demonstration',
      'Impact and usefulness',
      'Presentation and questions',
    ],
    due: 'Final evaluation · 4 December',
  },
];
export default function Journey() {
  return (
    <main className="inner-page">
      <div className="page-top">
        <span>ANANTA / THE JOURNEY</span>
        <span>02—04</span>
      </div>
      <h1 className="page-title">
        From first
        <br />
        sketch to <em>live URL.</em>
      </h1>
      <p className="page-intro">
        Four rounds. Each one asks for more than the last. Dates and submission times may
        be updated by the organisers.
      </p>
      <div className="rounds">
        {rounds.map((r) => (
          <article className="round" key={r.n}>
            <div className="round-no">{r.n}</div>
            <div className="round-main">
              <div className="round-meta">
                <span>{r.date}</span>
                <span>{r.mode}</span>
              </div>
              <h2>{r.name}</h2>
              <p>{r.desc}</p>
              <ul>
                {r.deliver.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="round-due">{r.due}</div>
            </div>
            <div className="round-points">{r.points}</div>
          </article>
        ))}
      </div>
      <div className="notice">
        Registration is scheduled to close on 4 November. Team announcements are planned
        by 5 November. Follow organiser updates for confirmed submission times.
      </div>
      <Link href="/register" className="button button-dark">
        REGISTRATION DETAILS ↗
      </Link>
    </main>
  );
}
