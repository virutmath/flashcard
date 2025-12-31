const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdminAuthController = require('../controllers/AdminAuthController');
const AdminUserController = require('../controllers/AdminUserController');
const UserAdminController = require('../controllers/UserAdminController');
const FlashcardAdminController = require('../controllers/FlashcardAdminController');
const TopicAdminController = require('../controllers/TopicAdminController');
const LevelAdminController = require('../controllers/LevelAdminController');
const BadgeAdminController = require('../controllers/BadgeAdminController');
const BackupController = require('../controllers/BackupController');
const { authenticateAdmin } = require('../middlewares/authenticate');
const { requireAdmin, requireAdminOrModerator } = require('../middlewares/authorize');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Admin Auth routes (public)
router.post('/auth/login', AdminAuthController.login);
router.post('/auth/logout', AdminAuthController.logout);

// Admin User routes (require admin)
router.use(authenticateAdmin);
router.get('/admin-users', requireAdmin, AdminUserController.getAll);
router.get('/admin-users/:id', requireAdmin, AdminUserController.getById);
router.post('/admin-users', requireAdmin, AdminUserController.create);
router.put('/admin-users/:id', requireAdmin, AdminUserController.update);
router.delete('/admin-users/:id', requireAdmin, AdminUserController.delete);
router.put('/admin-users/:id/password', AdminUserController.changePassword);

// User management routes (require admin)
router.get('/users', requireAdmin, UserAdminController.getAll);
router.get('/users/:id', requireAdmin, UserAdminController.getById);
router.put('/users/:id', requireAdmin, UserAdminController.update);
router.delete('/users/:id', requireAdmin, UserAdminController.delete);

// Flashcard routes (require admin or moderator)
const flashcardUpload = upload.fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'audio', maxCount: 1 }
]);

router.get('/flashcards', requireAdminOrModerator, FlashcardAdminController.getAll);
router.get('/flashcards/:id', requireAdminOrModerator, FlashcardAdminController.getById);
router.post('/flashcards', requireAdminOrModerator, flashcardUpload, FlashcardAdminController.create);
router.put('/flashcards/:id', requireAdminOrModerator, flashcardUpload, FlashcardAdminController.update);
router.delete('/flashcards/:id', requireAdminOrModerator, FlashcardAdminController.delete);
router.post('/flashcards/:id/upload-image', requireAdminOrModerator, upload.single('image'), FlashcardAdminController.uploadImage);
router.post('/flashcards/:id/upload-audio', requireAdminOrModerator, upload.single('audio'), FlashcardAdminController.uploadAudio);

// Topic routes (require admin or moderator)
router.get('/topics', requireAdminOrModerator, TopicAdminController.getAll);
router.get('/topics/:id', requireAdminOrModerator, TopicAdminController.getById);
router.post('/topics', requireAdminOrModerator, TopicAdminController.create);
router.put('/topics/:id', requireAdminOrModerator, TopicAdminController.update);
router.delete('/topics/:id', requireAdminOrModerator, TopicAdminController.delete);

// Level routes (require admin or moderator)
router.get('/levels', requireAdminOrModerator, LevelAdminController.getAll);
router.get('/levels/:id', requireAdminOrModerator, LevelAdminController.getById);
router.post('/levels', requireAdminOrModerator, LevelAdminController.create);
router.put('/levels/:id', requireAdminOrModerator, LevelAdminController.update);
router.delete('/levels/:id', requireAdminOrModerator, LevelAdminController.delete);

// Badge routes (require admin or moderator)
router.get('/badges', requireAdminOrModerator, BadgeAdminController.getAll);
router.get('/badges/:id', requireAdminOrModerator, BadgeAdminController.getById);
router.post('/badges', requireAdminOrModerator, BadgeAdminController.create);
router.put('/badges/:id', requireAdminOrModerator, BadgeAdminController.update);
router.delete('/badges/:id', requireAdminOrModerator, BadgeAdminController.delete);
router.post('/badges/:id/assign', requireAdminOrModerator, BadgeAdminController.assignToUser);
router.delete('/badges/:id/unassign', requireAdminOrModerator, BadgeAdminController.unassignFromUser);

// Backup & Restore routes (require admin)
const backupUpload = upload.single('file');
router.post('/backup/flashcard-db/download', requireAdmin, BackupController.downloadDatabase);
router.post('/backup/flashcard-db/upload', requireAdmin, backupUpload, BackupController.uploadDatabase);
router.post('/backup/hsk1/download', requireAdmin, BackupController.downloadHsk);
router.post('/backup/hsk1/upload', requireAdmin, backupUpload, BackupController.uploadHsk);

module.exports = router;
