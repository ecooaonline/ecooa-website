// Build-time hashes allow only inline scripts present in this exact artifact.
// Report-only is intentional until preview and edge injection are verified.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
async function htmlFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(file)));
    else if (file.endsWith('.html')) files.push(file);
  }
  return files;
}
const hashes = new Set();
for (const file of await htmlFiles(root)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (
      /\bsrc\s*=/i.test(match[1]) ||
      /type\s*=\s*["'](?:application\/ld\+json|text\/x-dc)["']/i.test(match[1])
    )
      continue;
    hashes.add("'sha256-" + createHash('sha256').update(match[2]).digest('base64') + "'");
  }
}
const file = path.join(root, '_headers');
let headers = await readFile(file, 'utf8');
const line = headers
  .split('\n')
  .find((value) => value.trimStart().startsWith('Content-Security-Policy-Report-Only:'));
if (!line) throw new Error('Missing report-only policy template');
const updated = line.replace(
  "script-src 'self'",
  "script-src 'self' " + [...hashes].sort().join(' ')
);
if (Buffer.byteLength(updated) > 7500)
  throw new Error('CSP exceeds conservative header budget; split by route before release');
headers = headers.replace(line, updated);
await writeFile(file, headers);
console.log(
  `CSP report-only: ${hashes.size} inline hashes, ${Buffer.byteLength(updated)} bytes. Enforcement unchanged.`
);
