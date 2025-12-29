/**
 * Jest test setup
 */
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.DB_TYPE = 'sqlite3';
  process.env.DB_PATH = ':memory:';
});

afterAll(async () => {
  // Cleanup
});
