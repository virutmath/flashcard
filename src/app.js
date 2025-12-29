require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const { initializeDatabase } = require('./config/database');
const AdminUser = require('./models/AdminUser');

// Create Express app
const app = express();

// Initialize database before creating default admin
let dbInitialized = false;
let initPromise = null;

async function initializeApp() {
  if (dbInitialized) {
    return;
  }
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('✓ App initialization complete');

      // Create default admin user (wrapped in setImmediate to avoid blocking)
      setImmediate(() => {
        try {
          const adminUser = AdminUser.getByUsername(config.defaultAdmin.username);
          if (!adminUser) {
            AdminUser.create(config.defaultAdmin.username, config.defaultAdmin.password, 'admin');
            console.log('✓ Default admin user created');
          }
        } catch (error) {
          console.warn('Warning: Could not create default admin user:', error.message);
        }
      });
    } catch (error) {
      console.error('Failed to initialize app:', error);
      throw error;
    }
  })();

  return initPromise;
}

// Security imports
const { blockSensitiveFiles, validateTokenFormat, simpleRateLimit } = require('./middlewares/security');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (prints to console for tracing)
app.use((req, res, next) => {
  const start = Date.now();
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) {
    sanitizedBody.password = '[REDACTED]';
  }
  if (sanitizedBody.password_hash) {
    sanitizedBody.password_hash = '[REDACTED]';
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log('[HTTP]', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      params: req.params,
      query: req.query,
      body: sanitizedBody
    });
  });

  next();
});

// Security middleware
app.use(blockSensitiveFiles);
app.use(validateTokenFormat);
app.use(simpleRateLimit(100, 60000)); // 100 requests per minute

// Serve static files (public admin UI)
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API Routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle admin SPA routes - redirect to appropriate HTML files
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, _next) => {
  // Log detailed error context for debugging
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) {
    sanitizedBody.password = '[REDACTED]';
  }
  if (sanitizedBody.password_hash) {
    sanitizedBody.password_hash = '[REDACTED]';
  }

  console.error('Unhandled error', {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: sanitizedBody,
    message: err?.message,
    stack: err?.stack
  });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = config.port;

// Initialize app and start server
async function startServer() {
  try {
    await initializeApp();

    app.listen(PORT, () => {
      console.log(`\n✓ Flashcard Admin Server running on port ${PORT}`);
      console.log(`✓ Admin UI: http://localhost:${PORT}/admin/login.html`);
      console.log(`✓ API: http://localhost:${PORT}/api`);
      console.log('\n✓ Default admin credentials:');
      console.log(`  Username: ${config.defaultAdmin.username}`);
      console.log(`  Password: ${config.defaultAdmin.password}`);
      console.log('\n⚠️ IMPORTANT: Change default password after first login!\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
