// build-data.js
const fs = require('fs-extra');
const path = require('path');

// ---- CONFIG ----
const srcDir = path.resolve(__dirname, 'data');
const destDirs = [
  path.resolve(__dirname, 'stellar-empires', 'src', 'data'),
  path.resolve(__dirname, 'stellar-empires', 'public', 'data'),
];

// ---- SLUGIFY ----
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

// Heuristic: must have title, description, points (number)
function isTraitOrFlaw(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.points === 'number'
  );
}

// Recursively find all trait/flaw objects inside arbitrary JSON
function* findTraitOrFlawObjects(obj) {
  if (Array.isArray(obj)) {
    for (const v of obj) yield* findTraitOrFlawObjects(v);
  } else if (typeof obj === 'object' && obj !== null) {
    if (isTraitOrFlaw(obj)) {
      yield obj;
    }
    for (const k in obj) yield* findTraitOrFlawObjects(obj[k]);
  }
}

// Get all JSON files recursively in srcDir
async function findAllJsonFiles(dir) {
  let files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await findAllJsonFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Pass 1: Build a map of all titles to slugs
async function buildSlugMap(jsonFiles) {
  const slugMap = {};
  for (const file of jsonFiles) {
    const text = await fs.readFile(file, 'utf8');
    let json;
    try { json = JSON.parse(text); } catch { continue; }
    for (const obj of findTraitOrFlawObjects(json)) {
      const slug = slugify(obj.title);
      slugMap[obj.title] = slug;
    }
  }
  return slugMap;
}

// Patch trait/flaw object with slug + replace references
function patchWithSlugs(obj, slugMap, refFields = ['requires', 'rejects', 'scales']) {
  obj.slug = slugify(obj.title);
  for (const field of refFields) {
    if (Array.isArray(obj[field])) {
      obj[field] = obj[field].map(ref =>
        ref && slugMap[ref] ? slugMap[ref] : ref
      );
    }
  }
}

// Pass 2: Patch each file and write to output location
async function patchAndCopyFile(srcFile, outFile, slugMap) {
  const text = await fs.readFile(srcFile, 'utf8');
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (json) {
    let modified = false;
    for (const obj of findTraitOrFlawObjects(json)) {
      patchWithSlugs(obj, slugMap);
      modified = true;
    }
    if (modified) {
      await fs.outputFile(outFile, JSON.stringify(json, null, 2));
      return true;
    }
  }
  // If not JSON or not traits/flaws, just copy as-is
  await fs.copy(srcFile, outFile);
  return false;
}

async function buildData() {
  // 1. Get all source JSON files
  const allJsonFiles = await findAllJsonFiles(srcDir);

  // 2. Build slug map (all titles to slugs)
  const slugMap = await buildSlugMap(allJsonFiles);

  // 3. For each destDir: clean, then patch+copy every file
  for (const destDir of destDirs) {
    await fs.ensureDir(destDir);
    await fs.emptyDir(destDir); // Clean output

    for (const srcFile of allJsonFiles) {
      const rel = path.relative(srcDir, srcFile);
      const outFile = path.join(destDir, rel);
      await patchAndCopyFile(srcFile, outFile, slugMap);
    }
    console.log(`Built and copied JSON with slugs to ${destDir}`);
  }
}

module.exports = buildData;

if (require.main === module) {
  buildData().catch(err => {
    console.error('Failed to build data:', err);
    process.exit(1);
  });
}
