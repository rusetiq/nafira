import express from 'express';
import { body, validationResult } from 'express-validator';
import { childQueries, growthQueries } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import * as childNutrition from '../services/childNutritionService.js';

const router = express.Router();

// Get all children for user
router.get('/', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const children = childQueries.findByUserId.all(userId);
        res.json(children);
    } catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({ error: 'Server error fetching children' });
    }
});

// Add child profile
router.post(
    '/',
    authenticateToken,
    [
        body('name').trim().notEmpty(),
        body('age').isInt({ min: 0, max: 18 }),
        body('gender').optional().isIn(['male', 'female']),
        body('weight').optional().isFloat({ min: 0 }),
        body('height').optional().isFloat({ min: 0 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userId = req.user.userId;
            const { name, age, gender, weight, height } = req.body;

            // Convert age to approximate date of birth
            const now = new Date();
            const birthYear = now.getFullYear() - parseInt(age);
            const dateOfBirth = `${birthYear}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

            const result = childQueries.create.run(userId, name, dateOfBirth, gender, weight, height);

            res.status(201).json({
                id: result.lastInsertRowid,
                name,
                age,
                dateOfBirth,
                gender,
                weight,
                height
            });
        } catch (error) {
            console.error('Create child error:', error);
            res.status(500).json({ error: 'Server error creating child profile' });
        }
    }
);

// Update child profile
router.put('/:id', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        // Verify ownership
        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        childQueries.update.run(childId, req.body);
        res.json({ message: 'Child profile updated' });
    } catch (error) {
        console.error('Update child error:', error);
        res.status(500).json({ error: 'Server error updating child profile' });
    }
});

// Delete child profile
router.delete('/:id', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        // Verify ownership
        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        childQueries.delete.run(childId);
        res.json({ message: 'Child profile deleted' });
    } catch (error) {
        console.error('Delete child error:', error);
        res.status(500).json({ error: 'Server error deleting child profile' });
    }
});

// Record growth measurement
router.post('/:id/growth', authenticateToken, [
    body('weight').isFloat({ min: 0 }),
    body('height').isFloat({ min: 0 }),
    body('notes').optional().trim()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        // Verify ownership
        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const { weight, height, notes } = req.body;
        const result = growthQueries.create.run(childId, weight, height, notes);

        // Update child's current measurements
        childQueries.update.run(childId, { current_weight: weight, current_height: height });

        res.status(201).json({
            id: result.lastInsertRowid,
            childId,
            weight,
            height,
            notes
        });
    } catch (error) {
        console.error('Record growth error:', error);
        res.status(500).json({ error: 'Server error recording growth' });
    }
});

// Get growth history
router.get('/:id/growth', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        // Verify ownership
        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const growthRecords = growthQueries.findByChildId.all(childId);
        res.json(growthRecords);
    } catch (error) {
        console.error('Get growth history error:', error);
        res.status(500).json({ error: 'Server error fetching growth history' });
    }
});

// Get nutrition needs
router.get('/:id/nutrition-needs', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const needs = childNutrition.calculateMacroNeeds(child.date_of_birth, child.gender);
        const ageYears = childNutrition.calculateAgeInYears(child.date_of_birth);

        res.json({
            ageYears,
            ...needs
        });
    } catch (error) {
        console.error('Get nutrition needs error:', error);
        res.status(500).json({ error: 'Server error calculating nutrition needs' });
    }
});

// Get meal suggestions
router.get('/:id/meal-suggestions', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const ageYears = childNutrition.calculateAgeInYears(child.date_of_birth);
        const suggestions = childNutrition.getChildMealSuggestions(ageYears);

        res.json({ suggestions });
    } catch (error) {
        console.error('Get meal suggestions error:', error);
        res.status(500).json({ error: 'Server error getting meal suggestions' });
    }
});

// Get malnutrition risk assessment
router.get('/:id/risk-assessment', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const childId = req.params.id;

        const child = childQueries.findById.get(childId, userId);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const growthRecords = growthQueries.findByChildId.all(childId);
        const latestGrowth = growthRecords[0];

        const assessment = childNutrition.assessMalnutritionRisk(child, latestGrowth);

        res.json(assessment);
    } catch (error) {
        console.error('Get risk assessment error:', error);
        res.status(500).json({ error: 'Server error assessing malnutrition risk' });
    }
});

export default router;
