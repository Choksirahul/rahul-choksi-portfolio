# Rahul Choksi — Senior Frontend Developer Portfolio

Production portfolio for Rahul Choksi, showcasing frontend experience, selected work, skills, career history, education, certifications, and contact details.

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Local Development

Use Node.js 22 LTS. This project pins that major version in `.nvmrc` and requires
Node.js `>=20.9.0` through `package.json`.

```bash
nvm install
nvm use
npm install
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

## Vercel Deployment

Import the repository directly into Vercel. Vercel will detect Next.js and use the included build configuration automatically.

No environment variables are required. When adding a custom domain, set the optional `SITE_URL` environment variable to its full HTTPS origin so canonical, sitemap, structured-data, and social metadata use that domain.
