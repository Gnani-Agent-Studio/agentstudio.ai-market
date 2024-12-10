const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Copy all HTML files
fs.readdirSync('.').forEach(file => {
    if (file.endsWith('.html')) {
        fs.copyFileSync(file, path.join('dist', file));
    }
});

// Copy directories
['css', 'js', 'images'].forEach(dir => {
    if (fs.existsSync(dir)) {
        fs.cpSync(dir, path.join('dist', dir), { recursive: true });
    }
});

console.log('Build completed successfully!'); 