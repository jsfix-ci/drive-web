const fs = require('fs');

if (!process.env.CF_PAGES) process.exit(0);

fs.copyFileSync('.npmrc.template', '.npmrc');
