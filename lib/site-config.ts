const normalizeOrigin = (value: string) => {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.");
  }
  if (process.env.NODE_ENV === "production" && url.protocol !== "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
    throw new Error("Production SITE_URL must use HTTPS.");
  }
  return url.origin;
};

export function getSiteUrl() {
  if (process.env.SITE_URL) return normalizeOrigin(process.env.SITE_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return normalizeOrigin(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  if (process.env.VERCEL_URL) return normalizeOrigin(`https://${process.env.VERCEL_URL}`);
  return process.env.NODE_ENV === "production" ? "https://rahul-choksi-portfolio.vercel.app" : "http://localhost:3000";
}
