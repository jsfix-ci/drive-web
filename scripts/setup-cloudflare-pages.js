const fs = require('fs');

if (!process.env.CF_PAGES) process.exit(0);

const fileContent = fs.readFileSync('.npmrc.template', { encoding: 'utf-8' });

const fileToWrite = fileContent.replace('${NPM_TOKEN}', process.env.NPM_TOKEN);

fs.writeFileSync('.npmrc', fileToWrite);
