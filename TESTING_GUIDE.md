# Testing & Code Quality Guide

## Overview

This project includes comprehensive testing and code quality verification tools:

- **ESLint**: Code quality and style enforcement
- **Jest**: Unit testing framework
- **Automated Verification**: Complete project validation script

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Check Code Quality
```bash
npm run lint
```

### Auto-fix Code Issues
```bash
npm run lint:fix
```

### Generate Coverage Report
```bash
npm run test:coverage
```

### Run Full Verification
```bash
npm run verify
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with nodemon |
| `npm run lint` | Check code quality with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm test` | Run Jest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run verify` | Run full project verification |
| `npm run pre-commit` | Pre-commit quality checks |

## ESLint Rules

The project enforces these key rules:

- ✓ Consistent code style (indentation, spacing, quotes)
- ✓ No unused variables
- ✓ Strict equality (`===` instead of `==`)
- ✓ Const/let preference
- ✓ Template literals encouraged
- ✓ Proper function formatting

To see all rules, check `.eslintrc.json`.

## Unit Testing

### Test Structure
```
tests/
├── setup.js              # Jest configuration
├── models/               # Model tests
│   ├── AdminUser.test.js
│   └── Topic.test.js
├── drivers/              # Driver tests
│   └── DatabaseDriver.test.js
└── ...
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- AdminUser.test.js

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Coverage Thresholds

Current thresholds (in jest.config.js):
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

## Automated Verification

The `npm run verify` command performs complete validation:

1. ✓ File structure check
2. ✓ Critical files verification
3. ✓ ESLint code quality
4. ✓ Unit tests
5. ✓ Coverage report
6. ✓ Dependencies check
7. ✓ Model structure validation
8. ✓ Security configuration

### Example Output
```
████████████████████████████████████████████████████████████████████████████████
        FLASHCARD ADMIN BACKEND - CODE QUALITY & TEST VERIFICATION
████████████████████████████████████████████████████████████████████████████████

================================================================================
1. FILE STRUCTURE CHECK
================================================================================

✓ Directory exists: src/config
✓ Directory exists: src/models
...

✓ ALL CHECKS PASSED! Project is ready.
```

## Pre-commit Hook

Before committing code, run:
```bash
npm run pre-commit
```

This checks:
- ESLint compliance
- Unit tests pass

## Writing Tests

### Model Test Example
```javascript
const ModelName = require('../../src/models/ModelName');
const { initializeDatabase, closeDatabase } = require('../../src/config/database');

describe('ModelName', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should create instance', () => {
    const instance = ModelName.create(...);
    expect(instance).toBeDefined();
  });
});
```

## CI/CD Integration

For CI/CD pipelines, use:
```bash
# Full validation
npm run verify

# Or individual commands
npm run lint
npm test -- --coverage
```

## Troubleshooting

### ESLint Issues
```bash
# View all issues
npm run lint

# Auto-fix fixable issues
npm run lint:fix

# Manually fix remaining issues
```

### Test Failures
```bash
# Run tests with verbose output
npm test -- --verbose

# Run single test with debugging
npm test -- AdminUser.test.js --verbose
```

### Coverage Issues
```bash
# Generate detailed coverage report
npm run test:coverage

# Check coverage/lcov-report/index.html for details
```

## Project Structure Validation

The verification script checks:

✓ All required directories exist
✓ All critical files present
✓ Driver abstraction pattern implemented
✓ Dependencies configured correctly
✓ Tests pass with sufficient coverage
✓ Code follows ESLint standards
✓ Security configurations in place

## Next Steps

1. **Setup**: Run `npm install` to install dependencies
2. **Verify**: Run `npm run verify` to validate project
3. **Test**: Run `npm test` to check unit tests
4. **Fix Issues**: Run `npm run lint:fix` to auto-fix code issues
5. **Commit**: Run `npm run pre-commit` before git commit

## Resources

- [ESLint Documentation](https://eslint.org/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](./TESTING_BEST_PRACTICES.md)
