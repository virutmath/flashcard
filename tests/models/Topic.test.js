/**
 * Unit tests for Topic model
 */
const Topic = require('../../src/models/Topic');
const { initializeDatabase, closeDatabase } = require('../../src/config/database');
const { v4: uuidv4 } = require('uuid');

describe('Topic Model', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('create', () => {
    it('should create a new topic', () => {
      const id = uuidv4();
      const topic = Topic.create(id, 'Numbers');
      expect(topic).toBeDefined();
      expect(topic.label).toBe('Numbers');
    });
  });

  describe('getById', () => {
    it('should retrieve topic by id', () => {
      const id = uuidv4();
      Topic.create(id, 'Colors');
      const retrieved = Topic.getById(id);
      expect(retrieved).toBeDefined();
      expect(retrieved.label).toBe('Colors');
    });

    it('should return undefined for non-existent id', () => {
      const topic = Topic.getById('nonexistent');
      expect(topic).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should retrieve all topics', () => {
      const id1 = uuidv4();
      const id2 = uuidv4();
      Topic.create(id1, 'Animals');
      Topic.create(id2, 'Foods');
      const topics = Topic.getAll();
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('should update topic', () => {
      const id = uuidv4();
      Topic.create(id, 'OldLabel');
      const updated = Topic.update(id, 'NewLabel');
      expect(updated.label).toBe('NewLabel');
    });
  });

  describe('delete', () => {
    it('should delete topic', () => {
      const id = uuidv4();
      Topic.create(id, 'ToDelete');
      Topic.delete(id);
      const retrieved = Topic.getById(id);
      expect(retrieved).toBeUndefined();
    });
  });
});
