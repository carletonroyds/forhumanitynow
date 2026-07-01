// Downloads the scenario background photos from Unsplash into public/images/
// so the deployed app never depends on hotlinking Unsplash at runtime.
//
// Runs automatically in CI (see .github/workflows/deploy.yml) before every
// build. You can also run it locally once with `npm run fetch-images` to
// develop offline afterwards. Safe to re-run: existing files are skipped.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'images');

// photoId -> local filename. Same photos originally hotlinked in
// src/data/scenarios.ts, just localized so nothing external is required
// once the site is built.
const IMAGES = {
  '1550745165-9bc0b252726f': 'scenario-01.jpg',
  '1518770660439-4636190af475': 'scenario-02.jpg',
  '1531297484001-80022131f5a1': 'scenario-03.jpg',
  '1451187580459-43490279c0fa': 'scenario-04.jpg',
  '1614850523296-d8c1af93d400': 'scenario-05.jpg',
  '1504384308090-c894fdcc538d': 'scenario-06.jpg',
  '1535223289827-42f1e9919769': 'scenario-07.jpg',
  '1558591710-4b4a1ae0f04d': 'scenario-08.jpg',
  '1485827404703-89b55fcc595e': 'scenario-09.jpg',
  '1519389950473-47ba0277781c': 'scenario-10.jpg',
};

const urlFor = (photoId) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1920`;

async function downloadOne(photoId, filename) {
  const dest = join(OUT_DIR, filename);
  if (existsSync(dest)) {
    console.log(`  skip  ${filename} (already exists)`);
    return true;
  }
  const url = urlFor(photoId);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    console.log(`  ok    ${filename} (${(buf.length / 1024).toFixed(0)} KB)`);
    return true;
  } catch (err) {
    console.warn(`  FAIL  ${filename}: ${err.message}`);
    return false;
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Fetching ${Object.keys(IMAGES).length} scenario images into public/images/ ...`);

  let failures = 0;
  for (const [photoId, filename] of Object.entries(IMAGES)) {
    const ok = await downloadOne(photoId, filename);
    if (!ok) failures += 1;
  }

  if (failures > 0) {
    console.warn(
      `\n${failures} image(s) could not be downloaded (no network access?). ` +
      `The app will still build, but those backgrounds will 404 until you re-run ` +
      `"npm run fetch-images" with an internet connection.`
    );
  } else {
    console.log('\nAll scenario images are present in public/images/.');
  }
}

main();
