import { parse } from 'parse5';
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
function collect(node) {
  if (node.tagName === 'script') {
    const attrs = Object.fromEntries(node.attrs.map(({ name, value }) => [name, value]));
    if (
      !('src' in attrs) &&
      !['application/ld+json', 'application/json', 'text/x-dc'].includes(attrs.type)
    ) {
      const text = (node.childNodes || []).map((child) => child.value || '').join('');
      hashes.add("'sha256-" + createHash('sha256').update(text).digest('base64') + "'");
    }
  }
  for (const child of node.childNodes || []) collect(child);
}
for (const file of await htmlFiles(root)) {
  collect(parse(await readFile(file, 'utf8')));
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
