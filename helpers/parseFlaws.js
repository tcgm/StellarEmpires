const fs = require('fs');
const path = require('path');

// Usage: node parseFlawsSimple.js flaws.txt [output.json]
const [,, inputFile, outputFile] = process.argv;

if (!inputFile) {
    console.error('Usage: node parseFlawsSimple.js flaws.txt [output.json]');
    process.exit(1);
}

const file = fs.readFileSync(inputFile, 'utf-8');

// The section name is the first non-empty line (e.g., "Common Flaws")
const lines = file.split('\n').map(l => l.trim());
const sectionName = lines.find(l => l.length > 0);

// Flaw matcher: Title: Description (until next Title or end)
const flaws = [];
const body = file.replace(sectionName, '').trim();
const regex = /^([^:\n]+):\s*([\s\S]+?)(?=^[^:\n]+:|\n*$)/gm;
let match;
while ((match = regex.exec(body))) {
    const title = match[1].trim();
    const description = match[2].replace(/\s+$/, '').replace(/\n+/g, ' ').trim();
    flaws.push({ title, description });
}

// Result is just the array, but you could also output { [sectionName]: flaws }
const result = flaws;

// Write to output file
const outPath = outputFile
    ? outputFile
    : path.basename(inputFile, path.extname(inputFile)) + '.json';

fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
console.log(`Flaws extracted to ${outPath}`);
