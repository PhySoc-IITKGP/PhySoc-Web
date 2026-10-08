const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const images = [
  ['gallery/group.JPG', 'group', [480, 800, 1280, 1600]],
  ['gallery/calday.JPG', 'calday', [400, 640, 800, 1280, 1600]],
  ['gallery/officers.JPG', 'officers', [480, 800, 1280, 1600]],
  ['gallery/discuss.png', 'discuss', [400, 640, 800]],
  ['gallery/badminton.png', 'badminton', [400, 640, 800]],
  ['gallery/Integrationbee.png', 'integration-bee', [400, 640, 800]],
  ['gallery/farewell.png', 'farewell', [400, 640, 800]],
  ['gallery/pawm.png', 'pawm', [400, 640, 800]],
  ['gallery/freshers.png', 'freshers', [400, 640, 800]],
  ['logo_hu_62a2c291369a66f0.webp', 'logo-light', [250, 500]],
  ['logo-darkmode_hu_ce06e59bade57f0d.webp', 'logo-dark', [250, 500]],
];

async function optimize() {
  const output = path.join(root, 'images', 'optimized');
  await fs.mkdir(output, { recursive: true });
  for (const [source, name, widths] of images) {
    for (const width of widths) {
      const target = path.join(output, `${name}-${width}.webp`);
      const info = await sharp(path.join(root, 'images', source))
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: name.startsWith('logo-') ? 85 : 75, effort: 6 })
        .toFile(target);
      console.log(`${path.basename(target)}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KiB`);
    }
  }
}

optimize().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
