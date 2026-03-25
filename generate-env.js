const fs = require('fs');

const apiKey = process.env.DEEPSEEK_API_KEY || '';
const content = `window.__MEDILAB_ENV__ = {
    deepseek_api_key: '${apiKey}'
};`;

fs.writeFileSync('env.js', content);
console.log('env.js generated successfully');
