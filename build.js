const fs = require('fs');
const path = require('path');

const distDir = 'dist';

// Ensure dist directory exists
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Helper to copy file
function copyFile(src, dest) {
    fs.copyFileSync(src, dest);
}

// Helper to copy directory
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFile(srcPath, destPath);
        }
    }
}

// Copy HTML files
const files = fs.readdirSync('.');
files.forEach(file => {
    if (file.endsWith('.html')) {
        copyFile(file, path.join(distDir, file));
    }
});

// Copy JS files
copyFile('main.js', path.join(distDir, 'main.js'));

// Copy directories
if (fs.existsSync('resources')) copyDir('resources', path.join(distDir, 'resources'));
if (fs.existsSync('data')) copyDir('data', path.join(distDir, 'data'));

// Generate env.js in dist
const apiKey = process.env.DEEPSEEK_API_KEY || '';
const envContent = `window.__MEDILAB_ENV__ = {
    deepseek_api_key: '${apiKey}'
};`;

fs.writeFileSync(path.join(distDir, 'env.js'), envContent);

console.log('Build completed! Files copied to dist/ and env.js generated.');
