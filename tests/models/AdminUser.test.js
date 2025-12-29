/**
 * Unit tests for AdminUser model
 */
const AdminUser = require('../../src/models/AdminUser');
const { initializeDatabase, closeDatabase, getDatabase } = require('../../src/config/database');

describe('AdminUser Model', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('create', () => {
    it('should create a new admin user', () => {
      const user = AdminUser.create('testadmin', 'password123', 'admin');
      expect(user).toBeDefined();
      expect(user.username).toBe('testadmin');
      expect(user.role).toBe('admin');
    });

    it('should hash the password', () => {
      const user = AdminUser.create('testadmin2', 'password123', 'admin');
      expect(user.password).not.toBe('password123');
    });
  });

  describe('getById', () => {
    it('should retrieve admin user by id', () => {
      const created = AdminUser.create('testadmin3', 'pass123', 'moderator');
      const retrieved = AdminUser.getById(created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved.username).toBe('testadmin3');
    });

    it('should return undefined for non-existent id', () => {
      const user = AdminUser.getById(9999);
      expect(user).toBeUndefined();
    });
  });

  describe('getByUsername', () => {
    it('should retrieve admin user by username', () => {
      AdminUser.create('uniqueuser', 'pass123', 'admin');
      const user = AdminUser.getByUsername('uniqueuser');
      expect(user).toBeDefined();
      expect(user.username).toBe('uniqueuser');
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', () => {
      const user = AdminUser.create('pwtest', 'correctpass', 'admin');
      const isValid = AdminUser.verifyPassword('correctpass', user.password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', () => {
      const user = AdminUser.create('pwtest2', 'correctpass', 'admin');
      const isValid = AdminUser.verifyPassword('wrongpass', user.password);
      expect(isValid).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should retrieve all admin users', () => {
      AdminUser.create('user1', 'pass1', 'admin');
      AdminUser.create('user2', 'pass2', 'moderator');
      const users = AdminUser.getAll();
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update admin user', () => {
      const created = AdminUser.create('updatetest', 'pass123', 'moderator');
      const updated = AdminUser.update(created.id, 'updatetest', 'admin');
      expect(updated.role).toBe('admin');
    });
  });

  describe('delete', () => {
    it('should delete admin user', () => {
      const created = AdminUser.create('deletetest', 'pass123', 'moderator');
      AdminUser.delete(created.id);
      const retrieved = AdminUser.getById(created.id);
      expect(retrieved).toBeUndefined();
    });
  });
});
