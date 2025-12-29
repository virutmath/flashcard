/**
 * Database Driver Factory
 * Manages database driver instances and configuration
 */
const SQLiteDriver = require('./SQLiteDriver');
const path = require('path');

class DriverFactory {
  static instance = null;
  static driverType = process.env.DB_TYPE || 'sqlite3';
  static driverInstance = null;

  /**
   * Get or create database driver instance
   * @returns {DatabaseDriver}
   */
  static getInstance() {
    if (this.driverInstance) {
      return this.driverInstance;
    }

    const driverType = this.driverType.toLowerCase();

    if (driverType === 'sqlite3' || driverType === 'sqlite') {
      const dbPath = process.env.DB_PATH || path.resolve('./data/flashcard.db');
      this.driverInstance = new SQLiteDriver(dbPath);
    } else if (driverType === 'postgres') {
      throw new Error('PostgreSQL driver not yet implemented');
    } else if (driverType === 'mysql') {
      throw new Error('MySQL driver not yet implemented');
    } else {
      throw new Error(`Unknown database driver: ${driverType}`);
    }

    return this.driverInstance;
  }

  /**
   * Initialize driver
   * @returns {Promise<void>}
   */
  static async initialize() {
    const driver = this.getInstance();
    await driver.init();
    return driver;
  }

  /**
   * Close driver
   * @returns {Promise<void>}
   */
  static async close() {
    if (this.driverInstance) {
      await this.driverInstance.close();
      this.driverInstance = null;
    }
  }

  /**
   * Set database driver type
   * @param {string} type - 'sqlite3', 'postgres', 'mysql'
   */
  static setDriverType(type) {
    this.driverType = type;
    this.driverInstance = null; // Reset instance
  }

  /**
   * Get current driver type
   * @returns {string}
   */
  static getDriverType() {
    return this.driverType;
  }
}

module.exports = DriverFactory;
