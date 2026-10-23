# ANANTA — event website starter

A multi-page Next.js website for the six-week ANANTA project hackathon. Design direction: editorial cream/ink/red, poster-inspired type, restrained paper texture, and an interactive Three.js sculptural loop. References inform layout and usability, not copied assets or copy.

## Pages

- `/` Home / interactive 3D hero / event highlights
- `/about` About ANANTA
- `/journey` Four-round timeline and evaluation criteria
- `/rules` Team requirements and event rules
- `/register` Registration handoff to the organiser-approved form
- `/admin` Supabase sign-in
- `/admin/dashboard` Protected admin landing area

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the real values.
4. Run `npm run dev` and open `http://localhost:3000`.

## Admin setup (required before launch)

1. Create a Supabase project and add URL + anon key to `.env.local`.
2. Set `ADMIN_EMAIL` to the exact organiser email allowed to administer the site.
3. In Supabase Authentication, create/invite that email as a user and set its password securely. Disable public signups if they are not needed.
4. The middleware checks the authenticated user's email against `ADMIN_EMAIL` for `/admin/*`. Do not expose service-role keys in browser code.
5. The dashboard intentionally indicates where database-backed features belong. Before enabling registration management, create the required tables and strict Row Level Security policies. Do not collect student data in an unprotected public table.
6. Set `NEXT_PUBLIC_REGISTRATION_URL` to the approved live registration form. It currently has a placeholder by design.

## Before public deployment

- Confirm registration closing time, exact submission times, and post-Round-3 advancement details with organisers.
- Add the final approved registration link and official contact channel.
- Test mobile layouts, admin auth, and the 3D experience on campus Wi-Fi and low-power phones.
- Add a proper database schema and admin CRUD actions before calling the admin panel complete.

## Important

This is a runnable project scaffold, not a claim that registration records or event CMS data are already connected. It deliberately avoids inventing a live form URL, team data, sponsor data, or credentials. The sponsorship deck was used only for broad visual direction; sponsor packages and deck-only statistics are not included in site content.
