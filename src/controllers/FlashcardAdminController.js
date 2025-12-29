const fs = require('fs');
const Flashcard = require('../models/Flashcard');
const CloudinaryService = require('../utils/CloudinaryService');
const Topic = require('../models/Topic');
const Level = require('../models/Level');
const { v4: uuidv4 } = require('uuid');
const { ALLOWED_LEVELS, DEFAULT_TOPIC_ID, DEFAULT_TOPIC_LABEL } = require('../constants');

class FlashcardAdminController {
  // Helper: Coerce various truthy/falsey representations to boolean
  static toBoolean(value, defaultValue = false) {
    if (value === undefined || value === null) {
      return defaultValue;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'number') {
      return value !== 0;
    }
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === 'true' || v === '1' || v === 'yes') {
        return true;
      }
      if (v === 'false' || v === '0' || v === 'no' || v === '') {
        return false;
      }
      return Boolean(value);
    }
    return Boolean(value);
  }
  // Helper: Convert body to normalized payload (camelCase OR snake_case)
  static normalizePayload(body, includeId = true) {
    const payload = {
      topicId: body.topicId || body.topic_id || DEFAULT_TOPIC_ID,
      levelId: body.levelId || body.level_id,
      isPremium: FlashcardAdminController.toBoolean(
        body.isPremium !== undefined ? body.isPremium : body.is_premium,
        false
      ),
      hanzi: body.hanzi,
      pinyin: body.pinyin,
      englishPhonetic: body.englishPhonetic || body.english_phonetic,
      imageUrl: body.imageUrl || body.image_url,
      audioCn: body.audioCn || body.audio_cn,
      audioEn: body.audioEn || body.audio_en,
      audioVi: body.audioVi || body.audio_vi,
      meaningEn: body.meaningEn || body.meaning_en,
      meaningVi: body.meaningVi || body.meaning_vi,
      exampleHanzi: body.exampleHanzi || body.example_hanzi,
      examplePinyin: body.examplePinyin || body.example_pinyin,
      exampleMeaningVi: body.exampleMeaningVi || body.example_meaning_vi
    };

    if (includeId) {
      payload.id = body.id || uuidv4();
    }

    return payload;
  }

  // Helper: Validate required fields
  static validatePayload(payload) {
    const required = ['levelId', 'hanzi', 'pinyin', 'meaningEn', 'meaningVi'];
    const missing = required.filter(field => !payload[field]);
    return missing.length > 0 ? missing : null;
  }

  // Helper: Ensure topic exists
  static ensureTopic(topicId) {
    if (topicId === DEFAULT_TOPIC_ID) {
      const existing = Topic.getById(DEFAULT_TOPIC_ID);
      if (!existing) {
        Topic.create(DEFAULT_TOPIC_ID, DEFAULT_TOPIC_LABEL);
      }
    } else {
      const topic = Topic.getById(topicId);
      if (!topic) {
        throw new Error(`Topic not found: ${topicId}`);
      }
    }
  }

  // Helper: Ensure level exists
  static ensureLevel(levelId) {
    const levelMeta = ALLOWED_LEVELS.find(l => l.id === levelId);
    if (!levelMeta) {
      throw new Error(`Invalid level: ${levelId}`);
    }
    const level = Level.getById(levelId);
    if (!level) {
      Level.create(levelMeta.id, levelMeta.label);
    }
  }

  // POST /admin/flashcards - Tạo flashcard mới (admin/moderator)
  static async create(req, res) {
    let responseSent = false;

    // Helper to support both upload.single and upload.fields
    const imageFile = req.file || (req.files && req.files.image && req.files.image[0]);

    try {
      const rawBody = req.body || {};
      const payload = FlashcardAdminController.normalizePayload(rawBody, true);
      console.log('[FlashcardAdminController.create] premium input', {
        isPremium_raw: rawBody.isPremium,
        is_premium_raw: rawBody.is_premium,
        isPremium_normalized: payload.isPremium
      });

      // Validate required fields
      const missing = FlashcardAdminController.validatePayload(payload);
      if (missing) {
        responseSent = true;
        return res.status(400).json({
          error: 'Missing required fields',
          missing
        });
      }

      // Ensure topic and level exist
      FlashcardAdminController.ensureTopic(payload.topicId);
      FlashcardAdminController.ensureLevel(payload.levelId);

      // Upload image if provided
      if (imageFile) {
        const publicId = `flashcard_${payload.id}`;
        payload.imageUrl = await CloudinaryService.uploadImage(imageFile.path, publicId);
      }

      const flashcard = Flashcard.create(payload);
      responseSent = true;
      res.status(201).json(flashcard);
    } catch (error) {
      console.error('Create flashcard failed', { message: error.message, stack: error.stack });
      if (!responseSent) {
        responseSent = true;
        res.status(400).json({ error: error.message });
      }
    } finally {
      // Clean temp upload if exists
      if (imageFile && imageFile.path && fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path);
      }
    }
  }

  // GET /admin/flashcards - Liệt kê flashcards (phân trang, lọc)
  static getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.pageSize) || 20, 100);
    const topic = req.query.topic || null;
    const level = req.query.level || null;

    const result = Flashcard.getAll(page, pageSize, topic, level);
    res.json({
      data: result.flashcards,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages
      }
    });
  }

  // GET /admin/flashcards/:id - Lấy flashcard theo ID
  static getById(req, res) {
    const flashcard = Flashcard.getById(req.params.id);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.json(flashcard);
  }

  // PUT /admin/flashcards/:id - Cập nhật flashcard
  static async update(req, res) {
    let responseSent = false;

    // Support both upload.single and upload.fields
    const imageFile = req.file || (req.files && req.files.image && req.files.image[0]);

    try {
      // Get existing flashcard to preserve fields not in update
      const existing = Flashcard.getById(req.params.id);
      if (!existing) {
        responseSent = true;
        return res.status(404).json({ error: 'Flashcard not found' });
      }

      // Normalize new data and merge with existing
      const body = req.body || {};
      const updateData = FlashcardAdminController.normalizePayload(body, false);
      console.log('[FlashcardAdminController.update] premium input', {
        isPremium_raw: body.isPremium,
        is_premium_raw: body.is_premium,
        isPremium_normalized: updateData.isPremium,
        existing_is_premium: existing.is_premium
      });

      let imageUrl = updateData.imageUrl || existing.content.image_url;
      if (imageFile) {
        const publicId = `flashcard_${req.params.id}`;
        imageUrl = await CloudinaryService.uploadImage(imageFile.path, publicId);
      }

      const payload = {
        topicId: updateData.topicId || existing.topic,
        levelId: updateData.levelId || existing.level,
        isPremium: (body.isPremium !== undefined || body.is_premium !== undefined)
          ? updateData.isPremium
          : existing.is_premium,
        hanzi: updateData.hanzi || existing.content.hanzi,
        pinyin: updateData.pinyin || existing.content.pinyin,
        englishPhonetic: updateData.englishPhonetic || existing.content.english_phonetic,
        imageUrl,
        audioCn: updateData.audioCn || existing.content.audio.cn,
        audioEn: updateData.audioEn || existing.content.audio.en,
        audioVi: updateData.audioVi || existing.content.audio.vi,
        meaningEn: updateData.meaningEn || existing.content.meanings.en,
        meaningVi: updateData.meaningVi || existing.content.meanings.vi,
        exampleHanzi: updateData.exampleHanzi || existing.content.example_sentence.hanzi,
        examplePinyin: updateData.examplePinyin || existing.content.example_sentence.pinyin,
        exampleMeaningVi: updateData.exampleMeaningVi || existing.content.example_sentence.meaning_vi
      };

      const flashcard = Flashcard.update(req.params.id, payload);
      responseSent = true;
      res.json(flashcard);
    } catch (error) {
      console.error('Update flashcard failed', {
        flashcardId: req.params.id,
        message: error.message
      });
      if (!responseSent) {
        responseSent = true;
        res.status(400).json({ error: error.message });
      }
    } finally {
      if (imageFile && imageFile.path && fs.existsSync(imageFile.path)) {
        fs.unlinkSync(imageFile.path);
      }
    }
  }

  // DELETE /admin/flashcards/:id - Xóa flashcard
  static delete(req, res) {
    Flashcard.delete(req.params.id);
    res.json({ success: true });
  }

  // POST /admin/flashcards/:id/upload-image - Upload ảnh cho flashcard
  static async uploadImage(req, res) {
    let responseSent = false;

    try {
      if (!req.file) {
        responseSent = true;
        return res.status(400).json({ error: 'No file provided' });
      }

      const publicId = `flashcard_${req.params.id}`;
      const imageUrl = await CloudinaryService.uploadImage(req.file.path, publicId);

      // Update flashcard image_url
      const flashcard = Flashcard.getById(req.params.id);
      if (flashcard) {
        Flashcard.update(req.params.id, { ...flashcard, imageUrl });
      }

      responseSent = true;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Upload image failed', {
        flashcardId: req.params.id,
        message: error.message
      });
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: error.message });
      }
    } finally {
      // Clean up temp file
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }

  // POST /admin/flashcards/:id/upload-audio - Upload audio cho flashcard
  static async uploadAudio(req, res) {
    let responseSent = false;

    try {
      if (!req.file) {
        responseSent = true;
        return res.status(400).json({ error: 'No file provided' });
      }

      const publicId = `flashcard_audio_${req.params.id}`;
      const audioUrl = await CloudinaryService.uploadAudio(req.file.path, publicId);

      // Update flashcard audio_url
      const flashcard = Flashcard.getById(req.params.id);
      if (flashcard) {
        Flashcard.update(req.params.id, { ...flashcard, audioCn: audioUrl });
      }

      responseSent = true;
      res.json({ audioUrl });
    } catch (error) {
      console.error('Upload audio failed', {
        flashcardId: req.params.id,
        message: error.message
      });
      if (!responseSent) {
        responseSent = true;
        res.status(500).json({ error: error.message });
      }
    } finally {
      // Clean up temp file
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }
  }
}

module.exports = FlashcardAdminController;
