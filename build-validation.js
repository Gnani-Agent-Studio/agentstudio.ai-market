const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'index.html',
    'css/styles.css',
    'js/main.js',
    'images/fallback-image.svg'
];

const validateBuild = () => {
    const distPath = path.join(__dirname, 'dist');
    
    if (!fs.existsSync(distPath)) {
        throw new Error('Dist directory does not exist');
    }

    requiredFiles.forEach(file => {
        const filePath = path.join(distPath, file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Required file missing: ${file}`);
        }
    });

    console.log('Build validation successful!');
};

validateBuild(); 