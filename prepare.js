// prepare.js
const copyData = require('./copyData');

// In the future, add more prep steps here (await cleanDirs(), generateConfig(), etc.)

async function main() {
  await copyData();
  // await otherPrepScript(); // Add more steps as needed
}

main().catch(err => {
  console.error('Prep script failed:', err);
  process.exit(1);
});
