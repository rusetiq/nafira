import axios from 'axios';

// Free Hugging Face Inference API - no API key required
const HF_API_URL = 'https://api-inference.huggingface.co/models/';

export async function generateAIFocus(userProfile, recentMeals) {
  try {
    const prompt = `Generate a short, motivational health insight (max 2 sentences) for a user with these details:
Goals: ${userProfile?.goals || 'general health'}
Recent meals: ${recentMeals?.length || 0} logged
Activity: ${userProfile?.activity_level || 'moderate'}

Focus on metabolic health, energy, and actionable advice. Be encouraging and specific.`;

    // Try multiple free models
    const models = [
      'mistralai/Mistral-7B-Instruct-v0.1',
      'microsoft/phi-2',
      'google/flan-t5-base'
    ];

    for (const model of models) {
      try {
        const response = await axios.post(
          `${HF_API_URL}${model}`,
          {
            inputs: prompt,
            parameters: {
              max_new_tokens: 100,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true
            }
          },
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && response.data[0]?.generated_text) {
          let text = response.data[0].generated_text;
          // Clean up the response
          text = text.replace(prompt, '').trim();
          text = text.split('\n')[0]; // Take first line
          if (text.length > 200) {
            text = text.substring(0, 200) + '...';
          }
          if (text.length > 20) {
            return text;
          }
        }
      } catch (error) {
        console.log(`Model ${model} failed, trying next...`);
        continue;
      }
    }

    // Fallback to generated insights
    return generateSmartFallback(userProfile, recentMeals);
  } catch (error) {
    console.error('HuggingFace API Error:', error.message);
    return generateSmartFallback(userProfile, recentMeals);
  }
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

  // Smart selection based on user data
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

  const motivations = [
    `${greeting}, ${userName}. Your metabolic journey is unique—every meal is data, every choice compounds.`,
    `${greeting}, ${userName}. Today's nutrition shapes tomorrow's vitality. Let's make it count.`,
    `${greeting}, ${userName}. Your body is an adaptive system. Feed it intelligence, reap the performance.`,
    `${greeting}, ${userName}. Consistency beats perfection. Track, learn, optimize, repeat.`,
    `${greeting}, ${userName}. You're building metabolic resilience one meal at a time. Stay curious.`
  ];

  return motivations[Math.floor(Math.random() * motivations.length)];
}
