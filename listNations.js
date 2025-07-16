// listNations.js
const fs = require('fs');
const path = require('path');

/**
 * Generates a list.json file with all nation folder names that have a nation.json file.
 * @param {string} nationsDir - Absolute path to src/data/nations
 */
module.exports = async function makeNationList(nationsDir) {
  const listFilePath = path.resolve(nationsDir, 'nationList.json');

  // Ensure public/nations exists
  fs.mkdirSync(nationsDir, { recursive: true });

  // Read all folders in nationsDir
  const folders = fs.readdirSync(nationsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Only include folders that have nation.json
  const validNations = folders.filter(folder => {
    const nationJson = path.join(nationsDir, folder, 'nation.json');
    return fs.existsSync(nationJson);
  });

  // Write the array to list.json
  fs.writeFileSync(listFilePath, JSON.stringify(validNations, null, 2));
  console.log(`Generated ${listFilePath}:`, validNations);
}
