const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse/sync'); // install with `npm install csv-parse`

if (process.argv.length !== 5) {
  console.log("Usage: node addTraitCosts.js <traits.csv> <traits.json> <output.json>");
  process.exit(1);
}

const [csvFile, jsonFile, outputFile] = process.argv.slice(2);

// Load and parse CSV
const csvText = fs.readFileSync(csvFile, 'utf8');
const records = csvParse.parse(csvText, { columns: false, skip_empty_lines: true });

// Build a map of trait title (trimmed, no colon) -> cost
const traitCostMap = {};
for (let row of records) {
  // Row example: ['', 'Implausibly Efficient Government', 'desc', '1']
  if (!row[1] || !row[3]) continue; // skip headers or blanks
  let title = row[1].replace(/:$/, '').trim();
  let cost = parseInt(row[3]);
  if (!isNaN(cost)) traitCostMap[title] = cost;
}

// Load JSON
const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// For each trait, add cost if found
for (let section of Object.keys(json)) {
  for (let trait of json[section]) {
    // Remove trailing colon, just in case
    let cleanTitle = trait.title.replace(/:$/, '').trim();
    if (traitCostMap.hasOwnProperty(cleanTitle)) {
      trait.points = traitCostMap[cleanTitle];
    }
  }
}

// Write new JSON
fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
console.log(`Updated trait costs written to ${outputFile}`);
