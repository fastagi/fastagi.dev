import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve('dist');
async function walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(files.map(file => file.isDirectory() ? walk(resolve(dir, file.name)) : resolve(dir, file.name)))).flat();
}
const htmlFiles = (await walk(root)).filter(file => file.endsWith('.html'));
const errors = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const [label, pattern] of [ ['title', /<title>[^<]+<\/title>/], ['description', /name="description" content="[^"]+"/], ['language', /<html lang="(?:en|zh-CN)"/], ['single h1', /<h1[ >]/g] ]) {
    if ((html.match(pattern) || []).length !== 1) errors.push(`${file}: missing or repeated ${label}`);
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${file}: duplicate id`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(https?:|mailto:|data:)/.test(value)) continue;
    const [path, fragment] = value.split('#');
    const target = path ? resolve(path.startsWith('/') ? root : dirname(file), '.' + (path.startsWith('/') ? path : '/' + path)) : file;
    const targetFile = path.endsWith('/') ? resolve(target, 'index.html') : target;
    try {
      await access(targetFile);
      if (fragment && targetFile.endsWith('.html') && !(await readFile(targetFile, 'utf8')).includes(`id="${fragment}"`)) errors.push(`${file}: missing anchor ${value}`);
    } catch { errors.push(`${file}: missing local target ${value}`); }
  }
  // Public marketing must not link visitors to private source repositories.
  if (/href="https:\/\/github.com\/fastagi\/(keepbuild|fastbase)(?:["/#])/.test(html)) errors.push(`${file}: private source link`);
}
await access(resolve(root, 'assets/social.png')).catch(() => errors.push('Missing PNG social image'));
if (htmlFiles.length !== 9) errors.push(`Expected 8 localized pages and a 404; found ${htmlFiles.length}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Checked ${htmlFiles.length} HTML pages: metadata, headings, local links, anchors, assets, and public source boundaries.`);
