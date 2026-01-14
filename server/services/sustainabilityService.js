const carbonFootprintData = {
    // Animal products
    beef: 27.0,
    lamb: 39.2,
    pork: 12.1,
    chicken: 6.9,
    turkey: 10.9,
    fish: 6.1,
    salmon: 11.9,
    tuna: 6.1,
    shrimp: 26.9,
    eggs: 4.8,
    milk: 3.2,
    cheese: 13.5,
    butter: 23.8,

    // Plant-based
    tofu: 2.0,
    beans: 2.0,
    lentils: 0.9,
    chickpeas: 1.0,
    nuts: 2.3,
    rice: 2.7,
    wheat: 1.4,
    oats: 2.5,
    potatoes: 0.5,
    vegetables: 0.4,
    fruits: 0.5,
    avocado: 0.9,

    // Processed
    bread: 1.6,
    pasta: 1.5,
};

const waterFootprintData = {
    beef: 150,
    lamb: 100,
    pork: 60,
    chicken: 40,
    eggs: 30,
    cheese: 50,
    milk: 10,

    tofu: 25,
    beans: 30,
    lentils: 40,
    rice: 25,
    wheat: 15,
    vegetables: 5,
    fruits: 10,
    nuts: 50,
};

export function estimateCarbonFootprint(ingredients) {
    if (!ingredients || ingredients.length === 0) return 0;

    let totalCarbon = 0;
    let matchedIngredients = 0;

    for (const ingredient of ingredients) {
        const ingredientLower = ingredient.toLowerCase();

        for (const [food, carbon] of Object.entries(carbonFootprintData)) {
            if (ingredientLower.includes(food)) {
                totalCarbon += (carbon * 0.1);
                matchedIngredients++;
                break;
            }
        }
    }

    if (matchedIngredients === 0) {
        totalCarbon = 2.0;
    }

    return Math.round(totalCarbon * 100) / 100;
}

export function estimateWaterFootprint(ingredients) {
    if (!ingredients || ingredients.length === 0) return 0;

    let totalWater = 0;
    let matchedIngredients = 0;

    for (const ingredient of ingredients) {
        const ingredientLower = ingredient.toLowerCase();

        for (const [food, water] of Object.entries(waterFootprintData)) {
            if (ingredientLower.includes(food)) {
                totalWater += (water * 0.1);
                matchedIngredients++;
                break;
            }
        }
    }

    if (matchedIngredients === 0) {
        totalWater = 500;
    }

    return Math.round(totalWater);
}

export function isPlantBased(ingredients) {
    if (!ingredients || ingredients.length === 0) return false;

    const animalProducts = ['beef', 'pork', 'chicken', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp', 'lamb', 'meat', 'bacon', 'ham'];

    for (const ingredient of ingredients) {
        const ingredientLower = ingredient.toLowerCase();
        for (const animal of animalProducts) {
            if (ingredientLower.includes(animal)) {
                return false;
            }
        }
    }

    return true;
}

export function isSeasonalFood(ingredient, month = new Date().getMonth()) {
    const seasonalFoods = {
        winter: ['cabbage', 'kale', 'brussels sprouts', 'citrus', 'orange', 'grapefruit', 'pomegranate', 'squash', 'sweet potato'],
        spring: ['asparagus', 'peas', 'artichoke', 'strawberry', 'rhubarb', 'spinach', 'lettuce'],
        summer: ['tomato', 'cucumber', 'zucchini', 'corn', 'peach', 'berry', 'watermelon', 'pepper'],
        fall: ['apple', 'pumpkin', 'squash', 'grape', 'pear', 'broccoli', 'cauliflower']
    };

    let season;
    if (month >= 11 || month <= 1) season = 'winter';
    else if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else season = 'fall';

    const ingredientLower = ingredient.toLowerCase();
    return seasonalFoods[season].some(food => ingredientLower.includes(food));
}

export function calculateSustainabilityScore(ingredients) {
    let score = 40;

    const carbon = estimateCarbonFootprint(ingredients);
    const water = estimateWaterFootprint(ingredients);
    const plantBased = isPlantBased(ingredients);

    if (carbon < 1) score += 25;
    else if (carbon < 2) score += 15;
    else if (carbon < 3) score += 5;
    else if (carbon > 5) score -= 15;
    else if (carbon > 3) score -= 5;

    if (water < 20) score += 15;
    else if (water < 50) score += 5;
    else if (water > 100) score -= 10;
    else if (water > 50) score -= 5;
    if (plantBased) score += 15;

    const seasonalCount = ingredients.filter(ing => isSeasonalFood(ing)).length;
    score += Math.min(seasonalCount * 3, 10);

    return Math.max(0, Math.min(100, Math.round(score)));
}

export function getSustainabilityTips(score, ingredients) {
    const tips = [];

    const plantBased = isPlantBased(ingredients);
    const carbon = estimateCarbonFootprint(ingredients);

    if (!plantBased) {
        tips.push('Try replacing meat with plant-based proteins like beans, lentils, or tofu');
    }

    if (carbon > 5) {
        tips.push('Choose chicken or fish instead of beef or lamb to reduce carbon footprint');
    }

    const seasonalCount = ingredients.filter(ing => isSeasonalFood(ing)).length;
    if (seasonalCount < ingredients.length / 2) {
        tips.push('Choose seasonal produce to reduce environmental impact');
    }

    tips.push('Buy local when possible to reduce transportation emissions');
    tips.push('Reduce food waste by planning meals and storing food properly');

    return tips;
}

export function analyzeMealSustainability(ingredients) {
    const carbon = estimateCarbonFootprint(ingredients);
    const water = estimateWaterFootprint(ingredients);
    const plantBased = isPlantBased(ingredients);
    const score = calculateSustainabilityScore(ingredients);
    const tips = getSustainabilityTips(score, ingredients);

    return {
        carbonFootprint: carbon,
        waterFootprint: water,
        isPlantBased: plantBased,
        sustainabilityScore: score,
        tips,
        rating: score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor'
    };
}
