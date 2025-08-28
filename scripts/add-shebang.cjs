#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'build', 'index.js');

if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Check if shebang already exists
  if (!content.startsWith('#!/usr/bin/env node')) {
    const newContent = '#!/usr/bin/env node\n' + content;
    fs.writeFileSync(indexPath, newContent, 'utf8');
    console.log('Added shebang to build/index.js');
  } else {
    console.log('Shebang already exists in build/index.js');
  }
} else {
  console.error('build/index.js not found');
  process.exit(1);
}