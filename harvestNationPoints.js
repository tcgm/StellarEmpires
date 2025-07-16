const fs = require('fs');
const csvParse = require('csv-parse/sync'); // npm install csv-parse

if (process.argv.length !== 5) {
  console.log("Usage: node addNationTraitFlawCosts.js <nations.json> <nation_traits.csv> <nation_flaws.csv>");
  process.exit(1);
}

const [nationsFile, traitsCsvFile, flawsCsvFile] = process.argv.slice(2);

// Utility to build map from CSV (title -> cost)
function buildCostMap(csvFile) {
  const csvText = fs.readFileSync(csvFile, 'utf8');
  const records = csvParse.parse(csvText, { columns: false, skip_empty_lines: true });
  const map = {};
  for (let row of records) {
    if (!row[1] || !row[3]) continue;
    let title = row[1].replace(/:$/, '').trim();
    let cost = parseInt(row[3]);
    if (!isNaN(cost)) map[title] = cost;
  }
  return map;
}

// Build maps for traits and flaws
const traitCostMap = buildCostMap(traitsCsvFile);
const flawCostMap = buildCostMap(flawsCsvFile);

// Load nations JSON
const nations = JSON.parse(fs.readFileSync(nationsFile, 'utf8'));

// Update traits/flaws for each nation
for (const nation of nations) {
  if (Array.isArray(nation.traits)) {
    for (const trait of nation.traits) {
      let title = trait.title.replace(/:$/, '').trim();
      if (traitCostMap.hasOwnProperty(title)) {
        trait.cost = traitCostMap[title];
      }
    }
  }
  if (Array.isArray(nation.flaws)) {
    for (const flaw of nation.flaws) {
      let title = flaw.title.replace(/:$/, '').trim();
      if (flawCostMap.hasOwnProperty(title)) {
        flaw.cost = flawCostMap[title];
      }
    }
  }
}

// Write result
fs.writeFileSync('nations_with_costs.json', JSON.stringify(nations, null, 2));
console.log("Added trait/flaw costs to nations_with_costs.json");
