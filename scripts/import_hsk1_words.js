// Import vocabulary from data/hsk1_words.json into flashcards table
// Each flashcard gets a UUID v4 id, default topic, provided level

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { initializeDatabase } = require('../src/config/database');
const Flashcard = require('../src/models/Flashcard');
const Topic = require('../src/models/Topic');
const Level = require('../src/models/Level');
const { DEFAULT_TOPIC_ID, DEFAULT_TOPIC_LABEL } = require('../src/constants');

function levelLabelFromId(levelId) {
  // Convert e.g. 'HSK1' -> 'HSK 1'; 'hsk1' -> 'HSK 1'
  const m = String(levelId).toUpperCase().match(/^HSK(\d)$/);
  return m ? `HSK ${m[1]}` : String(levelId);
}

async function ensureTopicAndLevel(levelId) {
  // Ensure default topic exists
  const t = Topic.getById(DEFAULT_TOPIC_ID);
  if (!t) {
    Topic.create(DEFAULT_TOPIC_ID, DEFAULT_TOPIC_LABEL);
    console.log(`Created default topic: ${DEFAULT_TOPIC_ID} - ${DEFAULT_TOPIC_LABEL}`);
  }

  // Ensure level exists
  const l = Level.getById(levelId);
  if (!l) {
    const label = levelLabelFromId(levelId);
    Level.create(levelId, label);
    console.log(`Created level: ${levelId} - ${label}`);
  }
}

function buildPayloadFromItem(item) {
  return {
    id: uuidv4(),
    topicId: DEFAULT_TOPIC_ID,
    levelId: item.level_id,
    isPremium: false,
    hanzi: item.hanzi,
    pinyin: item.pinyin,
    englishPhonetic: null,
    imageUrl: null,
    audioCn: null,
    audioEn: null,
    audioVi: null,
    meaningEn: item.meaning_en,
    meaningVi: item.meaning_vi,
    exampleHanzi: item.example_hanzi || null,
    examplePinyin: null,
    exampleMeaningVi: item.meaning_vi || null
  };
}

async function main() {
  await initializeDatabase();

  const filePath = path.join(__dirname, '..', 'data', 'hsk1_words.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  const list = JSON.parse(raw);

  if (!Array.isArray(list)) {
    throw new Error('Invalid JSON: expected an array');
  }

  const levelId = (list[0] && list[0].level_id) ? list[0].level_id : 'HSK1';
  await ensureTopicAndLevel(levelId);

  const db = Flashcard.getDb();
  db.beginTransaction();

  let inserted = 0;
  let skipped = 0;
  const checkStmt = db.prepare('SELECT id FROM flashcards WHERE hanzi = ? AND level_id = ?');

  try {
    for (const it of list) {
      const hz = it.hanzi;
      const lv = it.level_id || levelId;
      const exists = checkStmt.get(hz, lv);
      if (exists) {
        skipped++;
        continue;
      }

      const payload = buildPayloadFromItem({ ...it, level_id: lv });
      Flashcard.create(payload);
      inserted++;
    }
    db.commit();
  } catch (err) {
    db.rollback();
    console.error('Import failed, rolled back:', err.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Import completed. Inserted: ${inserted}, Skipped (existing): ${skipped}`);
}

if (require.main === module) {
  main();
}
