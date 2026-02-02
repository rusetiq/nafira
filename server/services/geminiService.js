import fs from 'fs';
import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VISION_MODEL_PORT = process.env.VISION_MODEL_PORT || 5001;
const VISION_MODEL_HOST = process.env.VISION_MODEL_HOST || 'localhost';
const VISION_MODEL_URL = `http://${VISION_MODEL_HOST}:${VISION_MODEL_PORT}`;

const OPENROUTER_MODELS = [
  'google/gemma-3-27b-it:free',
  'nvidia/nemotron-nano-12b-v2-vl:free',
  'qwen/qwen-2.5-vl-7b-instruct:free',
  'google/gemma-3-12b-it:free',
  'google/gemma-3-4b-it:free'
];

const GOOGLE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash'
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

// Google AI Gemini fallback (uses GEMINI_API_KEY)
async function analyzeWithGoogleGemini(imagePath) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('[GoogleGemini] GEMINI_API_KEY not set.');
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Prepare image once
    const imageBuffer = await sharp(imagePath)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();
    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this meal image and provide a detailed nutritional assessment. Return ONLY a JSON object with: { "name": "descriptive meal name", "score": health score 0-100, "carbs": grams, "protein": grams, "fats": grams, "calories": kcal, "hydration": 0-100, "advice": "brief nutrition advice", "ingredients": ["ingredient1", "ingredient2"], "strengths": ["strength1"], "improvements": ["improvement1"] }`;

    // Try models in sequence
    for (const modelName of GOOGLE_MODELS) {
      try {
        console.log(`[GoogleGemini] Attempting analysis with ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent([
          prompt,
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }
        ]);

        const text = result.response.text();
        console.log(`[GoogleGemini] Raw response from ${modelName}:`, text);

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const normalized = normalizeAnalysis(parsed);
          console.log(`[GoogleGemini] Normalized analysis (${modelName}):`, JSON.stringify(normalized, null, 2));
          return normalized;
        }
        console.warn(`[GoogleGemini] No JSON found in ${modelName} response.`);
      } catch (innerError) {
        console.error(`[GoogleGemini] Error with ${modelName}:`, innerError.message);
        // Continue to next model in list
      }
    }

    console.error('[GoogleGemini] All Gemini models failed.');
  } catch (error) {
    console.error('[GoogleGemini] Critical error:', error.message);
  }

  return null;
}

export async function analyzeMealWithAI(imagePath, processingPreference = 'auto') {
  try {
    console.log('[Analyzer] Starting meal analysis...', { imagePath, processingPreference });

    // Try OpenRouter first
    if (processingPreference !== 'device') {
      const openRouterPromise = analyzeWithOpenRouter(imagePath);

      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve('TIMEOUT'), 20000);
      });

      // Race OpenRouter against the timeout
      const raceResult = await Promise.race([openRouterPromise, timeoutPromise]);

      if (raceResult !== 'TIMEOUT') {
        // OpenRouter returned before timeout
        if (raceResult) return raceResult;

        console.log('[Analyzer] OpenRouter failed, trying Google Gemini...');
        const gemini = await analyzeWithGoogleGemini(imagePath);
        if (gemini) return gemini;
      } else {
        // Timeout occurred, OpenRouter is still pending
        console.log('[Analyzer] OpenRouter timed out (20s), calling Gemini parallel...');
        const geminiPromise = analyzeWithGoogleGemini(imagePath);

        // Race the pending OpenRouter request against the new Gemini request
        // We want the first *successful* (non-null) result
        const parallelResult = await new Promise((resolve) => {
          let resolved = false;
          let failures = 0;

          const handleSuccess = (res, source) => {
            if (!resolved && res) {
              resolved = true;
              console.log(`[Analyzer] ${source} won the race with a valid result.`);
              resolve(res);
            } else if (!res) {
              failures++;
              if (failures === 2 && !resolved) {
                console.log('[Analyzer] Both parallel requests failed.');
                resolve(null);
              }
            }
          };

          openRouterPromise.then(res => handleSuccess(res, 'OpenRouter'));
          geminiPromise.then(res => handleSuccess(res, 'GoogleGemini'));
        });

        if (parallelResult) return parallelResult;
      }

      console.log('[Analyzer] Cloud options failed, trying device...');
    }

    // Try device model
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
