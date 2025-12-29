/**
 * Base Database Driver Interface
 * Defines the contract that all database drivers must implement
 */
class DatabaseDriver {
  /**
   * Initialize database connection
   * @returns {Promise<void>}
   */
  async init() {
    throw new Error('init() must be implemented');
  }

  /**
   * Close database connection
   * @returns {Promise<void>}
   */
  async close() {
    throw new Error('close() must be implemented');
  }

  /**
   * Execute INSERT/UPDATE/DELETE query asynchronously
   * @param {string} _sql - SQL query
   * @param {Array} _params - Query parameters
   * @returns {Promise<Object>} - Promise resolving to { lastInsertRowid, changes }
   */
  async runAsync(_sql, _params = []) {
    throw new Error('runAsync() must be implemented');
  }

  /**
   * Execute INSERT/UPDATE/DELETE query
   * @param {string} _sql - SQL query
   * @param {Array} _params - Query parameters
   * @returns {Object} - { lastInsertRowid, changes }
   */
  run(_sql, _params = []) {
    throw new Error('run() must be implemented');
  }

  /**
   * Execute SELECT query returning single row
   * @param {string} _sql - SQL query
   * @param {Array} _params - Query parameters
   * @returns {Object|undefined} - Single row or undefined
   */
  get(_sql, _params = []) {
    throw new Error('get() must be implemented');
  }

  /**
   * Execute SELECT query returning all rows
   * @param {string} _sql - SQL query
   * @param {Array} _params - Query parameters
   * @returns {Array} - Array of rows
   */
  all(_sql, _params = []) {
    throw new Error('all() must be implemented');
  }

  /**
   * Prepare a statement for reuse
   * @param {string} _sql - SQL query
   * @returns {PreparedStatement}
   */
  prepare(_sql) {
    throw new Error('prepare() must be implemented');
  }

  /**
   * Execute arbitrary SQL (for schema initialization)
   * @param {string} _sql - SQL query
   * @returns {Promise<void>}
   */
  async exec(_sql) {
    throw new Error('exec() must be implemented');
  }

  /**
   * Begin transaction
   * @returns {void}
   */
  beginTransaction() {
    throw new Error('beginTransaction() must be implemented');
  }

  /**
   * Commit transaction
   * @returns {void}
   */
  commit() {
    throw new Error('commit() must be implemented');
  }

  /**
   * Rollback transaction
   * @returns {void}
   */
  rollback() {
    throw new Error('rollback() must be implemented');
  }
}

module.exports = DatabaseDriver;
