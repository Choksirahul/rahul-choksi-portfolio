import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/** Per-response nonces protect inline Next.js and portfolio bootstrap scripts. */
export function proxy(request: NextRequest) {
  const nonce = randomBytes(18).toString("base64");
  const development = process.env.NODE_ENV === "development";
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    // GSAP and next/image update style attributes; no third-party styles are allowed.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${development ? " ws: wss:" : ""}`,
    "object-src 'none'", "base-uri 'none'", "frame-ancestors 'none'",
    "frame-src 'none'", "form-action 'none'",
  ].join("; ");
  const headers = new Headers(request.headers);
  // Always overwrite any client-supplied nonce or CSP headers.
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/", "/((?!_next|.*\\.).*)"] };
