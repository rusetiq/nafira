import express from 'express';
import { upload } from '../middleware/upload.js';
import { analyzeMealWithAI } from '../services/geminiService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const mockStats = [
    { label: 'Calories', value: '~400', delta: 'Demo mode', accent: '#FD8B5D' },
    { label: 'Protein', value: '~35g', delta: 'Estimated', accent: '#FFC299' },
    { label: 'Health score', value: '85', delta: 'Average', accent: '#f54703' },
];

const mockRecentMeals = [
    {
        id: 'demo-1',
        name: 'Previous Demo Meal',
        image: '/api/uploads/demo-meal.jpg',
        score: 85,
        advice: 'Sign up to see your meal history',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        macros: { carbs: 30, protein: 35, fats: 15 },
        calories: 400,
        hydration: 70,
    },
];

router.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        console.log('[Demo] Received analyze request');
        console.log('[Demo] File:', req.file);

        const imagePath = req.file ? req.file.filename : null;

        if (!imagePath) {
            console.error('[Demo] No image file provided');
            return res.status(400).json({ error: 'Image file is required' });
        }

        const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
        const fullImagePath = path.join(uploadDir, imagePath);

        console.log('[Demo] Analyzing image:', fullImagePath);

        const analysis = await analyzeMealWithAI(fullImagePath, 'auto');

        console.log('[Demo] Analysis complete:', analysis);

        const mealName = analysis.name || req.file.originalname.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        const result = {
            id: 'demo-meal',
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
        };

        console.log('[Demo] Sending result');
        res.status(200).json(result);
    } catch (error) {
        console.error('[Demo] Analysis error:', error);
        console.error('[Demo] Error stack:', error.stack);
        res.status(500).json({
            error: 'Demo analysis failed',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

router.get('/stats', (req, res) => {
    res.json(mockStats);
});

router.get('/meals', (req, res) => {
    res.json(mockRecentMeals);
});

router.get('/ai-focus', (req, res) => {
    res.json({
        insight: 'Welcome to NAFIRA! Upload a meal to experience AI-powered nutrition analysis. Sign up for unlimited tracking and personalized insights.',
        greeting: 'Welcome to NAFIRA Demo'
    });
});

export default router;
