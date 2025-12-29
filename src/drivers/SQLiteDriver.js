/**
 * SQLite Database Driver Implementation
 * Provides synchronous-style API over async sqlite3 driver
 */
const sqlite3 = require('sqlite3').verbose();
const deasync = require('deasync');
const DatabaseDriver = require('./DatabaseDriver');

class SQLiteDriver extends DatabaseDriver {
  constructor(dbPath) {
    super();
    this.dbPath = dbPath;
    this.db = null;
    this.initialized = false;
  }

  /**
   * Initialize database connection
   */
  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`✓ SQLite connected to ${this.dbPath}`);
          this.db.run('PRAGMA foreign_keys = ON');
          this.initialized = true;
          resolve();
        }
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Async wrapper for db.run() - INSERT/UPDATE/DELETE
   * Returns promise that resolves with { lastInsertRowid, changes }
   */
  runAsync(sql, params = []) {
    if (!this.db) {
      return Promise.reject(new Error('Database not initialized'));
    }

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            lastInsertRowid: this ? this.lastID : null,
            changes: this ? this.changes : 0
          });
        }
      });
    });
  }

  /**
   * Synchronous-style wrapper for db.run() - INSERT/UPDATE/DELETE
   * Uses deasync. For better performance, prefer runAsync().
   */
  run(sql, params = []) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    let done = false;
    let error = null;
    let lastInsertRowid = null;
    let changes = 0;

    this.db.run(sql, params, function(err) {
      error = err;
      lastInsertRowid = this ? this.lastID : null;
      changes = this ? this.changes : 0;
      done = true;
    });

    // Use deasync to properly wait for callback
    deasync.loopWhile(() => !done);

    if (error) {
      throw error;
    }
    return { lastInsertRowid, changes };
  }

  /**
   * Synchronous wrapper for db.get() - SELECT single row
   */
  get(sql, params = []) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    let done = false;
    let error = null;
    let row = null;

    this.db.get(sql, params, (err, data) => {
      error = err;
      row = data;
      done = true;
    });

    // Use deasync to properly wait for callback
    deasync.loopWhile(() => !done);

    if (error) {
      throw error;
    }

    return row;
  }

  /**
   * Synchronous wrapper for db.all() - SELECT all rows
   */
  all(sql, params = []) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    let done = false;
    let error = null;
    let rows = [];

    this.db.all(sql, params, (err, data) => {
      error = err;
      rows = data || [];
      done = true;
    });

    // Use deasync to properly wait for callback
    deasync.loopWhile(() => !done);

    if (error) {
      throw error;
    }
    return rows;
  }

  /**
   * Prepare a statement for reuse
   */
  prepare(sql) {
    const driver = this;
    return {
      run: function(...args) {
        return driver.run(sql, args);
      },
      get: function(...args) {
        return driver.get(sql, args);
      },
      all: function(...args) {
        return driver.all(sql, args);
      }
    };
  }

  /**
   * Execute multiple SQL statements
   */
  async exec(sql) {
    return new Promise((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Begin transaction
   */
  beginTransaction() {
    this.run('BEGIN TRANSACTION');
  }

  /**
   * Commit transaction
   */
  commit() {
    this.run('COMMIT');
  }

  /**
   * Rollback transaction
   */
  rollback() {
    this.run('ROLLBACK');
  }

  /**
   * Get raw database instance for direct access
   */
  getRawDb() {
    return this.db;
  }
}

module.exports = SQLiteDriver;
