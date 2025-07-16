const fs = require('fs');
const path = require('path');

// Helper: sanitize folder names for filesystem safety
function sanitizeName(name) {
    return name.replace(/[^a-z0-9\-_\(\)\[\] ]/gi, '_');
}

// Usage: node splitNations.js input.json output_dir
if (process.argv.length < 4) {
    console.error('Usage: node splitNations.js input.json output_dir');
    process.exit(1);
}

const [,, inputPath, outputDir] = process.argv;

// Read and parse the input file
let nations;
try {
    const jsonText = fs.readFileSync(inputPath, 'utf-8');
    nations = JSON.parse(jsonText);
} catch (e) {
    console.error('Failed to read or parse JSON:', e.message);
    process.exit(1);
}

// Create output directory if missing
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

for (const nation of nations) {
    if (!nation.nation) {
        console.warn('Skipping entry with no nation name:', nation);
        continue;
    }
    const safeName = sanitizeName(nation.nation);
    const nationDir = path.join(outputDir, safeName);

    if (!fs.existsSync(nationDir)) {
        fs.mkdirSync(nationDir, { recursive: true });
    }

    // Write nation.json
    fs.writeFileSync(
        path.join(nationDir, 'nation.json'),
        JSON.stringify({ nation: nation.nation }, null, 2),
        'utf-8'
    );

    // Write traits.json
    fs.writeFileSync(
        path.join(nationDir, 'traits.json'),
        JSON.stringify(nation.traits || [], null, 2),
        'utf-8'
    );

    // Write flaws.json
    fs.writeFileSync(
        path.join(nationDir, 'flaws.json'),
        JSON.stringify(nation.flaws || [], null, 2),
        'utf-8'
    );

    console.log(`Wrote nation: ${nation.nation} (${nationDir})`);
}

console.log('Done!');
