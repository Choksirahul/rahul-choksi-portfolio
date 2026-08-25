const normalizeOrigin = (value: string) => value.replace(/\/$/, "");

export function getSiteUrl() {
  if (process.env.SITE_URL) return normalizeOrigin(process.env.SITE_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
