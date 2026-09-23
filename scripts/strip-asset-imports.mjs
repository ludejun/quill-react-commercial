// Style imports carry no type information, but they survive into the emitted
// .d.ts as side-effect imports pointing at paths that do not exist next to the
// declarations. Consumers then get "Cannot find module './assets/….less'".
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const libDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'lib');
const ASSET_IMPORT = /^import\s+['"][^'"]+\.(?:less|css|scss|svg)['"];?\s*$/gm;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (extname(entry.name) === '.ts') yield full;
  }
}

let stripped = 0;
for await (const file of walk(libDir)) {
  const before = await readFile(file, 'utf8');
  const after = before.replace(ASSET_IMPORT, '');
  if (after !== before) {
    await writeFile(file, after);
    stripped += 1;
  }
}
console.log(`stripped asset imports from ${stripped} declaration file(s)`);
