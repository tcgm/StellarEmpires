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

// Given an absolute file path and a title, build a qualified slug
function buildQualifiedSlug(filePath, title) {
  let relPath = path.relative(srcDir, filePath); // e.g. nations/sol/traits.json
  relPath = relPath.replace(/\.json$/i, '');     // e.g. nations/sol/traits
  relPath = relPath.replace(/[\\/]/g, '.');      // e.g. nations.sol.traits
  const slug = slugify(title);
  return `${relPath}.${slug}`;
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

// Recursively find all trait/flaw objects inside arbitrary JSON, yielding [object, path]
function* findTraitOrFlawObjects(obj, parents = []) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      yield* findTraitOrFlawObjects(obj[i], parents.concat(i));
    }
  } else if (typeof obj === 'object' && obj !== null) {
    if (isTraitOrFlaw(obj)) {
      yield [obj, parents];
    }
    for (const k in obj) {
      yield* findTraitOrFlawObjects(obj[k], parents.concat(k));
    }
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

// Pass 1: Build a map of all qualified slugs and support fast title+file lookups
async function buildSlugMap(jsonFiles) {
  const qualifiedSlugMap = {}; // { qualifiedSlug: {file, obj, title} }
  const fileTitleToSlug = {};  // { file|title: qualifiedSlug }
  const titleToSlugs = {};     // { title: [qualifiedSlug, ...] }

  for (const file of jsonFiles) {
    const text = await fs.readFile(file, 'utf8');
    let json;
    try { json = JSON.parse(text); } catch { continue; }
    for (const [obj] of findTraitOrFlawObjects(json)) {
      const qualifiedSlug = buildQualifiedSlug(file, obj.title);
      qualifiedSlugMap[qualifiedSlug] = { file, obj, title: obj.title };
      fileTitleToSlug[file + "|" + obj.title] = qualifiedSlug;
      if (!titleToSlugs[obj.title]) titleToSlugs[obj.title] = [];
      titleToSlugs[obj.title].push(qualifiedSlug);
    }
  }
  return { qualifiedSlugMap, fileTitleToSlug, titleToSlugs };
}

// Given a reference, file, and all slug maps, resolve to qualified slug
function resolveReference(ref, file, slugMaps) {
  if (!ref || typeof ref !== 'string' || !ref.trim()) return ref; // blank, keep as-is

  // Already a qualified slug (contains a dot and matches pattern)
  if (ref.match(/\./) && slugMaps.qualifiedSlugMap[ref]) return ref;

  // Try file-local first
  const local = slugMaps.fileTitleToSlug[file + "|" + ref];
  if (local) return local;

  // If only one exists globally, use that
  const matches = slugMaps.titleToSlugs[ref];
  if (matches && matches.length === 1) return matches[0];

  // If ambiguous or not found, keep as is and warn
  if (!matches || matches.length === 0) {
    console.warn(`[Slugify] Reference not found: "${ref}" in file ${file}`);
    return ref;
  }
  console.warn(`[Slugify] Ambiguous reference: "${ref}" in file ${file} (matches: ${matches.join(', ')})`);
  return ref;
}

// Patch trait/flaw object with slug + replace references
function patchWithSlugs(obj, file, slugMaps, refFields = ['requires', 'rejects', 'scales']) {
  obj.slug = buildQualifiedSlug(file, obj.title);
  for (const field of refFields) {
    if (Array.isArray(obj[field])) {
      obj[field] = obj[field].map(ref => resolveReference(ref, file, slugMaps));
    }
  }
}

// Pass 2: Patch each file and write to output location
async function patchAndCopyFile(srcFile, outFile, slugMaps) {
  const text = await fs.readFile(srcFile, 'utf8');
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (json) {
    let modified = false;
    for (const [obj] of findTraitOrFlawObjects(json)) {
      patchWithSlugs(obj, srcFile, slugMaps);
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

  // 2. Build slug maps
  const slugMaps = await buildSlugMap(allJsonFiles);

  // 3. For each destDir: clean, then patch+copy every file
  for (const destDir of destDirs) {
    await fs.ensureDir(destDir);
    await fs.emptyDir(destDir);

    for (const srcFile of allJsonFiles) {
      const rel = path.relative(srcDir, srcFile);
      const outFile = path.join(destDir, rel);
      await patchAndCopyFile(srcFile, outFile, slugMaps);
    }
    console.log(`Built and copied JSON with qualified slugs to ${destDir}`);
  }
}

module.exports = buildData;

if (require.main === module) {
  buildData().catch(err => {
    console.error('Failed to build data:', err);
    process.exit(1);
  });
}
