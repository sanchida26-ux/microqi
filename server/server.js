import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import db from './database.js';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper functions
const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 10);
};

const comparePassword = async (password, hash) => {
  return await bcryptjs.compare(password, hash);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '31d' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};

// Routes

// AUTH: Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        // Initialize default settings for user
        db.run(
          'INSERT INTO settings (userId) VALUES (?)',
          [this.lastID],
          (err) => {
            if (err) {
              console.error('Error creating default settings:', err);
            }
          }
        );

        const token = generateToken(this.lastID);
        res.json({ userId: this.lastID, token, email });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// AUTH: Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    res.json({ userId: user.id, token, email: user.email });
  });
});

// Settings: Get user settings
app.get('/api/settings', authMiddleware, (req, res) => {
  db.get('SELECT * FROM settings WHERE userId = ?', [req.userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.json({
        temperature: 50,
        humidity: 60,
        co: 1000,
        voc: 500,
        pm25: 300,
      });
    }

    res.json(row);
  });
});

// Settings: Save user settings
app.post('/api/settings', authMiddleware, (req, res) => {
  const { temperature, humidity, co, voc, pm25 } = req.body;

  db.run(
    `UPDATE settings SET temperature = ?, humidity = ?, co = ?, voc = ?, pm25 = ?, updatedAt = CURRENT_TIMESTAMP 
     WHERE userId = ?`,
    [temperature, humidity, co, voc, pm25, req.userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (this.changes === 0) {
        // Insert if doesn't exist
        db.run(
          'INSERT INTO settings (userId, temperature, humidity, co, voc, pm25) VALUES (?, ?, ?, ?, ?, ?)',
          [req.userId, temperature, humidity, co, voc, pm25],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true });
          }
        );
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Component Values: Get all component values
app.get('/api/component-values', authMiddleware, (req, res) => {
  db.all('SELECT * FROM componentValues WHERE userId = ?', [req.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const result = {};
    rows.forEach((row) => {
      result[row.componentName] = row.value;
    });

    res.json(result);
  });
});

// Component Values: Save component value
app.post('/api/component-values', authMiddleware, (req, res) => {
  const { componentName, value } = req.body;

  if (!componentName) {
    return res.status(400).json({ error: 'Component name required' });
  }

  db.run(
    `INSERT OR REPLACE INTO componentValues (userId, componentName, value, updatedAt) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
    [req.userId, componentName, JSON.stringify(value)],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    }
  );
});

// Component Values: Bulk save
app.post('/api/component-values/bulk', authMiddleware, (req, res) => {
  const values = req.body;

  if (!Array.isArray(values)) {
    return res.status(400).json({ error: 'Array of values required' });
  }

  const stmt = db.prepare(
    `INSERT OR REPLACE INTO componentValues (userId, componentName, value, updatedAt) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
  );

  try {
    db.serialize(() => {
      values.forEach((item) => {
        stmt.run([req.userId, item.componentName, JSON.stringify(item.value)]);
      });
      stmt.finalize();
      res.json({ success: true });
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: View all database tables
app.get('/api/admin/data', (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const providedPassword = req.query.password;

  if (providedPassword !== adminPassword) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = {};

    // Get users
    db.all('SELECT id, email, createdAt FROM users', (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      result.users = users || [];

      // Get settings
      db.all('SELECT * FROM settings', (err, settings) => {
        result.settings = settings || [];

        // Get component values
        db.all('SELECT * FROM componentValues', (err, values) => {
          result.componentValues = values || [];
          res.json(result);
        });
      });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin Dashboard: http://localhost:8080/admin (password: admin123)`);
});
