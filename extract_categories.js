const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, 'src', 'data', 'mock.ts');
const content = fs.readFileSync(mockPath, 'utf8');

// Regex to find category values
const regex = /"category":\s*"([^"]+)"/g;
let match;
const categories = new Set();

while ((match = regex.exec(content)) !== null) {
    categories.add(match[1]);
}

console.log("Unique Categories:");
console.log([...categories].sort().join('\n'));
