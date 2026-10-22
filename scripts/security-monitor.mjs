import { readFile } from 'node:fs/promises';
// Read-only check. No form submission and no request bodies are logged.
const targets = ['https://www.somosecooa.com.br/'];
const template = await readFile(new URL('../deploy/_headers', import.meta.url), 'utf8');
const expected = Object.fromEntries(
  template.split('\n').flatMap((line) => {
    const match = line.match(/^ {2}(Content-Security-Policy|Strict-Transport-Security):\s*(.*)$/i);
    return match ? [[match[1].toLowerCase(), match[2]]] : [];
  })
);
const normalize = (value) =>
  value
    ?.split(';')
    .map((part) => part.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(';');
let failed = false;
for (const target of targets) {
  try {
    const r = await fetch(target, {
      signal: globalThis.AbortSignal.timeout(20000),
      redirect: 'follow',
    });
    const hsts = r.headers.get('strict-transport-security');
    const csp = r.headers.get('content-security-policy');
    const drift = Object.keys(expected).filter(
      (header) => normalize(r.headers.get(header)) !== normalize(expected[header])
    );
    const ok =
      drift.length === 0 &&
      r.ok &&
      new URL(r.url).protocol === 'https:' &&
      Boolean(hsts) &&
      Boolean(csp);
    console.log(
      JSON.stringify({ target, finalURL: r.url, status: r.status, hsts, csp, drift, ok })
    );
    if (!ok) failed = true;
    await r.body?.cancel();
  } catch (error) {
    console.error(JSON.stringify({ target, error: error.message }));
    failed = true;
  }
}
if (failed) process.exitCode = 1;
