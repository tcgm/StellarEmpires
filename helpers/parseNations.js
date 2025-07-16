const fs = require('fs');
const path = require('path');

// Usage: node nation_traits_flaws_parser.js input.txt [output.json]
const [,, inputFile, outputFile] = process.argv;

if (!inputFile) {
    console.error('Usage: node nation_traits_flaws_parser.js input.txt [output.json]');
    process.exit(1);
}

const raw = fs.readFileSync(inputFile, 'utf-8').replace(/\r/g, ''); // Normalize newlines
const lines = raw.split('\n');

const nationHeaderRegex = /^([A-Z][^\n:]+):\s*$/;
const traitHeader = "Nation Type Traits:";
const flawHeader = "Nation Type Flaws:";

// Helper: Collect entries until next section or next nation
function collectEntries(startIdx, lines) {
    let entries = [];
    let currTitle = null;
    let currDesc = [];
    for (let i = startIdx; i < lines.length; ++i) {
        const line = lines[i];
        // If at next section header or nation header, stop!
        if (
            nationHeaderRegex.test(line) && ![traitHeader, flawHeader].includes(line.trim())
        ) break;
        if ([traitHeader, flawHeader].includes(line.trim())) break;
        // New trait/flaw line with colon
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0 && /^[^:]+:[ \t]/.test(line)) {
            if (currTitle) {
                entries.push({
                    title: currTitle.trim(),
                    description: currDesc.join(' ').replace(/\s+/g, ' ').trim()
                });
            }
            currTitle = line.slice(0, colonIdx).trim();
            currDesc = [line.slice(colonIdx + 1).trim()];
        } else if (line.trim() !== '') {
            // Description line continues
            if (currTitle) currDesc.push(line.trim());
        }
    }
    if (currTitle) {
        entries.push({
            title: currTitle.trim(),
            description: currDesc.join(' ').replace(/\s+/g, ' ').trim()
        });
    }
    return entries;
}

let nations = [];
let i = 0;
while (i < lines.length) {
    // Find next nation
    while (
        i < lines.length &&
        (
            !nationHeaderRegex.test(lines[i]) ||
            [traitHeader, flawHeader].includes(lines[i].trim())
        )
    ) i++;
    if (i >= lines.length) break;

    // Found a nation
    const nationName = lines[i].replace(':', '').trim();
    i++;
    let traits = [];
    let flaws = [];
    // Look for sections within this nation until next nation or end
    while (i < lines.length) {
        // If next nation, break
        if (
            nationHeaderRegex.test(lines[i]) &&
            ![traitHeader, flawHeader].includes(lines[i].trim())
        ) break;
        if (lines[i].trim() === traitHeader) {
            traits = collectEntries(i + 1, lines);
        }
        if (lines[i].trim() === flawHeader) {
            flaws = collectEntries(i + 1, lines);
        }
        i++;
    }
    nations.push({ nation: nationName, traits, flaws });
}

const outPath = outputFile
    ? outputFile
    : path.basename(inputFile, path.extname(inputFile)) + '.json';

fs.writeFileSync(outPath, JSON.stringify(nations, null, 2));
console.log(`Exported nations/traits/flaws to ${outPath}`);
