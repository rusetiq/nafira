import express from 'express';
import { body, validationResult } from 'express-validator';
import { mealQueries, healthStatsQueries, settingsQueries } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { analyzeMealWithAI } from '../services/geminiService.js';
import { analyzeMealSustainability } from '../services/sustainabilityService.js';
import { sustainabilityQueries } from '../config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Create new meal
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  [body('name').optional().trim()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.userId;
      const imagePath = req.file ? req.file.filename : null;

      if (!imagePath) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      // Get full path for AI analysis
      const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
      const fullImagePath = path.join(uploadDir, imagePath);

      // Use AI for analysis
      const analysis = await analyzeMealWithAI(fullImagePath, 'auto');

      const mealName =
        req.body.name ||
        analysis.name ||
        req.file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      // Insert meal
      const result = mealQueries.create.run(
        userId,
        mealName,
        imagePath,
        analysis.score,
        analysis.advice,
        analysis.carbs,
        analysis.protein,
        analysis.fats,
        analysis.calories,
        analysis.hydration
      );

      const mealId = result.lastInsertRowid;

      // Calculate and save sustainability metrics
      if (analysis.ingredients && analysis.ingredients.length > 0) {
        const sustainabilityAnalysis = analyzeMealSustainability(analysis.ingredients);

        sustainabilityQueries.create.run(
          mealId,
          sustainabilityAnalysis.carbonFootprint,
          sustainabilityAnalysis.waterFootprint,
          sustainabilityAnalysis.isPlantBased,
          false, // isLocal - not detected yet
          false, // isSeasonal - not detected yet
          sustainabilityAnalysis.sustainabilityScore
        );
      }

      // Update daily stats
      const todayStats = mealQueries.getTodaysMeals.all(userId);
      const avgScore = Math.round(
        todayStats.reduce((sum, m) => sum + m.score, 0) / todayStats.length
      );
      const totalCalories = todayStats.reduce((sum, m) => sum + (m.calories || 0), 0);

      healthStatsQueries.upsert.run(
        userId,
        new Date().toISOString().split('T')[0],
        avgScore,
        totalCalories,
        todayStats.length
      );

      res.status(201).json({
        id: mealId,
        name: mealName,
        image: `/api/uploads/${imagePath}`,
        score: analysis.score,
        advice: analysis.advice,
        macros: {
          carbs: analysis.carbs,
          protein: analysis.protein,
          fats: analysis.fats,
        },
        calories: analysis.calories,
        hydration: analysis.hydration,
        ingredients: analysis.ingredients || [],
        strengths: analysis.strengths || [],
        improvements: analysis.improvements || [],
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Meal creation error:', error);
      res.status(500).json({ error: 'Server error during meal analysis' });
    }
  }
);

// Get recent meals
router.get('/recent', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const meals = mealQueries.getRecentMeals.all(userId);

    const formattedMeals = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      image: `/api/uploads/${meal.image_path}`,
      score: meal.score,
      advice: meal.advice,
      time: meal.created_at,
      macros: {
        carbs: meal.carbs,
        protein: meal.protein,
        fats: meal.fats,
      },
      calories: meal.calories,
      hydration: meal.hydration,
    }));

    res.json(formattedMeals);
  } catch (error) {
    console.error('Get recent meals error:', error);
    res.status(500).json({ error: 'Server error fetching meals' });
  }
});

// Get meal history
router.get('/history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 50;
    const meals = mealQueries.findByUserId.all(userId, limit);

    const formattedMeals = meals.map((meal) => ({
      id: meal.id,
      title: meal.name,
      date: meal.created_at,
      score: meal.score,
      notes: meal.advice,
      image: `/api/uploads/${meal.image_path}`,
      macros: {
        carbs: meal.carbs,
        protein: meal.protein,
        fats: meal.fats,
      },
      calories: meal.calories,
    }));

    res.json(formattedMeals);
  } catch (error) {
    console.error('Get meal history error:', error);
    res.status(500).json({ error: 'Server error fetching meal history' });
  }
});

// Get weekly stats
router.get('/weekly-stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const stats = mealQueries.getWeeklyStats.all(userId);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const formattedStats = stats.map((stat) => ({
      day: daysOfWeek[new Date(stat.date).getDay()],
      score: Math.round(stat.avg_score || 0),
      calories: stat.total_calories || 0,
    }));

    res.json(formattedStats);
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ error: 'Server error fetching weekly stats' });
  }
});

export default router;


