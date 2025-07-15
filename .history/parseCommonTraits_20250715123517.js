const fs = require('fs');

const file = fs.readFileSync('traits.txt', 'utf-8');

// Split into sections by finding lines ending with "Traits."
const sections = file.split(/\n(?=[A-Z][^\n]+ Traits\.)/);

const result = {};

sections.forEach(section => {
    // Extract the section name
    const headerMatch = section.match(/^([A-Z][^\n]+ Traits)\./);
    if (!headerMatch) return; // skip if can't find section header

    const sectionName = headerMatch[1].trim();

    // Remove the header line from section text
    const body = section.replace(/^([A-Z][^\n]+ Traits)\.\s*\n?/, '');

    // Find all traits: lines that start with Title:Description
    // Regex: capture "Title" (before colon), then everything until next Title or section or end
    const regex = /^([^:\n]+):\s*([\s\S]+?)(?=^[^:\n]+:|\n*[A-Z][^\n]+ Traits\.|\n*$)/gm;

    let traits = [];
    let match;
    while ((match = regex.exec(body))) {
        const title = match[1].trim();
        const description = match[2].replace(/\s+$/, '').replace(/\n+/g, ' ').trim();
        traits.push({ title, description });
    }

    result[sectionName] = traits;
});

// Write to traits.json
fs.writeFileSync('traits.json', JSON.stringify(result, null, 2));
console.log('Traits extracted to traits.json');
