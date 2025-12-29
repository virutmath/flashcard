// Script để seed database với dữ liệu mẫu
const db = require('./src/config/database');
const Topic = require('./src/models/Topic');
const Level = require('./src/models/Level');
const Badge = require('./src/models/Badge');
const Flashcard = require('./src/models/Flashcard');

console.log('🌱 Seeding database...\n');

// Create topics
console.log('Creating topics...');
const topics = [
  { id: 'animals', label: 'Animals' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'colors', label: 'Colors' },
  { id: 'family', label: 'Family' },
];

topics.forEach(topic => {
  try {
    Topic.create(topic.id, topic.label);
  } catch (error) {
    // Topic may already exist
  }
});

// Create levels
console.log('Creating levels...');
const levels = [
  { id: 'HSK1', label: 'HSK 1' },
  { id: 'HSK2', label: 'HSK 2' },
  { id: 'HSK3', label: 'HSK 3' },
];

levels.forEach(level => {
  try {
    Level.create(level.id, level.label);
  } catch (error) {
    // Level may already exist
  }
});

// Create badges
console.log('Creating badges...');
const badges = [
  { id: 'b_001', name: 'Newcomer', icon: '🌱', description: 'Hoàn thành buổi học đầu tiên' },
  { id: 'b_002', name: '3-Day Streak', icon: '🔥', description: 'Duy trì streak 3 ngày' },
  { id: 'b_003', name: 'Memory Master', icon: '🧠', description: 'Thắng 3 trận Memory' },
];

badges.forEach(badge => {
  try {
    Badge.create(badge.id, badge.name, badge.icon, badge.description);
  } catch (error) {
    // Badge may already exist
  }
});

// Create sample flashcards
console.log('Creating sample flashcards...');
const flashcards = [
  {
    id: 'fc_001',
    topicId: 'animals',
    levelId: 'HSK1',
    isPremium: false,
    hanzi: '猫',
    pinyin: 'māo',
    englishPhonetic: 'mow',
    imageUrl: 'https://via.placeholder.com/200?text=Cat',
    audioCn: null,
    audioEn: null,
    audioVi: null,
    meaningEn: 'Cat',
    meaningVi: 'Con mèo',
    exampleHanzi: '这是一只猫',
    examplePinyin: 'Zhè shì yī zhī māo',
    exampleMeaningVi: 'Đây là một con mèo',
  },
  {
    id: 'fc_002',
    topicId: 'animals',
    levelId: 'HSK1',
    isPremium: false,
    hanzi: '狗',
    pinyin: 'gǒu',
    englishPhonetic: 'go',
    imageUrl: 'https://via.placeholder.com/200?text=Dog',
    audioCn: null,
    audioEn: null,
    audioVi: null,
    meaningEn: 'Dog',
    meaningVi: 'Con chó',
    exampleHanzi: '这是一只狗',
    examplePinyin: 'Zhè shì yī zhī gǒu',
    exampleMeaningVi: 'Đây là một con chó',
  },
  {
    id: 'fc_003',
    topicId: 'numbers',
    levelId: 'HSK1',
    isPremium: false,
    hanzi: '一',
    pinyin: 'yī',
    englishPhonetic: 'ee',
    imageUrl: 'https://via.placeholder.com/200?text=One',
    audioCn: null,
    audioEn: null,
    audioVi: null,
    meaningEn: 'One',
    meaningVi: 'Một',
    exampleHanzi: '一个苹果',
    examplePinyin: 'Yī gè píngguǒ',
    exampleMeaningVi: 'Một quả táo',
  },
];

flashcards.forEach(fc => {
  try {
    Flashcard.create(fc);
  } catch (error) {
    // Flashcard may already exist
  }
});

console.log('\n✓ Database seeded successfully!');
process.exit(0);
