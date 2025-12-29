#!/usr/bin/env node

/**
 * Pre-commit Quality Check
 * Run before committing to ensure code quality
 */

const { execSync } = require('child_process');
const fs = require('fs');

function run(cmd, description) {
  try {
    console.log(`\n▶ ${description}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ ${description} passed`);
    return true;
  } catch (error) {
    console.error(`✗ ${description} failed`);
    return false;
  }
}

console.log('\n========== PRE-COMMIT QUALITY CHECK ==========\n');

let allPassed = true;

// 1. ESLint
if (!run('npm run lint', 'ESLint check')) {
  console.log('\nTip: Run "npm run lint:fix" to auto-fix eslint issues');
  allPassed = false;
}

// 2. Tests
if (!run('npm test', 'Unit tests')) {
  allPassed = false;
}

if (allPassed) {
  console.log('\n✓ All pre-commit checks passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some checks failed. Please fix them before committing.');
  process.exit(1);
}
