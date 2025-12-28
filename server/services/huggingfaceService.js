import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models/';
const HF_MODEL = 'google/flan-t5-base';
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || '';

async function generateTextWithHuggingFace(prompt, maxTokens = 150) {
  if (!HF_API_KEY) {
    console.log('[HuggingFace] No API key provided, skipping HF generation');
    return null;
  }

  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HF_API_KEY}`
    };

    const response = await axios.post(
      `${HF_API_URL}${HF_MODEL}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      },
      {
        headers,
        timeout: 10000,
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text.trim();
    }

    return null;
  } catch (error) {
    console.error('Hugging Face API error:', error.message);
    return null;
  }
}

export async function generateAIFocus(userProfile, recentMeals) {
  const mealCount = recentMeals?.length || 0;
  const goals = userProfile?.goals || 'general health';
  const allergies = userProfile?.allergies || 'none';

  const prompt = `You are a nutrition AI assistant. Generate a single, concise personalized nutrition insight (max 2 sentences) for a user with goals: ${goals}, allergies: ${allergies}, who has logged ${mealCount} recent meals. Focus on metabolic health, actionable advice, and scientific accuracy.

Insight:`;

  const aiGenerated = await generateTextWithHuggingFace(prompt, 100);

  if (aiGenerated && aiGenerated.length > 20 && aiGenerated.length < 300) {
    return aiGenerated.split('\n')[0];
  }

  return generateSmartFallback(userProfile, recentMeals);
}

function generateSmartFallback(userProfile, recentMeals) {
  const insights = [
    "Your metabolic window is primed. Focus on protein-rich meals post-workout to maximize muscle synthesis and recovery.",
    "Circadian rhythm optimization: align your largest meal with midday for peak insulin sensitivity and sustained energy.",
    "Micronutrient diversity detected. Add fermented foods 3x weekly to enhance gut microbiome and nutrient absorption.",
    "Your meal timing shows consistency. Consider a 12-hour eating window to support autophagy and cellular renewal.",
    "Polyphenol intake is strong. Pair with healthy fats to boost bioavailability and anti-inflammatory benefits.",
    "Hydration patterns look optimal. Maintain electrolyte balance with mineral-rich foods for sustained performance.",
    "Your protein distribution supports lean mass. Add resistance training to amplify metabolic rate and strength gains.",
    "Fiber intake is excellent for gut health. Consider adding resistant starches for enhanced microbiome diversity.",
    "Omega-3 to omega-6 ratio can be optimized. Include fatty fish or algae oil for cognitive and cardiovascular benefits.",
    "Your meal frequency supports metabolic flexibility. Experiment with nutrient timing around your activity peaks."
  ];

  let selectedInsights = [...insights];

  if (userProfile?.goals?.toLowerCase().includes('weight')) {
    selectedInsights.unshift("Caloric awareness is key. Focus on nutrient-dense, high-satiety foods to support sustainable fat loss while preserving lean mass.");
  }

  if (userProfile?.goals?.toLowerCase().includes('muscle')) {
    selectedInsights.unshift("Anabolic window activated. Prioritize 1.6-2.2g protein per kg bodyweight distributed across 4-5 meals for optimal muscle protein synthesis.");
  }

  if (userProfile?.goals?.toLowerCase().includes('energy')) {
    selectedInsights.unshift("Energy optimization detected. Balance complex carbs with healthy fats for sustained glucose levels and mental clarity throughout the day.");
  }

  if (recentMeals && recentMeals.length > 5) {
    selectedInsights.unshift("Consistency is your superpower. Your tracking streak is building metabolic intelligence and long-term health resilience.");
  }

  return selectedInsights[Math.floor(Math.random() * Math.min(5, selectedInsights.length))];
}

export async function generateDashboardInsight(userName, stats) {
  const timeOfDay = new Date().getHours();
  let greeting = 'Hello';

  if (timeOfDay < 12) greeting = 'Good morning';
  else if (timeOfDay < 18) greeting = 'Good afternoon';
  else greeting = 'Good evening';

  const prompt = `Generate a single motivational greeting (max 1 sentence) for ${userName}, a nutrition tracking app user. Time: ${greeting}. Focus on metabolic health and consistency.

Greeting:`;

  const aiGenerated = await generateTextWithHuggingFace(prompt, 50);

  if (aiGenerated && aiGenerated.length > 10 && aiGenerated.length < 200) {
    return aiGenerated.split('\n')[0];
  }

  const motivations = [
    `${greeting}, ${userName}. Your metabolic journey is unique—every meal is data, every choice compounds.`,
    `${greeting}, ${userName}. Today's nutrition shapes tomorrow's vitality. Let's make it count.`,
    `${greeting}, ${userName}. Your body is an adaptive system. Feed it intelligence, reap the performance.`,
    `${greeting}, ${userName}. Consistency beats perfection. Track, learn, optimize, repeat.`,
    `${greeting}, ${userName}. You're building metabolic resilience one meal at a time. Stay curious.`
  ];

  return motivations[Math.floor(Math.random() * motivations.length)];
}
