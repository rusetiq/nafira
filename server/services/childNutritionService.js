// Child Nutrition Service
// Calculates age-appropriate nutrition needs based on WHO guidelines

export function calculateAgeInMonths(dateOfBirth) {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months;
}

export function calculateAgeInYears(dateOfBirth) {
    return Math.floor(calculateAgeInMonths(dateOfBirth) / 12);
}

// WHO-based daily calorie requirements for children
export function calculateCalorieNeeds(dateOfBirth, gender, activityLevel = 'moderate') {
    const ageYears = calculateAgeInYears(dateOfBirth);

    const baseCalories = {
        male: {
            1: 900, 2: 1000, 3: 1200, 4: 1400, 5: 1400,
            6: 1600, 7: 1600, 8: 1800, 9: 1800, 10: 2000,
            11: 2200, 12: 2400, 13: 2600, 14: 2800, 15: 3000,
            16: 3200, 17: 3200, 18: 3000
        },
        female: {
            1: 900, 2: 1000, 3: 1200, 4: 1200, 5: 1400,
            6: 1400, 7: 1600, 8: 1600, 9: 1800, 10: 1800,
            11: 2000, 12: 2200, 13: 2200, 14: 2400, 15: 2400,
            16: 2400, 17: 2400, 18: 2400
        }
    };

    const genderKey = gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const age = Math.min(Math.max(ageYears, 1), 18);
    let calories = baseCalories[genderKey][age] || 2000;

    // Adjust for activity level
    const activityMultipliers = {
        sedentary: 0.9,
        moderate: 1.0,
        active: 1.2,
        very_active: 1.4
    };

    calories *= (activityMultipliers[activityLevel] || 1.0);

    return Math.round(calories);
}

// Calculate macronutrient needs for children
export function calculateMacroNeeds(dateOfBirth, gender, activityLevel = 'moderate') {
    const calories = calculateCalorieNeeds(dateOfBirth, gender, activityLevel);
    const ageYears = calculateAgeInYears(dateOfBirth);

    // Protein: 10-30% of calories, 1.0-1.2g per kg body weight for children
    // Carbs: 45-65% of calories
    // Fats: 25-35% of calories (higher for younger children)

    const proteinPercent = ageYears < 4 ? 0.15 : 0.20;
    const carbsPercent = 0.55;
    const fatsPercent = ageYears < 4 ? 0.35 : 0.25;

    return {
        calories,
        protein: Math.round((calories * proteinPercent) / 4), // 4 cal per gram
        carbs: Math.round((calories * carbsPercent) / 4),
        fats: Math.round((calories * fatsPercent) / 9), // 9 cal per gram
    };
}

// Calculate WHO growth percentile (simplified)
export function calculateGrowthPercentile(ageMonths, measurement, gender, type = 'weight') {
    // This is a simplified version. In production, use WHO growth charts data
    // For now, returning a placeholder percentile

    const ageYears = Math.floor(ageMonths / 12);

    // Rough estimates for average values
    const averages = {
        weight: {
            male: { 1: 10, 2: 12, 3: 14, 4: 16, 5: 18, 6: 20, 7: 22, 8: 25, 9: 28, 10: 31, 11: 35, 12: 40, 13: 45, 14: 50, 15: 56, 16: 60, 17: 64, 18: 68 },
            female: { 1: 9.5, 2: 11, 3: 13, 4: 15, 5: 17, 6: 19, 7: 21, 8: 24, 9: 27, 10: 30, 11: 34, 12: 38, 13: 43, 14: 47, 15: 50, 16: 52, 17: 54, 18: 55 }
        },
        height: {
            male: { 1: 76, 2: 87, 3: 96, 4: 103, 5: 110, 6: 116, 7: 122, 8: 128, 9: 133, 10: 138, 11: 143, 12: 149, 13: 156, 14: 164, 15: 170, 16: 173, 17: 175, 18: 176 },
            female: { 1: 74, 2: 86, 3: 95, 4: 101, 5: 108, 6: 115, 7: 121, 8: 127, 9: 133, 10: 138, 11: 144, 12: 151, 13: 157, 14: 160, 15: 162, 16: 163, 17: 163, 18: 163 }
        }
    };

    const genderKey = gender?.toLowerCase() === 'female' ? 'female' : 'male';
    const age = Math.min(Math.max(ageYears, 1), 18);
    const average = averages[type][genderKey][age] || measurement;

    // Simple percentile calculation (deviation from average)
    const deviation = ((measurement - average) / average) * 100;
    let percentile = 50 + (deviation * 0.3); // Rough approximation

    // Clamp between 1 and 99
    percentile = Math.max(1, Math.min(99, percentile));

    return Math.round(percentile);
}

