const { getDatabase } = require('../config/database');

class Flashcard {
  static getDb() {
    return getDatabase();
  }
  static create(flashcardData) {
    const db = this.getDb();
    const {
      id, topicId, levelId, isPremium, hanzi, pinyin, englishPhonetic,
      imageUrl, audioCn, audioEn, audioVi, meaningEn, meaningVi,
      exampleHanzi, examplePinyin, exampleMeaningVi
    } = flashcardData;

    const stmt = db.prepare(`
      INSERT INTO flashcards (
        id, topic_id, level_id, is_premium, hanzi, pinyin, english_phonetic,
        image_url, audio_cn, audio_en, audio_vi, meaning_en, meaning_vi,
        example_hanzi, example_pinyin, example_meaning_vi
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, topicId, levelId, isPremium ? 1 : 0, hanzi, pinyin, englishPhonetic,
      imageUrl, audioCn, audioEn, audioVi, meaningEn, meaningVi,
      exampleHanzi, examplePinyin, exampleMeaningVi
    );

    return this.getById(id);
  }

  static getById(id) {
    const db = this.getDb();
    const flashcard = db.prepare(`
      SELECT * FROM flashcards WHERE id = ?
    `).get(id);

    return flashcard ? this._format(flashcard) : null;
  }

  static getAll(page = 1, pageSize = 20, topic = null, level = null, options = {}) {
    const db = this.getDb();
    const offset = (page - 1) * pageSize;
    const { onlyWithImage = false, keyword = null, premium = null } = options;
    let query = 'SELECT * FROM flashcards WHERE 1=1';
    const params = [];

    if (topic) {
      query += ' AND topic_id = ?';
      params.push(topic);
    }

    if (level) {
      query += ' AND level_id = ?';
      params.push(level);
    }

    if (onlyWithImage) {
      query += ' AND image_url IS NOT NULL AND image_url != ""';
    }

    if (keyword) {
      const kw = `%${keyword}%`;
      query += ' AND (hanzi LIKE ? OR pinyin LIKE ? OR meaning_en LIKE ? OR meaning_vi LIKE ? OR english_phonetic LIKE ?)';
      params.push(kw, kw, kw, kw, kw);
    }

    if (premium !== null) {
      query += ' AND is_premium = ?';
      params.push(premium ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const flashcards = db.prepare(query).all(...params).map(fc => this._format(fc));

    let countQuery = 'SELECT COUNT(*) as count FROM flashcards WHERE 1=1';
    const countParams = [];

    if (topic) {
      countQuery += ' AND topic_id = ?';
      countParams.push(topic);
    }

    if (level) {
      countQuery += ' AND level_id = ?';
      countParams.push(level);
    }

    if (onlyWithImage) {
      countQuery += ' AND image_url IS NOT NULL AND image_url != ""';
    }

    if (keyword) {
      const kw = `%${keyword}%`;
      countQuery += ' AND (hanzi LIKE ? OR pinyin LIKE ? OR meaning_en LIKE ? OR meaning_vi LIKE ? OR english_phonetic LIKE ?)';
      countParams.push(kw, kw, kw, kw, kw);
    }

    if (premium !== null) {
      countQuery += ' AND is_premium = ?';
      countParams.push(premium ? 1 : 0);
    }

    const total = db.prepare(countQuery).get(...countParams).count;
    const totalPages = Math.ceil(total / pageSize);

    return { flashcards, total, totalPages, page, pageSize };
  }

  static update(id, flashcardData) {
    const db = this.getDb();
    const {
      topicId, levelId, isPremium, hanzi, pinyin, englishPhonetic,
      imageUrl, audioCn, audioEn, audioVi, meaningEn, meaningVi,
      exampleHanzi, examplePinyin, exampleMeaningVi
    } = flashcardData;

    const stmt = db.prepare(`
      UPDATE flashcards
      SET topic_id = ?, level_id = ?, is_premium = ?, hanzi = ?, pinyin = ?,
          english_phonetic = ?, image_url = ?, audio_cn = ?, audio_en = ?,
          audio_vi = ?, meaning_en = ?, meaning_vi = ?, example_hanzi = ?,
          example_pinyin = ?, example_meaning_vi = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      topicId, levelId, isPremium ? 1 : 0, hanzi, pinyin, englishPhonetic,
      imageUrl, audioCn, audioEn, audioVi, meaningEn, meaningVi,
      exampleHanzi, examplePinyin, exampleMeaningVi, id
    );

    return this.getById(id);
  }

  static delete(id) {
    const db = this.getDb();
    db.prepare('DELETE FROM flashcards WHERE id = ?').run(id);
  }

  static _format(flashcard) {
    return {
      id: flashcard.id,
      topic: flashcard.topic_id,
      level: flashcard.level_id,
      is_premium: flashcard.is_premium === 1,
      content: {
        hanzi: flashcard.hanzi,
        pinyin: flashcard.pinyin,
        english_phonetic: flashcard.english_phonetic,
        image_url: flashcard.image_url,
        audio: {
          cn: flashcard.audio_cn,
          en: flashcard.audio_en,
          vi: flashcard.audio_vi
        },
        meanings: {
          en: flashcard.meaning_en,
          vi: flashcard.meaning_vi
        },
        example_sentence: {
          hanzi: flashcard.example_hanzi,
          pinyin: flashcard.example_pinyin,
          meaning_vi: flashcard.example_meaning_vi
        }
      }
    };
  }
}

module.exports = Flashcard;

