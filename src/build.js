// scripts/build.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

async function buildParser() {
  console.log('Building parser from PEG.js grammar...');
  
  try {
    // Generate parser from .pegjs file
    await execAsync('npx pegjs --format commonjs -o src/parser.js src/unicodemathml-parser.pegjs');
    console.log('✓ Parser generated successfully');
    
    // Verify the generated parser works
    const parser = require('../src/parser.js');
    const testResult = parser.parse('x^2');
    console.log('✓ Parser test passed');
    
  } catch (error) {
    console.error('✗ Parser generation failed:', error.message);
    process.exit(1);
  }
}

async function copyGrammarFile() {
  // Copy the original .pegjs file to src/ if it's not there
  const sourcePath = path.join(__dirname, '../unicodemathml-parser.pegjs');
  const destPath = path.join(__dirname, '../src/unicodemathml-parser.pegjs');
  
  if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
    console.log('Copying grammar file to src/...');
    fs.copyFileSync(sourcePath, destPath);
    console.log('✓ Grammar file copied');
  }
}

async function main() {
  console.log('Building UnicodeMathML Node.js module...\n');
  
  await copyGrammarFile();
  await buildParser();
  
  console.log('\n✓ Build completed successfully');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { buildParser, copyGrammarFile };