// Assess malnutrition risk
export function assessMalnutritionRisk(child, latestGrowth) {
    if (!latestGrowth) {
        return { risk: 'unknown', message: 'No growth data available' };
    }

    const ageMonths = calculateAgeInMonths(child.date_of_birth);
    const weightPercentile = calculateGrowthPercentile(ageMonths, latestGrowth.weight, child.gender, 'weight');
    const heightPercentile = calculateGrowthPercentile(ageMonths, latestGrowth.height, child.gender, 'height');

    // Calculate BMI for children over 2 years
    const ageYears = Math.floor(ageMonths / 12);
    let bmi = null;
    let bmiStatus = null;

    if (ageYears >= 2) {
        const heightM = latestGrowth.height / 100;
        bmi = latestGrowth.weight / (heightM * heightM);

        if (bmi < 14) bmiStatus = 'severely underweight';
        else if (bmi < 16) bmiStatus = 'underweight';
        else if (bmi < 18.5) bmiStatus = 'normal';
        else if (bmi < 25) bmiStatus = 'healthy';
        else if (bmi < 30) bmiStatus = 'overweight';
        else bmiStatus = 'obese';
    }

    // Assess risk
    let risk = 'low';
    let message = 'Growth is within healthy range';
    const concerns = [];

    if (weightPercentile < 5) {
        risk = 'high';
        concerns.push('Weight is below 5th percentile - risk of undernutrition');
    } else if (weightPercentile < 15) {
        risk = 'moderate';
        concerns.push('Weight is below 15th percentile - monitor closely');
    }

    if (heightPercentile < 5) {
        risk = 'high';
        concerns.push('Height is below 5th percentile - possible growth stunting');
    }

    if (weightPercentile > 95) {
        risk = risk === 'high' ? 'high' : 'moderate';
        concerns.push('Weight is above 95th percentile - risk of obesity');
    }

    if (bmiStatus === 'severely underweight' || bmiStatus === 'obese') {
        risk = 'high';
        concerns.push(`BMI indicates ${bmiStatus} status`);
    }

    if (concerns.length > 0) {
        message = concerns.join('. ');
    }

    return {
        risk,
        message,
        weightPercentile,
        heightPercentile,
        bmi: bmi ? Math.round(bmi * 10) / 10 : null,
        bmiStatus
    };
}

// Get child-friendly meal suggestions
export function getChildMealSuggestions(ageYears) {
    const suggestions = {
        toddler: [ // 1-3 years
            'Soft scrambled eggs with mashed avocado',
            'Banana oatmeal pancakes',
            'Steamed sweet potato cubes',
            'Yogurt with mashed berries',
            'Mini whole grain sandwiches'
        ],
        preschool: [ // 4-5 years
            'Whole grain pasta with tomato sauce',
            'Grilled cheese with veggie soup',
            'Chicken and vegetable stir-fry',
            'Fruit smoothie with spinach',
            'Homemade pizza with veggie toppings'
        ],
        school: [ // 6-12 years
            'Turkey and cheese wrap with veggies',
            'Baked salmon with brown rice',
            'Vegetable quesadilla',
            'Chicken noodle soup with whole grain bread',
            'Veggie-packed spaghetti bolognese'
        ],
        teen: [ // 13-18 years
            'Grilled chicken salad with quinoa',
            'Beef and broccoli stir-fry',
            'Tuna poke bowl',
            'Vegetarian burrito bowl',
            'Protein smoothie bowl'
        ]
    };

    if (ageYears <= 3) return suggestions.toddler;
    if (ageYears <= 5) return suggestions.preschool;
    if (ageYears <= 12) return suggestions.school;
    return suggestions.teen;
}
