-- Migration: Add Child Nutrition, Sustainability, and Food Knowledge features
-- Date: 2025-12-28

-- Child profiles for family nutrition tracking
CREATE TABLE IF NOT EXISTS child_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT,
  current_weight REAL,
  current_height REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Growth tracking for children
CREATE TABLE IF NOT EXISTS growth_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  child_id INTEGER NOT NULL,
  weight REAL NOT NULL,
  height REAL NOT NULL,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (child_id) REFERENCES child_profiles(id) ON DELETE CASCADE
);

-- Planetary health metrics for meals
CREATE TABLE IF NOT EXISTS meal_sustainability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_id INTEGER NOT NULL,
  carbon_footprint REAL,
  water_footprint REAL,
  is_plant_based BOOLEAN DEFAULT 0,
  is_local BOOLEAN DEFAULT 0,
  is_seasonal BOOLEAN DEFAULT 0,
  sustainability_score INTEGER,
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
);

-- Food knowledge articles and lessons
CREATE TABLE IF NOT EXISTS food_knowledge (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'beginner',
  reading_time INTEGER,
  tags TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User progress in food knowledge
CREATE TABLE IF NOT EXISTS knowledge_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT 0,
  completed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES food_knowledge(id) ON DELETE CASCADE,
  UNIQUE(user_id, article_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_child_profiles_user_id ON child_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_records_child_id ON growth_records(child_id);
CREATE INDEX IF NOT EXISTS idx_meal_sustainability_meal_id ON meal_sustainability(meal_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_progress_user_id ON knowledge_progress(user_id);
