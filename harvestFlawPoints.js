const fs = require('fs');
const csvParse = require('csv-parse/sync'); // npm install csv-parse

if (process.argv.length !== 5) {
  console.log("Usage: node addFlawCosts.js <flaws.csv> <flaws.json> <output.json>");
  process.exit(1);
}

const [csvFile, jsonFile, outputFile] = process.argv.slice(2);

// Parse CSV
const csvText = fs.readFileSync(csvFile, 'utf8');
const records = csvParse.parse(csvText, { columns: false, skip_empty_lines: true });

// Build a map: flaw title (no trailing colon) -> cost
const flawCostMap = {};
for (let row of records) {
  if (!row[1] || !row[3]) continue;
  let name = row[1].replace(/:$/, '').trim();
  let cost = parseInt(row[3]);
  if (!isNaN(cost)) flawCostMap[name] = cost;
}

// Load flaws JSON (as an array)
const flaws = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// Update each flaw
for (let flaw of flaws) {
  let name = flaw.title.replace(/:$/, '').trim();
  if (flawCostMap.hasOwnProperty(name)) {
    flaw.cost = flawCostMap[name];
  }
}

// Write output
fs.writeFileSync(outputFile, JSON.stringify(flaws, null, 2));
console.log(`Added flaw costs in ${outputFile}`);
