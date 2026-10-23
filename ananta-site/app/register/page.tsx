export default function Register() {
  const url =
    process.env.NEXT_PUBLIC_REGISTRATION_URL ||
    'https://forms.gle/REPLACE_WITH_REAL_FORM';
  return (
    <main className="inner-page register-page">
      <div className="page-top">
        <span>ANANTA / REGISTRATION</span>
        <span>04—04</span>
      </div>
      <h1 className="page-title">
        Got a problem
        <br />
        worth <em>solving?</em>
      </h1>
      <p className="page-intro">
        Bring the curiosity. Bring the commitment. The next six weeks are for building.
      </p>
      <div className="register-panel">
        <div>
          <span className="eyebrow">BEFORE YOU ENTER</span>
          <h2>Know what you’re signing up for.</h2>
          <ul>
            <li>Six weeks of building and iteration</li>
            <li>A team that meets the year and inclusion requirements</li>
            <li>Original work, with authentic Git history</li>
            <li>A deployed product for the final evaluation</li>
          </ul>
        </div>
        <div className="register-action">
          <span>REGISTRATION WINDOW</span>
          <strong>23 OCT — 04 NOV</strong>
          <a className="button button-dark" href={url} target="_blank" rel="noreferrer">
            OPEN REGISTRATION ↗
          </a>
          <small>
            The registration form is managed by the organisers. If this button still
            points to the setup placeholder, add the approved form URL to{' '}
            <code>.env.local</code>.
          </small>
        </div>
      </div>
      <p className="fineprint">
        By registering, teams should ensure the information they submit is accurate.
        Organisers may update operational details as the event progresses.
      </p>
    </main>
  );
}
