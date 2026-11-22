# Rahul Choksi — Senior Frontend Developer Portfolio

Production portfolio for Rahul Choksi, showcasing frontend experience, selected work, skills, career history, education, certifications, and contact details.

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- GSAP, ScrollTrigger, and `@gsap/react` (active portfolio animations)
- Lucide React

## Local Development

Use Node.js 22 LTS. This project pins that major version in `.nvmrc` and requires
Node.js `>=20.9.0` through `package.json`.

```bash
nvm install
nvm use
npm ci
npm run dev
```

The repository includes an `.nvmrc` file. If a new terminal still reports Node
18, reload your shell with `exec zsh` or run `nvm use` from the project folder.

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

Development and production both use the webpack pipeline. The production audit
found lower mobile blocking time with this output than with Turbopack for this
portfolio; no framework or animation changes were needed.

## Vercel Deployment

Import the repository directly into Vercel. Vercel will detect Next.js and use the included build configuration automatically.

No environment variables are required. When adding a custom domain, set the optional `SITE_URL` environment variable to its full HTTPS origin so canonical, sitemap, structured-data, and social metadata use that domain.

The production fallback origin is `https://rahul-choksi-portfolio.vercel.app`.
`SITE_URL` takes precedence over Vercel's production/preview origin variables;
only HTTP(S) origins without credentials, paths, queries, or fragments are accepted.
Use HTTPS for non-local production origins. Set the production domain explicitly
when using a custom domain, and rebuild after changing it so sitemap metadata agrees.

## Security and production verification

```bash
npm ci
npm audit
npm run lint
npm run typecheck
npm run build
npm run check:production
```

`check:production` temporarily starts the built app on port 3013 (`QA_PORT` can
override it), checks response headers, fresh nonces, nonce-spoof protection,
generated font CSS, private-file 404s, and the resume PDF, then stops the server.
It does not deploy or modify hosting settings.

`proxy.ts` generates a cryptographic nonce per HTML response and enforces CSP.
The nonce is passed to the portfolio bootstrap and structured-data scripts.
Production scripts do not permit `unsafe-inline` or `unsafe-eval`; inline styles
remain permitted for GSAP and Next Image. The home page therefore renders per
request and sends private/no-store HTML caching; hashed static assets retain
Next.js caching. Static export and shared caching of nonce-bearing HTML are not
compatible with this configuration.

The server also sends frame restrictions, MIME-sniffing protection, referrer and
permissions policies. HTTPS redirects and HSTS are managed by Vercel and must be
verified again if hosting changes. The repository does not add a redundant HSTS
policy or assume a proxy's forwarding headers are trustworthy.

Production browser source maps are explicitly disabled. Browser-delivered code
and public assets remain inspectable; credentials must never be placed in them.
Only `.env.example` should be tracked. Environment files, private documentation,
and project configuration must not be copied into `public/`.

The local Geist font is a Latin/extended-Latin and symbol subset of the original
Geist variable font, with unchanged retained outlines. Its SIL license is included
in `app/fonts/Geist-LICENSE.txt`. The unused Geist Mono font is no longer loaded.
Legacy components still reference Framer Motion; these are not rendered by the
active portfolio and were preserved during the focused hardening work.
