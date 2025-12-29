/**
 * Unit tests for database driver abstraction
 */
const DriverFactory = require('../../src/drivers/DriverFactory');
const { initializeDatabase, closeDatabase } = require('../../src/config/database');

describe('Database Driver Abstraction', () => {
  beforeAll(async () => {
    process.env.DB_TYPE = 'sqlite3';
    process.env.DB_PATH = ':memory:';
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('DriverFactory', () => {
    it('should return SQLiteDriver instance', () => {
      const driver = DriverFactory.getInstance();
      expect(driver).toBeDefined();
    });

    it('should return driver type', () => {
      const type = DriverFactory.getDriverType();
      expect(type.toLowerCase()).toBe('sqlite3');
    });

    it('should initialize database', async () => {
      const db = await DriverFactory.initialize();
      expect(db).toBeDefined();
    });
  });

  describe('Database Operations', () => {
    beforeAll(async () => {
      await initializeDatabase();
    });

    it('should execute prepare and run', () => {
      const { getDatabase } = require('../../src/config/database');
      const db = getDatabase();
      
      // Create test table
      db.run(`CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY,
        name TEXT
      )`);

      // Insert data
      const result = db.prepare('INSERT INTO test_table (name) VALUES (?)').run('test');
      expect(result.lastInsertRowid).toBeGreaterThan(0);
    });

    it('should execute prepare and get', () => {
      const { getDatabase } = require('../../src/config/database');
      const db = getDatabase();
      
      db.prepare('INSERT INTO test_table (name) VALUES (?)').run('testget');
      const row = db.prepare('SELECT * FROM test_table WHERE name = ?').get('testget');
      expect(row).toBeDefined();
      expect(row.name).toBe('testget');
    });

    it('should execute prepare and all', () => {
      const { getDatabase } = require('../../src/config/database');
      const db = getDatabase();
      
      db.prepare('INSERT INTO test_table (name) VALUES (?)').run('item1');
      db.prepare('INSERT INTO test_table (name) VALUES (?)').run('item2');
      const rows = db.prepare('SELECT * FROM test_table').all();
      expect(Array.isArray(rows)).toBe(true);
      expect(rows.length).toBeGreaterThanOrEqual(2);
    });
  });
});
