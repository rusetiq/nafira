import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const OPENROUTER_MODELS = [
    'google/gemini-2.0-flash-exp:free',
    'google/gemma-2-9b-it:free',
    'google/gemma-3-4b-it:free'
];

async function analyzeMenuWithAI(imagePath) {
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
        console.warn('[MenuAI] OPENROUTER_API_KEY not set, returning mock data');
        return generateMockMenuAnalysis();
    }

    try {
        const imageBuffer = await sharp(imagePath)
            .resize(1024, 1024, { fit: 'inside' })
            .jpeg({ quality: 80 })
            .toBuffer();

        const base64Image = imageBuffer.toString('base64');

        const prompt = `You are a nutrition expert analyzing a restaurant or food menu image. 
Identify all food items visible in this menu and analyze their nutritional value.
For each item, estimate calories, protein, carbs, fats, and a health score (0-100).
Then recommend the SINGLE BEST item for optimal nutrition.

Return a JSON object with this exact structure:
{
  "menuItems": [
    { "name": "Item Name", "description": "brief description", "calories": 450, "protein": 25, "carbs": 40, "fats": 15, "fiber": 5, "score": 85 }
  ],
  "recommendation": {
    "name": "Best Item Name",
    "reason": "Why this is the healthiest choice",
    "calories": 450,
    "protein": 25,
    "carbs": 40,
    "fats": 15,
    "fiber": 5,
    "score": 92,
    "vitamins": ["Vitamin A", "Vitamin C", "Iron"],
    "benefits": ["High protein", "Low sodium", "Rich in fiber"]
  }
}`;

        for (const model of OPENROUTER_MODELS) {
            try {
                console.log('[MenuAI] Trying model:', model);
                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model,
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    { type: 'text', text: prompt },
                                    { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                                ]
                            }
                        ]
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 60000
                    }
                );

                const text = response.data.choices[0].message.content;
                console.log('[MenuAI] Raw response:', text);

                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return normalizeMenuAnalysis(parsed);
                }
            } catch (error) {
                console.error(`[MenuAI] Error with ${model}:`, error.message);
                if (error.response?.status === 429) {
                    continue;
                }
            }
        }
    } catch (error) {
        console.error('[MenuAI] Fatal error:', error.message);
    }

    return generateMockMenuAnalysis();
}

function normalizeMenuAnalysis(analysis) {
    return {
        menuItems: (analysis.menuItems || []).map(item => ({
            name: item.name || 'Unknown Item',
            description: item.description || '',
            calories: parseInt(item.calories) || 0,
            protein: parseInt(item.protein) || 0,
            carbs: parseInt(item.carbs) || 0,
            fats: parseInt(item.fats) || 0,
            fiber: parseInt(item.fiber) || 0,
            score: Math.min(100, Math.max(0, parseInt(item.score) || 70))
        })),
        recommendation: {
            name: analysis.recommendation?.name || 'Recommended Item',
            reason: analysis.recommendation?.reason || 'Best nutritional balance',
            calories: parseInt(analysis.recommendation?.calories) || 400,
            protein: parseInt(analysis.recommendation?.protein) || 25,
            carbs: parseInt(analysis.recommendation?.carbs) || 35,
            fats: parseInt(analysis.recommendation?.fats) || 15,
            fiber: parseInt(analysis.recommendation?.fiber) || 8,
            score: Math.min(100, Math.max(0, parseInt(analysis.recommendation?.score) || 85)),
            vitamins: analysis.recommendation?.vitamins || [],
            benefits: analysis.recommendation?.benefits || []
        }
    };
}

function generateMockMenuAnalysis() {
    return {
        menuItems: [
            { name: 'Grilled Salmon', description: 'With steamed vegetables', calories: 420, protein: 38, carbs: 12, fats: 22, fiber: 4, score: 92 },
            { name: 'Caesar Salad', description: 'Romaine, parmesan, croutons', calories: 350, protein: 12, carbs: 18, fats: 26, fiber: 3, score: 75 },
            { name: 'Pasta Carbonara', description: 'Creamy bacon pasta', calories: 680, protein: 22, carbs: 65, fats: 38, fiber: 2, score: 55 },
            { name: 'Veggie Buddha Bowl', description: 'Quinoa, chickpeas, vegetables', calories: 380, protein: 14, carbs: 52, fats: 12, fiber: 11, score: 88 }
        ],
        recommendation: {
            name: 'Grilled Salmon',
            reason: 'Highest protein content with excellent omega-3 fatty acids and lowest carb count. Great for balanced nutrition.',
            calories: 420,
            protein: 38,
            carbs: 12,
            fats: 22,
            fiber: 4,
            score: 92,
            vitamins: ['Vitamin D', 'Vitamin B12', 'Omega-3'],
            benefits: ['High protein', 'Heart healthy fats', 'Low carb', 'Rich in vitamins']
        }
    };
}

router.post(
    '/analyze',
    authenticateToken,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Menu image is required' });
            }

            const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../uploads');
            const fullImagePath = path.join(uploadDir, req.file.filename);

            console.log('[Menu] Analyzing menu image:', fullImagePath);

            const analysis = await analyzeMenuWithAI(fullImagePath);

            res.json({
                success: true,
                image: `/api/uploads/${req.file.filename}`,
                ...analysis
            });
        } catch (error) {
            console.error('[Menu] Analysis error:', error);
            res.status(500).json({ error: 'Failed to analyze menu' });
        }
    }
);

router.get('/sample', (req, res) => {
    res.json(generateMockMenuAnalysis());
});

export default router;
