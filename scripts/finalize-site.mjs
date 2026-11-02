import fs from 'node:fs';
import path from 'node:path';

// Apply shared behavior to every published HTML page, including future pages.
const output = path.resolve('_site');
const script = '<script defer src="/site-interactions.js?v=1"></script>';
let updated = 0;
function visit(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(filename);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = fs.readFileSync(filename, 'utf8');
      if (!html.includes('site-interactions.js')) {
        const result = /<\/head>/i.test(html)
          ? html.replace(/<\/head>/i, script + '\n</head>')
          : script + '\n' + html;
        fs.writeFileSync(filename, result);
        updated++;
      }
    }
  }
}
if (!fs.existsSync(output)) throw new Error('The built _site directory is missing.');
visit(output);
console.log('Applied shared website interactions to ' + updated + ' additional HTML pages.');
