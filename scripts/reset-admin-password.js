/**
 * Reset admin password
 */
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve('./data/flashcard.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✓ Connected to database');

  // Tạo mật khẩu hash mới
  const newPassword = 'admin123';
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  console.log(`Resetting admin password to: ${newPassword}`);
  console.log(`Hashed: ${hashedPassword}\n`);

  // Update mật khẩu admin
  db.run(
    'UPDATE admin_users SET password = ? WHERE username = ?',
    [hashedPassword, 'admin'],
    function(err) {
      if (err) {
        console.error('Error updating password:', err.message);
        db.close();
        process.exit(1);
      }

      console.log(`✓ Password updated (${this.changes} row(s) affected)`);

      // Kiểm tra admin user
      db.get('SELECT id, username, password FROM admin_users WHERE username = ?', ['admin'], (err, row) => {
        if (err) {
          console.error('Error querying admin:', err.message);
          db.close();
          process.exit(1);
        }

        if (row) {
          console.log('\nAdmin user details:');
          console.log(`  ID: ${row.id}`);
          console.log(`  Username: ${row.username}`);
          console.log(`  Password hash: ${row.password.substring(0, 20)}...`);

          // Test verify
          const testMatch = bcrypt.compareSync(newPassword, row.password);
          console.log(`  Password verification: ${testMatch ? '✓ OK' : '✗ FAILED'}`);
        }

        db.close();
        process.exit(0);
      });
    }
  );
});
