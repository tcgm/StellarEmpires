const fs = require('fs');
const path = require('path');

// Usage: node parseFlaws.js inputfile.txt [outputfile.json]
const [,, inputFile, outputFile] = process.argv;

if (!inputFile) {
    console.error('Usage: node parseFlaws.js inputfile.txt [outputfile.json]');
    process.exit(1);
}

const file = fs.readFileSync(inputFile, 'utf-8');

// Split into sections by finding lines ending with "Flaws."
const sections = file.split(/\n(?=[A-Z][^\n]+ Flaws\.)/);

const result = {};

sections.forEach(section => {
    // Extract the section name
    const headerMatch = section.match(/^([A-Z][^\n]+ Flaws)\./);
    if (!headerMatch) return; // skip if can't find section header

    const sectionName = headerMatch[1].trim();

    // Remove the header line from section text
    const body = section.replace(/^([A-Z][^\n]+ Flaws)\.\s*\n?/, '');

    // Find all flaws: lines that start with Title:Description
    // Regex: capture "Title" (before colon), then everything until next Title or section or end
    const regex = /^([^:\n]+):\s*([\s\S]+?)(?=^[^:\n]+:|\n*[A-Z][^\n]+ Flaws\.|\n*$)/gm;

    let flaws = [];
    let match;
    while ((match = regex.exec(body))) {
        const title = match[1].trim();
        const description = match[2].replace(/\s+$/, ' ').replace(/\n+/g, ' ').trim();
        flaws.push({ title, description });
    }

    result[sectionName] = flaws;
});

// Write to output
const outputPath = outputFile
    ? outputFile
    : path.basename(inputFile, path.extname(inputFile)) + '.json';

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Flaws extracted to ${outputPath}`);
