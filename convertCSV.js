const fs = require('fs');
const path = require('path');

// Usage: node json_traits_to_google_csv.js traits.json [output.csv]
const [,, inputFile, outputFile] = process.argv;

if (!inputFile) {
    console.error('Usage: node json_traits_to_google_csv.js traits.json [output.csv]');
    process.exit(1);
}

const raw = fs.readFileSync(inputFile, 'utf-8');
let data;
try {
    data = JSON.parse(raw);
} catch (e) {
    console.error('Failed to parse JSON:', e.message);
    process.exit(1);
}

const rows = [];
for (const section in data) {
    const traits = data[section];
    if (!Array.isArray(traits)) continue;
    for (const obj of traits) {
        rows.push({
            section,
            title: obj.title || '',
            description: obj.description || ''
        });
    }
}

// CSV header
const header = ['Section', 'Title', 'Description'];

// CSV escape: quote everything
function csvEscape(str) {
    if (typeof str !== 'string') str = '' + str;
    return '"' + str.replace(/"/g, '""') + '"';
}

const csvLines = [header.map(csvEscape).join(',')];
for (const row of rows) {
    csvLines.push([
        csvEscape(row.section),
        csvEscape(row.title),
        csvEscape(row.description)
    ].join(','));
}

const outPath = outputFile
    ? outputFile
    : path.basename(inputFile, path.extname(inputFile)) + '.csv';

fs.writeFileSync(outPath, csvLines.join('\r\n'), 'utf-8');
console.log(`Traits exported to ${outPath}`);
