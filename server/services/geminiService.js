import fs from 'fs';
import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VISION_MODEL_PORT = process.env.VISION_MODEL_PORT || 5001;
const VISION_MODEL_HOST = process.env.VISION_MODEL_HOST || 'localhost';
const VISION_MODEL_URL = `http://${VISION_MODEL_HOST}:${VISION_MODEL_PORT}`;

const OPENROUTER_MODELS = [
  'google/gemini-2.0-flash-exp:free',
  'openai/gpt-4o-mini'
];

async function checkVisionModelAvailable() {
  try {
    const response = await axios.get(`${VISION_MODEL_URL}/health`, { timeout: 2000 });
    return response.data.model_loaded === true;
  } catch (error) {
    console.error('Vision model health check failed:', error.message);
    return false;
  }
}

async function analyzeWithVisionModel(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error('[VisionBackup] Image not found:', imagePath);
      return null;
    }

    const isAvailable = await checkVisionModelAvailable();
    if (!isAvailable) {
      console.error('[VisionBackup] Vision model server not available or model not loaded');
      return null;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    console.log('[VisionBackup] Sending request to vision model server...', {
      url: `${VISION_MODEL_URL}/analyze`,
      imagePath,
      base64Length: imageBase64.length
    });

    const started = Date.now();

    const response = await axios.post(
      `${VISION_MODEL_URL}/analyze`,
      { image_path: imagePath, image_base64: imageBase64 },
      { timeout: 300000, headers: { 'Content-Type': 'application/json' } }
    );

    const duration = Date.now() - started;
    const result = response.data;

    console.log('[VisionBackup] Raw vision model response:', JSON.stringify(result, null, 2));
    console.log(`[VisionBackup] Vision model request completed in ${duration}ms`);

    if (result.error && result.fallback) {
      console.error('[VisionBackup] Vision model error:', result.error);
      return null;
    }

    if (result.name || result.score !== undefined) {
      const normalized = normalizeAnalysis(result);
      console.log('[VisionBackup] Normalized result:', JSON.stringify(normalized, null, 2));
      return normalized;
    }

    console.warn('[VisionBackup] Unexpected payload, falling back.');
    return null;
  } catch (error) {
    console.error('[VisionBackup] Service error:', error.message);
    if (error.response) {
      console.error('[VisionBackup] Status:', error.response.status);
      console.error('[VisionBackup] Response body:', JSON.stringify(error.response.data));
    }
    return null;
  }
}

async function callOpenRouter(model, base64Image, prompt) {
  console.log('[OpenRouter] Calling model:', model);
  return axios.post(
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
      }
    }
  );
}

async function analyzeWithOpenRouter(imagePath) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your-openrouter-api-key-here') {
    console.warn('[OpenRouter] OPENROUTER_API_KEY not set.');
    return null;
  }

  try {
    console.log('[OpenRouter] Starting analysis for image:', imagePath);

    const imageBuffer = await sharp(imagePath)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this meal image and provide a detailed nutritional assessment. Return a JSON object with: { "name": "descriptive meal name", "score": health score 0-100, "carbs": grams, "protein": grams, "fats": grams, "calories": kcal, "hydration": 0-100, "advice": "...", "ingredients": [], "strengths": [], "improvements": [] }`;

    for (const model of OPENROUTER_MODELS) {
      try {
        const started = Date.now();
        const response = await callOpenRouter(model, base64Image, prompt);
        const duration = Date.now() - started;

        const text = response.data.choices[0].message.content;
        console.log(`[OpenRouter] Raw response (${model}, ${duration}ms):`);
        console.log(text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const normalized = normalizeAnalysis(parsed);
          console.log('[OpenRouter] Normalized analysis:', JSON.stringify(normalized, null, 2));
          return normalized;
        }

        console.warn('[OpenRouter] No JSON found in response.');
      } catch (error) {
        if (error.response) {
          console.error(`[OpenRouter] Error from ${model}:`, error.response.status);
          console.error('[OpenRouter] Response body:', JSON.stringify(error.response.data));
          if (error.response.status === 429) {
            console.warn('[OpenRouter] Rate limited, trying next model...');
            continue;
          }
        }
        throw error;
      }
    }
  } catch (error) {
    console.error('[OpenRouter] Fatal error:', error.message);
    if (error.stack) console.error(error.stack);
  }

  return null;
}

export async function analyzeMealWithAI(imagePath, processingPreference = 'auto') {
  try {
    console.log('[Analyzer] Starting meal analysis...', { imagePath, processingPreference });

    if (processingPreference !== 'device') {
      const cloud = await analyzeWithOpenRouter(imagePath);
      if (cloud) return cloud;
      console.log('[Analyzer] Cloud failed, trying device...');
    }

    if (processingPreference !== 'cloud') {
      const device = await analyzeWithVisionModel(imagePath);
      if (device) return device;
      console.log('[Analyzer] Device failed.');
    }

    console.log('[Analyzer] Falling back to mock analysis.');
    return generateMockAnalysis();
  } catch (error) {
    console.error('[Analyzer] Unexpected error:', error);
    return generateMockAnalysis();
  }
}

function normalizeAnalysis(analysis) {
  return {
    name: analysis.name || 'Analyzed Meal',
    score: Math.min(100, Math.max(0, parseInt(analysis.score) || 75)),
    carbs: Math.max(0, parseFloat(analysis.carbs) || 35),
    protein: Math.max(0, parseFloat(analysis.protein) || 25),
    fats: Math.max(0, parseFloat(analysis.fats) || 15),
    calories: Math.max(0, parseInt(analysis.calories) || 450),
    hydration: Math.min(100, Math.max(0, parseInt(analysis.hydration) || 70)),
    advice: analysis.advice || '',
    ingredients: analysis.ingredients || [],
    strengths: analysis.strengths || [],
    improvements: analysis.improvements || []
  };
}

function generateMockAnalysis() {
  console.warn('[Mock] Returning mock meal analysis');
  return {
    name: 'Nutritious Meal',
    score: 80,
    carbs: 40,
    protein: 30,
    fats: 15,
    calories: 500,
    hydration: 75,
    advice: 'Solid nutrient balance.',
    ingredients: ['whole foods'],
    strengths: ['Balanced macros'],
    improvements: ['Add fermented foods']
  };
}

export async function generatePersonalizedInsights(userProfile, recentMeals) {
  console.warn('[Insights] Using mock insights');
  return generateMockInsights();
}

function generateMockInsights() {
  return [
    {
      title: 'Protein Timing Optimization',
      insight: 'Increase protein intake post-exercise.',
      priority: 'high'
    }
  ];
}
