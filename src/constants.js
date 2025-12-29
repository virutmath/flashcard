/**
 * Application Constants
 */

// HSK Levels
const ALLOWED_LEVELS = [
  { id: 'hsk1', label: 'HSK 1' },
  { id: 'hsk2', label: 'HSK 2' },
  { id: 'hsk3', label: 'HSK 3' },
  { id: 'hsk4', label: 'HSK 4' },
  { id: 'hsk5', label: 'HSK 5' },
  { id: 'hsk6', label: 'HSK 6' }
];

// Default topic for unclassified flashcards
const DEFAULT_TOPIC_ID = '0';
const DEFAULT_TOPIC_LABEL = 'Chưa phân loại';

module.exports = {
  ALLOWED_LEVELS,
  DEFAULT_TOPIC_ID,
  DEFAULT_TOPIC_LABEL
};
