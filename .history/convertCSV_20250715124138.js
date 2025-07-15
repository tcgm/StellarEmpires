const fs = require('fs');
const path = require('path');

// Usage: node traits_to_csv.js inputfile.txt [outputfile.csv]
const [,, inputFile, outputFile] = process.argv;

if (!inputFile) {
    console.error('Usage: node traits_to_csv.js inputfile.txt [outputfile.csv]');
    process.exit(1);
}

const file = fs.readFileSync(inputFile, 'utf-8');

// Split into sections by finding lines ending with "Traits."
const sections = file.split(/\n(?=[A-Z][^\n]+ Traits\.)/);

const rows = [];

sections.forEach(section => {
    // Extract the section name
    const headerMatch = section.match(/^([A-Z][^\n]+ Traits)\./);
    if (!headerMatch) return;

    const sectionName = headerMatch[1].trim();

    // Remove the header line from section text
    const body = section.replace(/^([A-Z][^\n]+ Traits)\.\s*\n?/, '');

    // Find all traits: lines that start with Title:Description
    // Regex: capture "Title" (before colon), then everything until next Title or section or end
    const regex = /^([^:\n]+):\s*([\s\S]+?)(?=^[^:\n]+:|\n*[A-Z][^\n]+ Traits\.|\n*$)/gm;

    let match;
    while ((match = regex.exec(body))) {
        const title = match[1].trim();
        const description = match[2].replace(/\s+$/, ' ').replace(/\n+/g, ' ').trim();
        rows.push({
            section: sectionName,
            title,
            description
        });
    }
});

// CSV header
const header = ['Section', 'Title', 'Description'];

// Function to escape CSV fields
function csvEscape(str) {
    if (typeof str !== 'string') str = '' + str;
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

// Build CSV lines
const csvLines = [header.join(',')];
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

fs.writeFileSync(outPath, csvLines.join('\n'), 'utf-8');
console.log(`Traits exported to ${outPath}`);
