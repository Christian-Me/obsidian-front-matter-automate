const fs = require('fs');
const path = require('path');

const DOCS_DIR = './doc';
const GITHUB_BASE = 'https://raw.githubusercontent.com/Christian-Me/obsidian-front-matter-automate/main/doc/';

function processFile(filePath, relativePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace [text](filename.md) with [text](full-url)
  content = content.replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, (match, text, link) => {
    // Only replace if link is not already absolute
    if (!/^https?:\/\//.test(link)) {
      // Resolve the link relative to the current file's directory
      const resolved = path.normalize(path.join(path.dirname(relativePath), link)).replace(/\\/g, '/');
      return `[${text}](${GITHUB_BASE}${resolved})`;
    }
    return match;
  });
  fs.writeFileSync(filePath, content, 'utf8');
}

function processDir(dir, relativeDir = '') {
  fs.readdirSync(dir).forEach(entry => {
    const fullPath = path.join(dir, entry);
    const relPath = path.join(relativeDir, entry);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath, relPath);
    } else if (entry.endsWith('.md')) {
      processFile(fullPath, relPath);
    }
  });
}

processDir(DOCS_DIR);