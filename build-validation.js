const fs = require('fs');
const path = require('path');

const requiredFiles = [
    'index.html',
    'css/styles.css',
    'js/main.js'
];

const validateBuild = () => {
    const distPath = path.join(__dirname, 'dist');
    
    if (!fs.existsSync(distPath)) {
        console.error('Dist directory does not exist');
        process.exit(1);
    }

    let missingFiles = [];
    requiredFiles.forEach(file => {
        const filePath = path.join(distPath, file);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
        }
    });

    if (missingFiles.length > 0) {
        console.error('Missing required files:', missingFiles.join(', '));
        process.exit(1);
    }

    console.log('Build validation successful!');
};

validateBuild(); 