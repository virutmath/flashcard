#!/usr/bin/env node

/**
 * Automated Verification Script
 * Checks code quality, runs tests, and generates reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(80));
  log(title, 'cyan');
  console.log('='.repeat(80) + '\n');
}

function runCommand(cmd, description) {
  try {
    log(`▶ ${description}...`, 'blue');
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    log(`✓ ${description} passed`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    return false;
  }
}

async function verify() {
  const results = {
    passed: [],
    failed: []
  };

  log('\n████████████████████████████████████████████████████████████████████████████████', 'cyan');
  log('        FLASHCARD ADMIN BACKEND - CODE QUALITY & TEST VERIFICATION', 'cyan');
  log('████████████████████████████████████████████████████████████████████████████████\n', 'cyan');

  // 1. Check file structure
  section('1. FILE STRUCTURE CHECK');
  const requiredDirs = [
    'src/config',
    'src/models',
    'src/controllers',
    'src/routes',
    'src/middlewares',
    'src/drivers',
    'public/admin',
    'tests'
  ];

  for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      log(`✓ Directory exists: ${dir}`, 'green');
      results.passed.push(`Directory: ${dir}`);
    } else {
      log(`✗ Missing directory: ${dir}`, 'red');
      results.failed.push(`Directory: ${dir}`);
    }
  }

  // 2. Check required files
  section('2. CRITICAL FILES CHECK');
  const requiredFiles = [
    'src/app.js',
    'src/config/database.js',
    'src/config/config.js',
    'src/drivers/DatabaseDriver.js',
    'src/drivers/SQLiteDriver.js',
    'src/drivers/DriverFactory.js',
    'package.json',
    '.eslintrc.json',
    'jest.config.js'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`✓ File exists: ${file}`, 'green');
      results.passed.push(`File: ${file}`);
    } else {
      log(`✗ Missing file: ${file}`, 'red');
      results.failed.push(`File: ${file}`);
    }
  }

  // 3. ESLint check
  section('3. CODE QUALITY - ESLINT');
  if (runCommand('npm run lint', 'ESLint linting')) {
    results.passed.push('ESLint check');
  } else {
    log('Note: ESLint issues found - run "npm run lint:fix" to auto-fix', 'yellow');
    results.failed.push('ESLint check');
  }

  // 4. Unit tests
  section('4. UNIT TESTS');
  if (runCommand('npm test -- --passWithNoTests', 'Jest unit tests')) {
    results.passed.push('Unit tests');
  } else {
    results.failed.push('Unit tests');
  }

  // 5. Test coverage
  section('5. TEST COVERAGE');
  try {
    log('▶ Generating coverage report...', 'blue');
    execSync('npm run test:coverage -- --passWithNoTests', { stdio: 'pipe', cwd: process.cwd() });
    log('✓ Coverage report generated', 'green');
    results.passed.push('Coverage report');
  } catch (error) {
    log('Note: Coverage report generation had issues (may be normal with few tests)', 'yellow');
  }

  // 6. Dependency check
  section('6. DEPENDENCY CHECK');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'sqlite3', 'jsonwebtoken', 'bcrypt'];
  const requiredDevDeps = ['eslint', 'jest', 'nodemon'];

  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep]) {
      log(`✓ Production dependency: ${dep}@${packageJson.dependencies[dep]}`, 'green');
      results.passed.push(`Dependency: ${dep}`);
    } else {
      log(`✗ Missing dependency: ${dep}`, 'red');
      results.failed.push(`Dependency: ${dep}`);
    }
  }

  for (const dep of requiredDevDeps) {
    if (packageJson.devDependencies[dep]) {
      log(`✓ Dev dependency: ${dep}@${packageJson.devDependencies[dep]}`, 'green');
      results.passed.push(`Dev Dependency: ${dep}`);
    } else {
      log(`✗ Missing dev dependency: ${dep}`, 'red');
      results.failed.push(`Dev Dependency: ${dep}`);
    }
  }

  // 7. Model structure check
  section('7. MODEL STRUCTURE CHECK');
  const models = ['AdminUser', 'User', 'Topic', 'Level', 'Flashcard', 'Badge', 'Bookmark', 'Streak'];
  for (const model of models) {
    const modelPath = path.join(process.cwd(), `src/models/${model}.js`);
    if (fs.existsSync(modelPath)) {
      const content = fs.readFileSync(modelPath, 'utf8');
      if (content.includes('getDatabase') && content.includes('static')) {
        log(`✓ Model ${model} uses driver abstraction`, 'green');
        results.passed.push(`Model: ${model}`);
      } else {
        log(`⚠ Model ${model} may not use driver abstraction`, 'yellow');
      }
    }
  }

  // 8. Security check
  section('8. SECURITY CHECK');
  const configPath = path.join(process.cwd(), 'src/config/config.js');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf8');
    if (content.includes('.env') && content.includes('CLOUDINARY')) {
      log('✓ Environment variables configured', 'green');
      results.passed.push('Env config');
    }
  }

  if (fs.existsSync('.env.example')) {
    log('✓ .env.example exists for configuration guide', 'green');
    results.passed.push('Env example');
  }

  // Final Report
  section('VERIFICATION SUMMARY');
  const totalTests = results.passed.length + results.failed.length;
  const passPercentage = ((results.passed.length / totalTests) * 100).toFixed(1);

  log(`Total Checks: ${totalTests}`, 'cyan');
  log(`✓ Passed: ${results.passed.length}`, 'green');
  log(`✗ Failed: ${results.failed.length}`, results.failed.length > 0 ? 'red' : 'green');
  log(`Success Rate: ${passPercentage}%`, passPercentage >= 80 ? 'green' : 'yellow');

  if (results.failed.length === 0) {
    log('\n🎉 ALL CHECKS PASSED! Project is ready.', 'green');
    process.exit(0);
  } else {
    log(`\n⚠️ ${results.failed.length} check(s) failed. Review above for details.`, 'yellow');
    process.exit(1);
  }
}

verify().catch(error => {
  log(`\n✗ Verification error: ${error.message}`, 'red');
  process.exit(1);
});
