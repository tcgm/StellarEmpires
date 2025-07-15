const fs = require('fs');
const path = require('path');

// Usage: node nations_traits_to_csv.js nations.json [output.csv]
const [,, inputFile, outputFile] = process.argv;

if (!inputFile) {
    console.error('Usage: node nations_traits_to_csv.js nations.json [output.csv]');
    process.exit(1);
}

// Load JSON
let data;
try {
    data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
} catch (e) {
    console.error('Failed to parse JSON:', e.message);
    process.exit(1);
}

// Prepare CSV lines
const csvLines = [];
csvLines.push(['Nation', 'Type', 'Title', 'Description'].map(s => `"${s}"`).join(','));

function csvEscape(str) {
    if (typeof str !== 'string') str = '' + str;
    return '"' + str.replace(/"/g, '""') + '"';
}

for (const nation of data) {
    for (const trait of nation.traits || []) {
        csvLines.push([
            csvEscape(nation.nation),
            csvEscape('Trait'),
            csvEscape(trait.title),
            csvEscape(trait.description)
        ].join(','));
    }
    for (const flaw of nation.flaws || []) {
        csvLines.push([
            csvEscape(nation.nation),
            csvEscape('Flaw'),
            csvEscape(flaw.title),
            csvEscape(flaw.description)
        ].join(','));
    }
}

// Output path
const outPath = outputFile
    ? outputFile
    : path.basename(inputFile, path.extname(inputFile)) + '.csv';

fs.writeFileSync(outPath, csvLines.join('\r\n'), 'utf-8');
console.log(`Exported nations/traits/flaws to ${outPath}`);
