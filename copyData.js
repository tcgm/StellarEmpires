// copy-data.js
const fs = require('fs-extra');
const path = require('path');

const srcDir = path.resolve(__dirname, 'data');
const destDir = path.resolve(__dirname, 'stellar-empires', 'src', 'data');

function jsonOnlyFilter(src, dest) {
  const rel = path.relative(srcDir, src);
  // Always copy directories
  if (rel === "" || fs.statSync(src).isDirectory()) return true;
  // Copy only .json files
  return src.endsWith('.json');
}

async function copyData() {
  await fs.ensureDir(destDir);
  await fs.copy(srcDir, destDir, {
    overwrite: true,
    filter: jsonOnlyFilter,
  });
  console.log(`Copied JSON files and folders from ${srcDir} to ${destDir}`);
}

module.exports = copyData;

if (require.main === module) {
  copyData().catch(err => {
    console.error('Failed to copy data:', err);
    process.exit(1);
  });
}
