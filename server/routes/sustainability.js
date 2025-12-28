import express from 'express';
import { sustainabilityQueries, mealQueries } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import * as sustainability from '../services/sustainabilityService.js';

const router = express.Router();

// Analyze meal sustainability
router.post('/analyze', authenticateToken, (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ error: 'Ingredients array is required' });
        }

        const analysis = sustainability.analyzeMealSustainability(ingredients);

        res.json(analysis);
    } catch (error) {
        console.error('Sustainability analysis error:', error);
        res.status(500).json({ error: 'Server error analyzing sustainability' });
    }
});

// Get user's sustainability stats
router.get('/stats', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('[Sustainability] Getting stats for user:', userId);

        const stats = sustainabilityQueries.getUserStats.get(userId);
        console.log('[Sustainability] Raw stats:', stats);

        if (!stats || !stats.total_meals || stats.total_meals === 0) {
            console.log('[Sustainability] No sustainability data found');
            return res.json({
                avgScore: 0,
                avgCarbon: 0,
                avgWater: 0,
                plantBasedPercent: 0,
                totalMeals: 0
            });
        }

        const result = {
            avgScore: Math.round(stats.avg_score || 0),
            avgCarbon: Math.round((stats.avg_carbon || 0) * 100) / 100,
            avgWater: Math.round(stats.avg_water || 0),
            plantBasedPercent: Math.round((stats.plant_based_count / stats.total_meals) * 100),
            totalMeals: stats.total_meals
        };

        console.log('[Sustainability] Returning stats:', result);
        res.json(result);
    } catch (error) {
        console.error('Get sustainability stats error:', error);
        res.status(500).json({ error: 'Server error fetching sustainability stats' });
    }
});

// Get sustainability tips
router.get('/tips', authenticateToken, (req, res) => {
    try {
        const tips = [
            {
                title: 'Choose Plant-Based Proteins',
                description: 'Replace meat with beans, lentils, or tofu to reduce carbon footprint by up to 50%',
                impact: 'high',
                category: 'protein'
            },
            {
                title: 'Eat Seasonal Produce',
                description: 'Seasonal fruits and vegetables require less energy for storage and transportation',
                impact: 'medium',
                category: 'produce'
            },
            {
                title: 'Reduce Food Waste',
                description: 'Plan meals and store food properly to minimize waste and environmental impact',
                impact: 'high',
                category: 'waste'
            },
            {
                title: 'Buy Local',
                description: 'Local food reduces transportation emissions and supports local farmers',
                impact: 'medium',
                category: 'sourcing'
            },
            {
                title: 'Choose Sustainable Seafood',
                description: 'Opt for fish with lower environmental impact like sardines, mackerel, or farmed shellfish',
                impact: 'medium',
                category: 'protein'
            }
        ];

        res.json(tips);
    } catch (error) {
        console.error('Get sustainability tips error:', error);
        res.status(500).json({ error: 'Server error fetching tips' });
    }
});

// Get environmental impact summary
router.get('/impact', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const stats = sustainabilityQueries.getUserStats.get(userId);

        if (!stats || !stats.total_meals || stats.total_meals === 0) {
            return res.json({
                totalCarbon: 0,
                totalWater: 0,
                treesEquivalent: 0,
                mealsAnalyzed: 0
            });
        }

        const totalCarbon = (stats.avg_carbon || 0) * stats.total_meals;
        const totalWater = (stats.avg_water || 0) * stats.total_meals;

        // 1 tree absorbs ~21kg CO2 per year
        const treesEquivalent = Math.round((totalCarbon / 21) * 10) / 10;

        res.json({
            totalCarbon: Math.round(totalCarbon * 100) / 100,
            totalWater: Math.round(totalWater),
            treesEquivalent,
            mealsAnalyzed: stats.total_meals,
            avgScore: Math.round(stats.avg_score || 0)
        });
    } catch (error) {
        console.error('Get environmental impact error:', error);
        res.status(500).json({ error: 'Server error calculating impact' });
    }
});

// Backfill sustainability data for existing meals
router.post('/backfill', authenticateToken, (req, res) => {
    try {
        const userId = req.user.userId;
        const meals = mealQueries.getRecentMeals.all(userId);

        let backfilledCount = 0;

        for (const meal of meals) {
            // Check if sustainability data already exists
            const existing = sustainabilityQueries.findByMealId.get(meal.id);
            if (!existing) {
                // Generate sample ingredients based on meal name
                const mealName = (meal.name || '').toLowerCase();
                const sampleIngredients = [];

                // Detect ingredients from meal name
                if (mealName.includes('chicken')) sampleIngredients.push('chicken');
                if (mealName.includes('beef') || mealName.includes('steak')) sampleIngredients.push('beef');
                if (mealName.includes('fish') || mealName.includes('salmon')) sampleIngredients.push('fish');
                if (mealName.includes('salad') || mealName.includes('vegetable')) sampleIngredients.push('vegetables');
                if (mealName.includes('rice')) sampleIngredients.push('rice');
                if (mealName.includes('pasta')) sampleIngredients.push('pasta');
                if (mealName.includes('egg')) sampleIngredients.push('eggs');
                if (mealName.includes('tofu')) sampleIngredients.push('tofu');
                if (mealName.includes('bean')) sampleIngredients.push('beans');

                // Default if no ingredients detected
                if (sampleIngredients.length === 0) {
                    sampleIngredients.push('vegetables', 'rice');
                }

                const analysis = sustainability.analyzeMealSustainability(sampleIngredients);

                sustainabilityQueries.create.run(
                    meal.id,
                    analysis.carbonFootprint,
                    analysis.waterFootprint,
                    analysis.isPlantBased,
                    false,
                    false,
                    analysis.sustainabilityScore
                );

                backfilledCount++;
            }
        }

        res.json({
            message: `Backfilled ${backfilledCount} meals with sustainability data`,
            totalMeals: meals.length,
            backfilledCount
        });
    } catch (error) {
        console.error('Backfill error:', error);
        res.status(500).json({ error: 'Server error during backfill' });
    }
});

export default router;
