
const fs = require('fs');
const files = JSON.parse(fs.readFileSync('catalog_files.json', 'utf8'));
const targets = ['0.5520', '0.5971', '0.7423'];

console.log('Checking for YAMA targets...');
targets.forEach(t => {
    const found = files.find(f => f.includes(t));
    if (found) {
        console.log(`FOUND ${t} -> ${found}`);
    } else {
        console.log(`NOT FOUND ${t}`);
    }
});
