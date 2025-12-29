const express = require('express');
const router = express.Router();
const PublicController = require('../controllers/PublicController');
const FlashcardController = require('../controllers/FlashcardController');
const { authenticateUser } = require('../middlewares/authenticate');

// Auth routes (public)
router.post('/auth/login', PublicController.login);
router.post('/auth/logout', PublicController.logout);

// User routes (require auth)
router.get('/user', authenticateUser, PublicController.getCurrentUser);

// Bookmark routes
router.get('/bookmarks', authenticateUser, PublicController.getBookmarks);
router.put('/bookmarks', authenticateUser, PublicController.updateBookmarks);

// Streak routes
router.get('/streak', authenticateUser, PublicController.getStreak);

// Badge routes
router.get('/badges', authenticateUser, PublicController.getBadges);

// Flashcard routes (public)
router.get('/flashcards', FlashcardController.listFlashcards);
router.get('/topics', FlashcardController.listTopics);
router.get('/levels', FlashcardController.listLevels);

module.exports = router;
