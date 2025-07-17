// prepare.js
const path = require('path');

const makeNationList = require('./listNations');
//const copyData = require('./copyData');
const buildData = require('./buildData');   // <- ADD THIS LINE

// In the future, add more prep steps here (await cleanDirs(), generateConfig(), etc.)

const srcDir = path.resolve(__dirname, 'data');
const nationsDir = path.resolve(__dirname, 'data', 'nations');

async function main() {
  await makeNationList(nationsDir);
  // await copyData();
  await buildData();
  // await otherPrepScript(); // Add more steps as needed
}

main().catch(err => {
  console.error('Prep script failed:', err);
  process.exit(1);
});
