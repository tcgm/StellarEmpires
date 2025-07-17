const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const NATIONS_DIR = path.join(DATA_DIR, 'nations');
const COMMON_FILES = ['commonTraits.json', 'commonFlaws.json'];

// What field(s) to ensure exist on each trait/flaw object?
const FIELDS_TO_ENSURE = [
  { name: 'requires', default: [], type: 'array', traitOnly: false },
  // Add more fields as needed, e.g. { name: 'points', default: 0, type: 'number' }
];

// Utility: Check if object is likely a Trait or Flaw
function isTraitOrFlaw(obj) {
  // Heuristic: must have title, description, points (number)
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

// Patch trait/flaw objects as needed
function patchTraitOrFlaw(obj, isTrait) {
  for (const field of FIELDS_TO_ENSURE) {
    if (field.traitOnly && !isTrait) continue; // Only add to traits if specified
    if (!(field.name in obj)) obj[field.name] = Array.isArray(field.default) ? [...field.default] : field.default;
    // Optionally: type check/convert here if you want
  }
}

// Read, patch, and write back a file
async function processFile(filePath, isTrait) {
  const text = await fs.readFile(filePath, 'utf8');
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error in', filePath);
    return;
  }
  let modified = false;
  for (const obj of findTraitOrFlawObjects(json)) {
    let before = JSON.stringify(obj);
    patchTraitOrFlaw(obj, isTrait);
    let after = JSON.stringify(obj);
    if (before !== after) modified = true;
  }
  if (modified) {
    await fs.writeFile(filePath, JSON.stringify(json, null, 2));
    console.log(`Patched and saved ${filePath}`);
  }
}

// Scan nations/<folders> for traits.json, flaws.json
async function processNationFolders() {
  let nationFolders = await fs.readdir(NATIONS_DIR);
  for (const folder of nationFolders) {
    const folderPath = path.join(NATIONS_DIR, folder);
    let stats = await fs.stat(folderPath).catch(() => null);
    if (!stats || !stats.isDirectory()) continue;
    for (const name of ['traits.json', 'flaws.json']) {
      const filePath = path.join(folderPath, name);
      if (await fs.stat(filePath).catch(() => false)) {
        await processFile(filePath, name.startsWith('trait'));
      }
    }
  }
}

// Scan data/ for commonTraits.json, commonFlaws.json
async function processCommonFiles() {
  for (const name of COMMON_FILES) {
    const filePath = path.join(DATA_DIR, name);
    if (await fs.stat(filePath).catch(() => false)) {
      await processFile(filePath, name.includes('Trait'));
    }
  }
}

async function main() {
  await processNationFolders();
  await processCommonFiles();
  console.log('Done!');
}

main();
