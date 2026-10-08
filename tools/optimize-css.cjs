const fs = require('node:fs/promises');
const path = require('node:path');
const { PurgeCSS } = require('purgecss');

const root = path.resolve(__dirname, '..');

async function optimize() {
  const source = path.join(root, 'css', 'style.min.75408a616c8d64a93d3b03e345cadd04f72b1cded1cd7b9819149db1a7264234.css');
  const [result] = await new PurgeCSS().purge({
    content: [path.join(root, 'index.html')],
    css: [source],
    safelist: ['active', 'dark', 'hidden'],
    defaultExtractor(content) {
      const classes = [...content.matchAll(/class=["']([^"']+)["']/g)]
        .flatMap(match => match[1].split(/\s+/));
      const tokens = content.match(/[\w-]+/g) || [];
      return [...classes, ...tokens];
    },
  });
  await fs.writeFile(path.join(root, 'css', 'homepage.min.css'), result.css + '\n');
  const original = (await fs.stat(source)).size;
  console.log(`Homepage CSS: ${original} -> ${Buffer.byteLength(result.css)} bytes`);
}

optimize().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
