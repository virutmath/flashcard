/**
 * Database Configuration and Initialization
 * Uses driver pattern for flexibility and extensibility
 */
const DriverFactory = require('../drivers/DriverFactory');

let db = null;

/**
 * Initialize database
 * @returns {Promise<Object>} Database driver instance
 */
async function initializeDatabase() {
  try {
    db = await DriverFactory.initialize();
    console.log(`✓ Database initialized with driver: ${DriverFactory.getDriverType()}`);
    await createSchema();
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Create database schema - using proper async callbacks
 */
async function createSchema() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'moderator',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS levels (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL,
      level_id TEXT NOT NULL,
      is_premium INTEGER DEFAULT 0,
      hanzi TEXT NOT NULL,
      pinyin TEXT NOT NULL,
      english_phonetic TEXT,
      image_url TEXT,
      audio_cn TEXT,
      audio_en TEXT,
      audio_vi TEXT,
      meaning_en TEXT,
      meaning_vi TEXT,
      example_hanzi TEXT,
      example_pinyin TEXT,
      example_meaning_vi TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topic_id) REFERENCES topics(id),
      FOREIGN KEY (level_id) REFERENCES levels(id)
    );`,
    `CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      badge_id TEXT NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
      UNIQUE(user_id, badge_id)
    );`,
    `CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      flashcard_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (flashcard_id) REFERENCES flashcards(id) ON DELETE CASCADE,
      UNIQUE(user_id, flashcard_id)
    );`,
    `CREATE TABLE IF NOT EXISTS streaks (
      user_id TEXT PRIMARY KEY,
      current INTEGER DEFAULT 0,
      best INTEGER DEFAULT 0,
      last_updated DATE DEFAULT CURRENT_DATE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`
  ];

  // Use actual async promises for each table creation
  const promises = tables.map(sql => {
    return new Promise((resolve) => {
      db.getRawDb().run(sql, (err) => {
        if (err && !err.message.includes('already exists')) {
          console.error('Error creating table:', err.message);
        }
        resolve();
      });
    });
  });

  await Promise.all(promises);
  console.log('✓ Database schema initialized');
}

/**
 * Get database instance
 * @returns {Object} Database driver instance
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first');
  }
  return db;
}

/**
 * Close database connection
 * @returns {Promise<void>}
 */
async function closeDatabase() {
  if (db) {
    await DriverFactory.close();
    db = null;
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  DriverFactory
};
