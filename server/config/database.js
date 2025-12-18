import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_PATH || join(__dirname, '../database/nafira.db');
const dbDir = dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQL.js
const SQL = await initSqlJs();

let db;

// Load or create database
if (fs.existsSync(dbPath)) {
  const buffer = fs.readFileSync(dbPath);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Save database to disk
function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database with schema
export function initDatabase() {
  const schemaPath = join(__dirname, '../database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  db.exec(schema);
  
  // Migration: Add processing_preference column if it doesn't exist
  try {
    db.run('ALTER TABLE user_settings ADD COLUMN processing_preference TEXT DEFAULT "auto"');
    saveDatabase();
  } catch (e) {
    // Column already exists, ignore
  }
  
  saveDatabase();
  console.log('✅ Database initialized successfully');
}

// Helper to convert sql.js result to object
function rowToObject(columns, values) {
  if (!values) return null;
  const obj = {};
  columns.forEach((col, idx) => {
    obj[col] = values[idx];
  });
  return obj;
}

function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const columns = stmt.getColumnNames();
  const values = stmt.step() ? stmt.get() : null;
  stmt.free();
  return values ? rowToObject(columns, values) : null;
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const columns = stmt.getColumnNames();
  const results = [];
  while (stmt.step()) {
    results.push(rowToObject(columns, stmt.get()));
  }
  stmt.free();
  return results;
}

function runQuery(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
}

function getLastInsertId() {
  const stmt = db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const id = stmt.get()[0];
  stmt.free();
  return id;
}

// User queries
export const userQueries = {
  create: {
    run: (email, password, name, allergies, goals) => {
      runQuery(
        'INSERT INTO users (email, password, name, allergies, goals) VALUES (?, ?, ?, ?, ?)',
        [email, password, name, allergies, goals]
      );
      return { lastInsertRowid: getLastInsertId() };
    }
  },
  
  findByEmail: {
    get: (email) => queryOne('SELECT * FROM users WHERE email = ?', [email])
  },
  
  findById: {
    get: (id) => queryOne(
      'SELECT id, email, name, allergies, goals, age, gender, height, weight, activity_level, dietary_preference, health_conditions, onboarding_completed, created_at, updated_at FROM users WHERE id = ?',
      [id]
    )
  },
  
  update: {
    run: (data, id) => {
      const fields = [];
      const values = [];
      
      if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
      if (data.allergies !== undefined) { fields.push('allergies = ?'); values.push(data.allergies); }
      if (data.goals !== undefined) { fields.push('goals = ?'); values.push(data.goals); }
      if (data.age !== undefined) { fields.push('age = ?'); values.push(data.age); }
      if (data.gender !== undefined) { fields.push('gender = ?'); values.push(data.gender); }
      if (data.height !== undefined) { fields.push('height = ?'); values.push(data.height); }
      if (data.weight !== undefined) { fields.push('weight = ?'); values.push(data.weight); }
      if (data.activity_level !== undefined) { fields.push('activity_level = ?'); values.push(data.activity_level); }
      if (data.dietary_preference !== undefined) { fields.push('dietary_preference = ?'); values.push(data.dietary_preference); }
      if (data.health_conditions !== undefined) { fields.push('health_conditions = ?'); values.push(data.health_conditions); }
      if (data.onboarding_completed !== undefined) { fields.push('onboarding_completed = ?'); values.push(data.onboarding_completed ? 1 : 0); }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      runQuery(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  },
  
  updatePassword: {
    run: (password, id) => {
      runQuery(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [password, id]
      );
    }
  }
};

// User settings queries
export const settingsQueries = {
  create: {
    run: (userId, insights, reminders, challenges, processingPreference) => {
      runQuery(
        'INSERT INTO user_settings (user_id, notifications_insights, notifications_reminders, notifications_challenges, processing_preference) VALUES (?, ?, ?, ?, ?)',
        [userId, insights, reminders, challenges, processingPreference || 'auto']
      );
    }
  },
  
  findByUserId: {
    get: (userId) => queryOne('SELECT * FROM user_settings WHERE user_id = ?', [userId])
  },
  
  update: {
    run: (insights, reminders, challenges, userId, processingPreference) => {
      const fields = [];
      const values = [];
      
      if (insights !== undefined) { fields.push('notifications_insights = ?'); values.push(insights); }
      if (reminders !== undefined) { fields.push('notifications_reminders = ?'); values.push(reminders); }
      if (challenges !== undefined) { fields.push('notifications_challenges = ?'); values.push(challenges); }
      if (processingPreference !== undefined) { fields.push('processing_preference = ?'); values.push(processingPreference); }
      
      if (fields.length === 0) return;
      
      values.push(userId);
      runQuery(
        `UPDATE user_settings SET ${fields.join(', ')} WHERE user_id = ?`,
        values
      );
    }
  }
};

// Meal queries
export const mealQueries = {
  create: {
    run: (userId, name, imagePath, score, advice, carbs, protein, fats, calories, hydration, ingredients, strengths, improvements) => {
      runQuery(
        'INSERT INTO meals (user_id, name, image_path, score, advice, carbs, protein, fats, calories, hydration, ingredients, strengths, improvements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, name, imagePath, score, advice, carbs, protein, fats, calories, hydration, 
         JSON.stringify(ingredients || []), JSON.stringify(strengths || []), JSON.stringify(improvements || [])]
      );
      return { lastInsertRowid: getLastInsertId() };
    }
  },
  
  findByUserId: {
    all: (userId, limit) => queryAll(
      'SELECT * FROM meals WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    )
  },
  
  findById: {
    get: (id, userId) => queryOne(
      'SELECT * FROM meals WHERE id = ? AND user_id = ?',
      [id, userId]
    )
  },
  
  getRecentMeals: {
    all: (userId) => queryAll(
      'SELECT * FROM meals WHERE user_id = ? ORDER BY created_at DESC LIMIT 6',
      [userId]
    )
  },
  
  getTodaysMeals: {
    all: (userId) => queryAll(
      "SELECT * FROM meals WHERE user_id = ? AND DATE(created_at) = DATE('now') ORDER BY created_at DESC",
      [userId]
    )
  },
  
  getWeeklyStats: {
    all: (userId) => queryAll(
      `SELECT 
        DATE(created_at) as date,
        AVG(score) as avg_score,
        SUM(calories) as total_calories,
        COUNT(*) as meals_count
      FROM meals
      WHERE user_id = ? AND created_at >= DATE('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC`,
      [userId]
    )
  }
};

// Health stats queries
export const healthStatsQueries = {
  upsert: {
    run: (userId, date, avgScore, totalCalories, mealsCount) => {
      runQuery(
        `INSERT INTO health_stats (user_id, date, avg_score, total_calories, meals_count)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, date) 
        DO UPDATE SET 
          avg_score = excluded.avg_score,
          total_calories = excluded.total_calories,
          meals_count = excluded.meals_count`,
        [userId, date, avgScore, totalCalories, mealsCount]
      );
    }
  },
  
  getQuickStats: {
    get: (userId) => queryOne(
      `SELECT 
        SUM(calories) as calories_today,
        AVG(score) as avg_score_today,
        COUNT(*) as meals_today
      FROM meals
      WHERE user_id = ? AND DATE(created_at) = DATE('now')`,
      [userId]
    )
  },
  
  getYesterdayStats: {
    get: (userId) => queryOne(
      `SELECT 
        SUM(calories) as calories_yesterday,
        AVG(score) as avg_score_yesterday
      FROM meals
      WHERE user_id = ? AND DATE(created_at) = DATE('now', '-1 day')`,
      [userId]
    )
  }
};

// Badge queries
export const badgeQueries = {
  create: {
    run: (userId, badgeType, title, description) => {
      runQuery(
        'INSERT INTO badges (user_id, badge_type, title, description) VALUES (?, ?, ?, ?)',
        [userId, badgeType, title, description]
      );
    }
  },
  
  findByUserId: {
    all: (userId) => queryAll(
      'SELECT * FROM badges WHERE user_id = ? ORDER BY earned_at DESC',
      [userId]
    )
  },
  
  checkExists: {
    get: (userId, badgeType) => queryOne(
      'SELECT COUNT(*) as count FROM badges WHERE user_id = ? AND badge_type = ?',
      [userId, badgeType]
    )
  }
};

export default db;
