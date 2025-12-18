-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  allergies TEXT,
  goals TEXT,
  age INTEGER,
  gender TEXT,
  height REAL,
  weight REAL,
  activity_level TEXT,
  dietary_preference TEXT,
  health_conditions TEXT,
  onboarding_completed BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  notifications_insights BOOLEAN DEFAULT 1,
  notifications_reminders BOOLEAN DEFAULT 0,
  notifications_challenges BOOLEAN DEFAULT 1,
  processing_preference TEXT DEFAULT 'auto',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Meals table
CREATE TABLE IF NOT EXISTS meals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  image_path TEXT,
  score INTEGER NOT NULL,
  advice TEXT,
  carbs REAL,
  protein REAL,
  fats REAL,
  calories INTEGER,
  hydration INTEGER,
  ingredients TEXT,
  strengths TEXT,
  improvements TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Health stats table (daily aggregates)
CREATE TABLE IF NOT EXISTS health_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  avg_score INTEGER,
  total_calories INTEGER,
  meals_count INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, date)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON meals(created_at);
CREATE INDEX IF NOT EXISTS idx_health_stats_user_date ON health_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
