import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  userQueries,
  settingsQueries,
  mealQueries,
  badgeQueries,
  healthStatsQueries,
} from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateAIFocus, generateDashboardInsight } from '../services/huggingfaceService.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const user = userQueries.findById.get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const settings = settingsQueries.findByUserId.get(userId);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      allergies: user.allergies,
      goals: user.goals,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activity_level: user.activity_level,
      dietary_preference: user.dietary_preference,
      health_conditions: user.health_conditions,
      onboarding_completed: Boolean(user.onboarding_completed),
      notifications: {
        insights: Boolean(settings?.notifications_insights),
        reminders: Boolean(settings?.notifications_reminders),
        challenges: Boolean(settings?.notifications_challenges),
      },
      processing_preference: settings?.processing_preference || 'auto',
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Update user profile
router.put(
  '/profile',
  authenticateToken,
  [
    body('name').optional().trim().notEmpty(),
    body('allergies').optional().trim(),
    body('goals').optional().trim(),
    body('age').optional().isInt({ min: 0, max: 150 }),
    body('gender').optional().trim(),
    body('height').optional().isFloat({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
    body('activity_level').optional().trim(),
    body('dietary_preference').optional().trim(),
    body('health_conditions').optional().trim(),
    body('onboarding_completed').optional().isBoolean(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.userId;
      const updateData = {};

      const allowedFields = [
        'name',
        'allergies',
        'goals',
        'age',
        'gender',
        'height',
        'weight',
        'activity_level',
        'dietary_preference',
        'health_conditions',
        'onboarding_completed',
      ];

      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      userQueries.update.run(updateData, userId);

      const updatedUser = userQueries.findById.get(userId);

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found after update' });
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        allergies: updatedUser.allergies,
        goals: updatedUser.goals,
        age: updatedUser.age,
        gender: updatedUser.gender,
        height: updatedUser.height,
        weight: updatedUser.weight,
        activity_level: updatedUser.activity_level,
        dietary_preference: updatedUser.dietary_preference,
        health_conditions: updatedUser.health_conditions,
        onboarding_completed: Boolean(updatedUser.onboarding_completed),
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Server error updating profile' });
    }
  }
);

// Update user settings
router.put(
  '/settings',
  authenticateToken,
  [
    body('notifications.insights').optional().isBoolean(),
    body('notifications.reminders').optional().isBoolean(),
    body('notifications.challenges').optional().isBoolean(),
    body('processing_preference').optional().isIn(['auto', 'cloud', 'device']),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.userId;
      const { notifications, processing_preference } = req.body;

      const currentSettings = settingsQueries.findByUserId.get(userId);

      settingsQueries.update.run(
        notifications?.insights !== undefined
          ? notifications.insights
          : currentSettings?.notifications_insights,
        notifications?.reminders !== undefined
          ? notifications.reminders
          : currentSettings?.notifications_reminders,
        notifications?.challenges !== undefined
          ? notifications.challenges
          : currentSettings?.notifications_challenges,
        userId,
        processing_preference !== undefined
          ? processing_preference
          : currentSettings?.processing_preference
      );

      const updatedSettings = settingsQueries.findByUserId.get(userId);
      res.json({
        notifications: {
          insights: Boolean(updatedSettings.notifications_insights),
          reminders: Boolean(updatedSettings.notifications_reminders),
          challenges: Boolean(updatedSettings.notifications_challenges),
        },
        processing_preference: updatedSettings.processing_preference || 'auto',
      });
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Server error updating settings' });
    }
  }
);

// Get quick stats
router.get('/quick-stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    const todayStats = healthStatsQueries.getQuickStats.get(userId);
    const yesterdayStats = healthStatsQueries.getYesterdayStats.get(userId);

    const caloriesLeft = 2000 - (todayStats?.calories_today || 0);
    const calorieDelta = yesterdayStats?.calories_yesterday
      ? Math.round(
          ((todayStats?.calories_today || 0) - yesterdayStats.calories_yesterday) /
            yesterdayStats.calories_yesterday *
            100
        )
      : 0;

    const stats = [
      {
        label: 'Calories left',
        value: caloriesLeft.toLocaleString(),
        delta: `${calorieDelta >= 0 ? '+' : ''}${calorieDelta}% vs yesterday`,
        accent: '#FD8B5D',
      },
      {
        label: 'Macro balance',
        value: '45 / 30 / 25',
        delta: 'C / P / F',
        accent: '#FFC299',
      },
      {
        label: 'Health score',
        value: String(todayStats?.avg_score_today || 85),
        delta: '+3 boost today',
        accent: '#f54703',
      },
    ];

    res.json(stats);
  } catch (error) {
    console.error('Get quick stats error:', error);
    res.status(500).json({ error: 'Server error fetching stats' });
  }
});

// Get badges
router.get('/badges', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const badges = badgeQueries.findByUserId.all(userId);

    const formattedBadges = badges.map((badge) => ({
      id: badge.badge_type,
      title: badge.title,
      description: badge.description,
      earnedAt: badge.earned_at,
    }));

    res.json(formattedBadges);
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Server error fetching badges' });
  }
});

// Get AI focus insight
router.get('/ai-focus', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = userQueries.findById.get(userId);
    const recentMeals = mealQueries.getRecentMeals.all(userId);

    const insight = await generateAIFocus(user, recentMeals);
    const greeting = await generateDashboardInsight(user.name, {});

    res.json({
      greeting,
      insight,
    });
  } catch (error) {
    console.error('Get AI focus error:', error);
    res.status(500).json({ error: 'Server error generating AI focus' });
  }
});

export default router;


