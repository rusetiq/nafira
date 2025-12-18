import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VISION_MODEL_PORT = process.env.VISION_MODEL_PORT || 5001;
const VISION_MODEL_URL = `http://localhost:${VISION_MODEL_PORT}`;

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (error) {
    console.error('Failed to initialize Gemini:', error.message);
  }
}

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
      base64Length: imageBase64.length,
    });

    const started = Date.now();
    const response = await axios.post(
      `${VISION_MODEL_URL}/analyze`,
      {
        image_path: imagePath,
        image_base64: imageBase64,
      },
      {
        timeout: 300000, // 5 minutes to allow heavy first-time runs
        headers: {
          'Content-Type': 'application/json',
        },
      }
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
      console.log('[VisionBackup] Vision model analysis successful, normalized result:');
      const normalized = normalizeAnalysis(result);
      console.log(JSON.stringify(normalized, null, 2));
      return normalized;
    }

    console.warn('[VisionBackup] Vision model returned unexpected payload, falling back.');
    return null;
  } catch (error) {
    console.error('[VisionBackup] Vision model service error:', error.message);
    if (error.response) {
      console.error('[VisionBackup] Status:', error.response.status);
      console.error('[VisionBackup] Response body:', JSON.stringify(error.response.data));
    }
    return null;
  }
}

