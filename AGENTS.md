# AGENTS.md

## Cursor Cloud specific instructions

This repo (`btheducationgroupweb`) is primarily a large **static HTML website** for BTH Education
Group (marketing pages + a certification/program catalog), plus a Node data-pipeline tooling layer
and a few optional backends. Startup after the update script has run:

### Serve the website (core product)
- From the repo root: `python3 -m http.server 8000`, then open `http://localhost:8000/index.html`.
- Hosting is just the repo root (`firebase.json` `hosting.public` is `.`); there is no build step for
  the site — files are served as-is.
- `npx firebase-tools serve --only hosting` and the Firebase emulator Hosting both default to port
  **5000**, which is the same port the Ruby Stripe backend binds to. Remap one if you run them together.

### Data pipeline (closest thing to lint/tests)
- Scripts live in root `package.json` (`node scripts/*.js`); see `README.md` for the list.
- `npm run validate:data` validates `assets/data/certifications.json` against its JSON Schema. It
  currently reports pre-existing dataset schema failures ("must NOT have additional properties") and
  exits non-zero. This is a pre-existing data-quality state of the repo, not an environment problem.
- There is no ESLint/Prettier/RuboCop config and no formal unit-test runner. Many `test-*.html` pages
  and `*_TEST.js` files are ad-hoc manual test harnesses.

### Optional backends (not required to run/preview the site)
- Firebase Cloud Functions (`functions/`, Node 20 engine): `npm install --prefix functions`. Running
  the emulator suite additionally needs a Java runtime plus a Firebase project/login, which are not
  provisioned here.
- Ruby Stripe backend (`backend-ruby/`, Sinatra): needs Ruby + `bundle install` (Ruby is not installed
  by default) and env vars `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `ALLOWED_ORIGIN`,
  `WEBHOOK_SECRET`. Binds `0.0.0.0:5000`; the checkout frontend expects it at `http://localhost:5000`.
- PHP contact-form mailer (`api/phpmailer/send.php`): needs PHP + SMTP credentials (neither installed
  by default).

### Non-obvious gotchas
- Several large sector pages under `programs/` (e.g. `informationtechnology.html`, `finance.html`) have
  a **pre-existing inline-script "Unexpected end of input" error**, so their live certification-filter
  grid does not render. This is not caused by environment setup.
- `comptia-bundle-evaluation-demo.html` is a reliable, self-contained page for exercising core
  certification-evaluation logic end to end (select certs → "Evaluate My Progress" → progress results).
- The repo root contains many `*-backup*.html` / `COMPLETE_BACKUP/` files and a `backups/` folder under
  `programs/`; these are cruft, not active pages.
