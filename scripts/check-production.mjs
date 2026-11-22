import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

// Checks the real HTTP server, including nonces and generated font-class consistency.
const port = process.env.QA_PORT || "3013";
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", port], { stdio: "ignore" });
try {
  let response;
  for (let attempt = 0; attempt < 80; attempt++) {
    try { response = await fetch(origin, { headers: { "x-nonce": "untrusted-client-value" } }); break; } catch { await setTimeout(100); }
  }
  assert(response?.ok, "Production server must start and return HTTP 200");
  const html = await response.text();
  const csp = response.headers.get("content-security-policy");
  const nonce = csp?.match(/'nonce-([^']+)'/)?.[1];
  assert(nonce && nonce !== "untrusted-client-value", "Server must generate its own nonce");
  assert(!/script-src [^;]*'(unsafe-inline|unsafe-eval)'/.test(csp), "Production script policy must be strict");
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)];
  assert(scripts.length > 0 && scripts.every(([, attributes]) => attributes.includes(`nonce="${nonce}"`)), "Every initial script must have the response nonce");
  const second = await fetch(origin);
  assert.notEqual(second.headers.get("content-security-policy"), csp, "Nonces must change between responses");
  assert.match(response.headers.get("cache-control"), /no-store/, "Nonce-bearing HTML must not enter shared caches");
  for (const [header, value] of Object.entries({ "x-content-type-options": "nosniff", "x-frame-options": "DENY", "referrer-policy": "strict-origin-when-cross-origin" })) assert.equal(response.headers.get(header), value);
  assert(response.headers.get("permissions-policy"));
  assert.equal(response.headers.get("x-powered-by"), null);
  const stylesheets = [...new Set([...html.matchAll(/href="([^"<>]+\.css(?:\?[^"<>]*)?)"/g)].map(([, url]) => url.replaceAll("&amp;", "&")))];
  const css = (await Promise.all(stylesheets.map(async url => (await fetch(new URL(url, origin))).text()))).join("\n");
  const bodyClasses = html.match(/<body[^>]*class="([^"]*)"/)?.[1].split(/\s+/) ?? [];
  assert(bodyClasses.length > 0, "The document must include its generated font classes");
  for (const className of bodyClasses) assert(css.includes(`.${className}{`), `Generated CSS must define font class ${className}`);
  for (const path of ["/.env", "/.env.production", "/.git/HEAD", "/package.json", "/next.config.ts"]) assert.equal((await fetch(origin + path)).status, 404, `Private file must not be served: ${path}`);
  const resume = await fetch(origin + "/Rahul-Choksi-Resume.pdf");
  assert.equal(resume.status, 200);
  assert((await resume.text()).startsWith("%PDF"));
  console.log("PASS: strict CSP, fresh nonces, nonce spoof protection, security headers, private HTML caching, font classes, private-file 404s, and resume PDF.");
} finally {
  server.kill("SIGTERM");
}