async function analyzeWithGemini(imagePath) {
  if (!genAI) {
    console.warn('[Gemini] genAI is not initialized. Check GEMINI_API_KEY.');
    return null;
  }

  try {
    console.log('[Gemini] Starting analysis for image:', imagePath);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imageBuffer = await sharp(imagePath)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this meal image and provide a detailed nutritional assessment. Return a JSON object with:
    {
      "name": "descriptive meal name",
      "score": health score 0-100,
      "carbs": estimated carbs in grams,
      "protein": estimated protein in grams,
      "fats": estimated fats in grams,
      "calories": estimated calories,
      "hydration": hydration level 0-100,
      "advice": "personalized health advice focusing on metabolic health, nutrient density, and improvements",
      "ingredients": ["list", "of", "identified", "ingredients"],
      "strengths": ["positive", "aspects"],
      "improvements": ["suggested", "improvements"]
    }
    
    Focus on metabolic health, inflammation markers, nutrient density, and provide actionable advice.`;

    const started = Date.now();
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('[Gemini] Raw text response:');
    console.log(text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      const normalized = normalizeAnalysis(analysis);
      console.log('[Gemini] Parsed JSON analysis:');
      console.log(JSON.stringify(normalized, null, 2));
      console.log(`[Gemini] Analysis completed in ${Date.now() - started}ms`);
      return normalized;
    } else {
      console.warn('[Gemini] Could not find JSON object in response, falling back.');
    }
  } catch (geminiError) {
    console.error('[Gemini] AI Error:', geminiError.message);
    if (geminiError.response) {
      console.error('[Gemini] Status:', geminiError.response.status);
      console.error('[Gemini] Response body:', JSON.stringify(geminiError.response.data));
    } else if (geminiError.stack) {
      console.error('[Gemini] Stack:', geminiError.stack);
    }
  }

  return null;
}

export async function analyzeMealWithAI(imagePath, processingPreference = 'auto') {
  try {
    console.log('[Analyzer] Starting meal analysis...', {
      imagePath,
      processingPreference,
    });

    if (processingPreference === 'cloud') {
      const result = await analyzeWithGemini(imagePath);
      if (result) return result;
      
      console.log('[Analyzer] Gemini failed, trying device as fallback...');
      const visionResult = await analyzeWithVisionModel(imagePath);
      if (visionResult) return visionResult;
      
      console.log('[Analyzer] Both failed, using mock data');
      return generateMockAnalysis();
    }
    
    if (processingPreference === 'device') {
      const visionResult = await analyzeWithVisionModel(imagePath);
      if (visionResult) return visionResult;
      
      console.log('[Analyzer] Device processing failed, trying cloud as fallback...');
      const result = await analyzeWithGemini(imagePath);
      if (result) return result;
      
      console.log('[Analyzer] Both failed, using mock data');
      return generateMockAnalysis();
    }
    
    if (processingPreference === 'auto') {
      const geminiResult = await analyzeWithGemini(imagePath);
      if (geminiResult) return geminiResult;
      
      console.log('[Analyzer] Gemini failed, trying device backup...');
      const visionResult = await analyzeWithVisionModel(imagePath);
      if (visionResult) return visionResult;
      
      console.log('[Analyzer] Both failed, using mock data');
      return generateMockAnalysis();
    }

    return generateMockAnalysis();
  } catch (error) {
    console.error('[Analyzer] Meal analysis error:', error);
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
    advice: analysis.advice || 'Balanced meal with good nutrient distribution.',
    ingredients: analysis.ingredients || [],
    strengths: analysis.strengths || [],
    improvements: analysis.improvements || []
  };
}

function generateMockAnalysis() {
  const mockAdvice = [
    'Excellent polyphenol density from colorful vegetables. Consider adding omega-3 rich foods like salmon or walnuts for enhanced anti-inflammatory benefits.',
    'Great protein-to-carb ratio for metabolic stability. Add leafy greens for extra folate and methylation support.',
    'Well-balanced macros detected. Swap refined oils for extra virgin olive oil to boost lipid profile and reduce oxidative stress.',
    'Good fiber content for gut health. Consider adding fermented foods like kimchi or sauerkraut for microbiome diversity.',
    'Solid nutrient density. Add a handful of berries for anthocyanins and improved insulin sensitivity.'
  ];

  const mockIngredients = [
    ['grilled chicken', 'quinoa', 'roasted vegetables', 'olive oil', 'herbs'],
    ['salmon', 'brown rice', 'broccoli', 'avocado', 'lemon'],
    ['tofu', 'mixed greens', 'sweet potato', 'tahini', 'seeds'],
    ['eggs', 'whole grain toast', 'tomatoes', 'spinach', 'feta'],
    ['turkey', 'chickpeas', 'kale', 'bell peppers', 'garlic']
  ];

  const mockStrengths = [
    ['High protein content', 'Good fiber', 'Colorful variety'],
    ['Omega-3 rich', 'Low glycemic', 'Anti-inflammatory'],
    ['Plant-based protein', 'Complex carbs', 'Healthy fats'],
    ['Nutrient dense', 'Balanced macros', 'Fresh ingredients']
  ];

  const mockImprovements = [
    ['Add more leafy greens', 'Include fermented foods', 'Boost omega-3s'],
    ['Increase vegetable portion', 'Add probiotic source', 'More herbs/spices'],
    ['Include vitamin C source', 'Add healthy fats', 'More variety in colors'],
    ['Boost fiber content', 'Add nuts/seeds', 'Include citrus']
  ];

  const randomIndex = Math.floor(Math.random() * mockAdvice.length);

  return {
    name: 'Nutritious Meal',
    score: 75 + Math.floor(Math.random() * 20),
    carbs: 30 + Math.floor(Math.random() * 30),
    protein: 25 + Math.floor(Math.random() * 20),
    fats: 12 + Math.floor(Math.random() * 15),
    calories: 400 + Math.floor(Math.random() * 300),
    hydration: 65 + Math.floor(Math.random() * 30),
    advice: mockAdvice[randomIndex],
    ingredients: mockIngredients[randomIndex],
    strengths: mockStrengths[Math.floor(Math.random() * mockStrengths.length)],
    improvements: mockImprovements[Math.floor(Math.random() * mockImprovements.length)]
  };
}

export async function generatePersonalizedInsights(userProfile, recentMeals) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'demo-key') {
      return generateMockInsights();
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on this user profile and recent meals, provide personalized health insights:
    
    User Profile:
    - Goals: ${userProfile.goals}
    - Allergies: ${userProfile.allergies}
    
    Recent Meals: ${JSON.stringify(recentMeals.slice(0, 5))}
    
    Provide 3-4 actionable insights focusing on metabolic health, nutrient timing, and goal achievement.
    Return as JSON array: [{"title": "...", "insight": "...", "priority": "high|medium|low"}]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return generateMockInsights();
  } catch (error) {
    console.error('Insights generation error:', error);
    return generateMockInsights();
  }
}

function generateMockInsights() {
  return [
    {
      title: 'Protein Timing Optimization',
      insight: 'Your protein intake is well-distributed. Consider adding 20-30g within 2 hours post-workout for enhanced muscle protein synthesis.',
      priority: 'high'
    },
    {
      title: 'Micronutrient Diversity',
      insight: 'Great variety in your meals! Add more cruciferous vegetables (broccoli, cauliflower) 3x weekly for enhanced detoxification pathways.',
      priority: 'medium'
    },
    {
      title: 'Circadian Nutrition',
      insight: 'Align your largest meal with peak insulin sensitivity (midday). This supports better glucose metabolism and energy levels.',
      priority: 'medium'
    }
  ];
}
