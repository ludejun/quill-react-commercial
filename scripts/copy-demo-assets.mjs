// Copies the UMD bundle into example/ so GitHub Pages can serve the demo from
// that folder alone (the workflow publishes example/, not dist/).
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = [
  ['dist/quill-react-commercial.min.js', 'example/quill-react-commercial.min.js'],
  ['dist/quill-react-commercial.min.js.map', 'example/quill-react-commercial.min.js.map'],
  ['dist/quill-react-commercial.min.css', 'example/quill-react-commercial.min.css'],
];

await mkdir(join(root, 'example'), { recursive: true });
for (const [from, to] of assets) {
  await copyFile(join(root, from), join(root, to));
  console.log(`copied ${from} -> ${to}`);
}
