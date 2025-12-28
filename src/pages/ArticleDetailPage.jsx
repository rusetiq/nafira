import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Book, CheckCircle } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import GradientText from '../components/GradientText';
import DitheredBackground from '../components/DitheredBackground';

const articles = {
    1: {
        title: 'Understanding Macronutrients',
        category: 'Nutrition Basics',
        readingTime: 5,
        difficulty: 'beginner',
        content: `
# Understanding Macronutrients

Macronutrients are the nutrients your body needs in large amounts to function properly. They provide energy and support various bodily functions.

## The Three Main Macronutrients

### 1. Carbohydrates
Carbohydrates are your body's primary energy source. They break down into glucose, which fuels your cells, tissues, and organs.

**Types of Carbohydrates:**
- **Simple Carbs**: Found in fruits, milk, and processed sugars
- **Complex Carbs**: Found in whole grains, vegetables, and legumes

**Recommended Intake:** 45-65% of daily calories

### 2. Proteins
Proteins are essential for building and repairing tissues, making enzymes and hormones, and supporting immune function.

**Complete Protein Sources:**
- Meat, fish, poultry
- Eggs and dairy
- Quinoa and soy

**Plant-Based Sources:**
- Beans and lentils
- Nuts and seeds
- Whole grains

**Recommended Intake:** 10-35% of daily calories

### 3. Fats
Fats are crucial for hormone production, nutrient absorption, and cell membrane integrity.

**Healthy Fats:**
- Monounsaturated: Olive oil, avocados, nuts
- Polyunsaturated: Fatty fish, walnuts, flaxseeds
- Omega-3s: Salmon, chia seeds, hemp seeds

**Limit:**
- Saturated fats
- Trans fats

**Recommended Intake:** 20-35% of daily calories

## Balancing Your Macros

The ideal macro ratio depends on your:
- Age and gender
- Activity level
- Health goals
- Metabolic health

## Practical Tips

1. **Track your intake** using NAFIRA's meal analysis
2. **Choose whole foods** over processed options
3. **Balance each meal** with all three macros
4. **Adjust based on goals** (weight loss, muscle gain, maintenance)

## Key Takeaways

- All three macronutrients are essential
- Quality matters more than quantity
- Individual needs vary
- Balance is key for optimal health
    `
    },
    2: {
        title: 'The Importance of Micronutrients',
        category: 'Nutrition Basics',
        readingTime: 7,
        difficulty: 'beginner',
        content: `
# The Importance of Micronutrients

While needed in smaller amounts than macronutrients, micronutrients are vital for health, growth, and disease prevention.

## Vitamins

### Fat-Soluble Vitamins
**Vitamin A**: Vision, immune function, skin health
- Sources: Carrots, sweet potatoes, spinach

**Vitamin D**: Bone health, immune function
- Sources: Sunlight, fatty fish, fortified foods

**Vitamin E**: Antioxidant, skin health
- Sources: Nuts, seeds, vegetable oils

**Vitamin K**: Blood clotting, bone health
- Sources: Leafy greens, broccoli

### Water-Soluble Vitamins
**B Vitamins**: Energy production, brain function
- B12: Meat, fish, dairy
- Folate: Leafy greens, legumes
- B6: Poultry, fish, potatoes

**Vitamin C**: Immune function, collagen production
- Sources: Citrus fruits, berries, peppers

## Minerals

### Major Minerals
**Calcium**: Bone health, muscle function
- Sources: Dairy, leafy greens, fortified foods

**Magnesium**: Muscle and nerve function
- Sources: Nuts, seeds, whole grains

**Potassium**: Blood pressure, fluid balance
- Sources: Bananas, potatoes, beans

### Trace Minerals
**Iron**: Oxygen transport
- Sources: Red meat, beans, fortified cereals

**Zinc**: Immune function, wound healing
- Sources: Meat, shellfish, legumes

**Selenium**: Antioxidant, thyroid function
- Sources: Brazil nuts, fish, eggs

## Deficiency Signs

Watch for:
- Fatigue and weakness
- Poor immune function
- Brittle nails and hair
- Slow wound healing
- Mood changes

## How to Get Enough

1. **Eat a rainbow** of fruits and vegetables
2. **Include variety** in your diet
3. **Choose whole foods** over supplements when possible
4. **Consider supplementation** if deficient
5. **Get tested** if you suspect deficiency

## Special Considerations

**Pregnant women**: Need more folate, iron, calcium
**Vegans**: May need B12, iron, zinc supplements
**Elderly**: Often need vitamin D, B12, calcium
**Athletes**: May need more iron, magnesium

## Key Takeaways

- Micronutrients are essential despite small quantities needed
- Variety is key to meeting all needs
- Whole foods are the best source
- Deficiencies can have serious health impacts
    `
    },
    3: {
        title: 'Plant-Based Nutrition',
        category: 'Sustainable Eating',
        readingTime: 10,
        difficulty: 'intermediate',
        content: `
# Plant-Based Nutrition

A well-planned plant-based diet can provide all the nutrients you need while benefiting your health and the planet.

## Benefits of Plant-Based Eating

### Health Benefits
- Lower risk of heart disease
- Better weight management
- Reduced cancer risk
- Improved digestion
- Lower cholesterol

### Environmental Benefits
- Reduced carbon footprint
- Less water usage
- Lower land use
- Decreased pollution
- Better for biodiversity

## Getting Complete Nutrition

### Protein
**Complete Plant Proteins:**
- Quinoa
- Soy (tofu, tempeh, edamame)
- Buckwheat
- Hemp seeds
- Chia seeds

**Protein Combining:**
- Rice + beans
- Hummus + whole grain pita
- Peanut butter + whole grain bread

**Daily Goal:** 0.8-1.0g per kg body weight

### Essential Nutrients to Watch

**Vitamin B12**
- Fortified foods (plant milk, cereals)
- Nutritional yeast
- Supplement recommended

**Iron**
- Legumes, tofu, quinoa
- Pair with vitamin C for absorption
- Cook in cast iron

**Calcium**
- Fortified plant milk
- Leafy greens (kale, collards)
- Tofu (calcium-set)
- Almonds

**Omega-3 Fatty Acids**
- Flaxseeds, chia seeds
- Walnuts
- Algae-based supplements

**Vitamin D**
- Sunlight exposure
- Fortified foods
- Supplement if needed

**Zinc**
- Legumes, nuts, seeds
- Whole grains
- Nutritional yeast

## Sample Meal Plan

**Breakfast:**
- Oatmeal with berries, nuts, and flaxseeds
- Fortified plant milk

**Lunch:**
- Quinoa bowl with roasted vegetables
- Chickpeas and tahini dressing

**Dinner:**
- Lentil curry with brown rice
- Side of steamed broccoli

**Snacks:**
- Hummus with vegetables
- Fruit and nut butter
- Trail mix

## Transitioning Tips

1. **Start gradually** - Add more plant meals weekly
2. **Explore new foods** - Try different grains, legumes
3. **Find substitutes** - Plant milk, meat alternatives
4. **Plan ahead** - Meal prep for success
5. **Join communities** - Connect with others

## Common Mistakes to Avoid

- Relying too much on processed foods
- Not eating enough calories
- Ignoring B12 supplementation
- Not planning balanced meals
- Giving up too quickly

## Key Takeaways

- Plant-based diets can be nutritionally complete
- Planning is essential for success
- Variety ensures adequate nutrition
- Benefits extend beyond personal health
- Gradual transition often works best
    `
    },
    4: {
        title: 'Child Nutrition Guidelines',
        category: 'Child Health',
        readingTime: 8,
        difficulty: 'beginner',
        content: `
# Child Nutrition Guidelines

Proper nutrition during childhood is crucial for growth, development, and establishing healthy eating habits.

## Age-Specific Needs

### Toddlers (1-3 years)
**Calories:** 1,000-1,400 per day
**Key Nutrients:** Iron, calcium, vitamin D
**Portion Sizes:** Small, frequent meals

**Meal Ideas:**
- Soft scrambled eggs with mashed avocado
- Banana oatmeal pancakes
- Steamed sweet potato cubes
- Yogurt with mashed berries

### Preschoolers (4-5 years)
**Calories:** 1,200-1,600 per day
**Focus:** Variety and balanced meals
**Challenges:** Picky eating

**Meal Ideas:**
- Whole grain pasta with tomato sauce
- Grilled cheese with veggie soup
- Fruit smoothies with hidden spinach
- Mini whole grain sandwiches

### School-Age (6-12 years)
**Calories:** 1,600-2,200 per day
**Focus:** Nutrient-dense foods
**Important:** Breakfast and healthy snacks

**Meal Ideas:**
- Turkey and cheese wrap with veggies
- Baked salmon with brown rice
- Vegetable quesadilla
- Chicken noodle soup

### Teens (13-18 years)
**Calories:** 2,000-3,000 per day
**Focus:** Calcium, iron, protein
**Challenges:** Fast food, peer pressure

**Meal Ideas:**
- Grilled chicken salad with quinoa
- Beef and broccoli stir-fry
- Protein smoothie bowls
- Vegetarian burrito bowls

## Essential Nutrients for Children

### Calcium
**Why:** Bone development
**Sources:** Dairy, fortified plant milk, leafy greens
**Daily Need:** 700-1,300mg depending on age

### Iron
**Why:** Cognitive development, energy
**Sources:** Lean meat, beans, fortified cereals
**Daily Need:** 7-15mg depending on age

### Vitamin D
**Why:** Bone health, immune function
**Sources:** Fortified milk, fatty fish, sunlight
**Daily Need:** 600 IU

### Protein
**Why:** Growth and development
**Sources:** Meat, fish, eggs, legumes, dairy
**Daily Need:** 13-52g depending on age

## Healthy Eating Habits

### Establish Routine
- Regular meal times
- Family meals together
- No distractions (TV, phones)

### Encourage Variety
- Offer new foods multiple times
- Make food fun and colorful
- Involve kids in cooking

### Limit Unhealthy Foods
- Reduce added sugars
- Limit processed foods
- Control portion sizes
- Avoid sugary drinks

### Positive Food Environment
- Don't use food as reward/punishment
- Model healthy eating
- Keep healthy snacks available
- Be patient with picky eaters

## Warning Signs

Watch for:
- Sudden weight changes
- Lack of energy
- Poor concentration
- Frequent illness
- Delayed growth

## Tips for Picky Eaters

1. **Offer choices** within healthy options
2. **Make it fun** - creative presentations
3. **Be patient** - may take 10+ exposures
4. **Don't force** - creates negative associations
5. **Involve them** in meal planning and prep

## Key Takeaways

- Nutritional needs change with age
- Variety and balance are essential
- Establish healthy habits early
- Model good eating behaviors
- Seek help if concerned about growth
    `
    },
    5: {
        title: 'Preventing Malnutrition',
        category: 'Child Health',
        readingTime: 12,
        difficulty: 'intermediate',
        content: `
# Preventing Malnutrition

Malnutrition affects millions of children worldwide. Understanding prevention and early intervention is crucial.

## Types of Malnutrition

### Undernutrition
**Stunting:** Low height for age
**Wasting:** Low weight for height
**Underweight:** Low weight for age

### Micronutrient Deficiencies
- Iron deficiency (anemia)
- Vitamin A deficiency
- Iodine deficiency
- Zinc deficiency

### Overnutrition
- Overweight and obesity
- Associated health risks

## Risk Factors

### Socioeconomic
- Poverty
- Food insecurity
- Limited access to healthcare
- Poor sanitation

### Health-Related
- Chronic illness
- Digestive disorders
- Eating disorders
- Medication side effects

### Behavioral
- Poor feeding practices
- Limited dietary variety
- Excessive junk food
- Inadequate meal frequency

## Warning Signs

### Physical Signs
- Failure to gain weight
- Loss of muscle mass
- Fatigue and weakness
- Delayed wound healing
- Frequent infections

### Behavioral Signs
- Irritability
- Lack of interest in food
- Poor concentration
- Delayed development

### Growth Indicators
- Falling off growth curve
- Below 5th percentile
- Crossing percentile lines

## Prevention Strategies

### Adequate Nutrition
**Infants (0-6 months):**
- Exclusive breastfeeding
- Proper latch and feeding frequency

**Infants (6-12 months):**
- Continue breastfeeding
- Introduce iron-rich complementary foods
- Offer variety of textures

**Toddlers & Children:**
- Balanced meals with all food groups
- Regular meal and snack times
- Appropriate portion sizes

### Micronutrient Focus

**Iron-Rich Foods:**
- Lean meats
- Fortified cereals
- Beans and lentils
- Dark leafy greens

**Vitamin A Sources:**
- Orange vegetables (carrots, sweet potato)
- Dark leafy greens
- Fortified foods

**Zinc Sources:**
- Meat and poultry
- Beans and nuts
- Whole grains

### Monitoring Growth

Use NAFIRA's child tracking to:
- Record weight and height regularly
- Track growth percentiles
- Identify concerning trends early
- Get personalized nutrition recommendations

## Treatment Approaches

### Mild Malnutrition
- Increase meal frequency
- Nutrient-dense foods
- Fortified foods
- Regular monitoring

### Moderate Malnutrition
- Medical supervision
- Therapeutic foods
- Micronutrient supplements
- Address underlying causes

### Severe Malnutrition
- Immediate medical care
- Specialized treatment
- Hospital admission if needed
- Gradual refeeding

## Special Considerations

### Chronic Illness
- Work with healthcare team
- Adapt diet to condition
- Monitor closely
- Consider supplements

### Picky Eaters
- Offer variety repeatedly
- Make food appealing
- Avoid pressure
- Ensure adequate calories

### Food Allergies
- Identify safe alternatives
- Ensure nutritional adequacy
- Read labels carefully
- Plan balanced meals

## Community Resources

- WIC programs
- School meal programs
- Food banks
- Nutrition education
- Healthcare clinics

## When to Seek Help

Contact healthcare provider if:
- Weight loss or no weight gain
- Falling growth percentiles
- Persistent feeding difficulties
- Signs of deficiency
- Developmental delays

## Key Takeaways

- Prevention is better than treatment
- Early detection is crucial
- Regular monitoring helps identify issues
- Multiple factors contribute to malnutrition
- Support and resources are available
    `
    },
    6: {
        title: 'Seasonal Eating Guide',
        category: 'Sustainable Eating',
        readingTime: 6,
        difficulty: 'beginner',
        content: `
# Seasonal Eating Guide

Eating seasonally means choosing foods that are naturally harvested during specific times of the year in your region.

## Benefits of Seasonal Eating

### Environmental
- Reduced transportation emissions
- Less energy for storage
- Supports local agriculture
- Lower carbon footprint

### Nutritional
- Peak nutrient content
- Better flavor
- Fresher produce
- Fewer preservatives

### Economic
- Lower prices
- Supports local farmers
- Reduces food waste
- Better value

## Seasonal Food Guide

### Winter (December - February)
**Vegetables:**
- Cabbage, kale, Brussels sprouts
- Winter squash
- Root vegetables (carrots, turnips)
- Leeks, onions

**Fruits:**
- Citrus (oranges, grapefruit, lemons)
- Pomegranates
- Pears, apples (stored)

**Meals:**
- Hearty soups and stews
- Roasted root vegetables
- Citrus salads

### Spring (March - May)
**Vegetables:**
- Asparagus, peas
- Artichokes
- Spinach, lettuce
- Radishes

**Fruits:**
- Strawberries
- Rhubarb
- Apricots

**Meals:**
- Fresh salads
- Grilled asparagus
- Berry desserts

### Summer (June - August)
**Vegetables:**
- Tomatoes, cucumbers
- Zucchini, summer squash
- Corn, peppers
- Green beans

**Fruits:**
- Berries (all types)
- Peaches, nectarines
- Watermelon, melons
- Cherries

**Meals:**
- Fresh salsas
- Grilled vegetables
- Fruit salads

### Fall (September - November)
**Vegetables:**
- Pumpkin, squash
- Broccoli, cauliflower
- Sweet potatoes
- Apples, grapes

**Fruits:**
- Pears
- Grapes
- Figs

**Meals:**
- Pumpkin dishes
- Apple desserts
- Harvest salads

## How to Eat Seasonally

### Shop at Farmers Markets
- Meet local farmers
- Ask about growing practices
- Get recipe ideas
- Support local economy

### Join a CSA
- Community Supported Agriculture
- Weekly produce boxes
- Seasonal variety
- Direct farm support

### Grow Your Own
- Start small with herbs
- Try container gardening
- Learn about your climate
- Enjoy fresh produce

### Preserve Seasonal Bounty
- Freeze berries and vegetables
- Can tomatoes and jams
- Dry herbs
- Make pickles

## Seasonal Meal Planning

### Winter Comfort
- Root vegetable stew
- Citrus-glazed chicken
- Kale and white bean soup

### Spring Freshness
- Asparagus risotto
- Strawberry spinach salad
- Pea and mint soup

### Summer Lightness
- Caprese salad
- Grilled corn and zucchini
- Berry smoothie bowls

### Fall Harvest
- Pumpkin curry
- Apple and squash soup
- Roasted Brussels sprouts

## Tips for Success

1. **Learn your region's seasons** - Climate varies
2. **Be flexible** - Work with what's available
3. **Try new foods** - Expand your palate
4. **Plan ahead** - Check seasonal calendars
5. **Preserve extras** - Enjoy year-round

## Sustainability Impact

By eating seasonally, you:
- Reduce food miles
- Support biodiversity
- Minimize packaging
- Lower energy use
- Connect with nature's rhythms

## Key Takeaways

- Seasonal eating benefits health and environment
- Each season offers unique produce
- Local and seasonal often overlap
- Planning helps maximize benefits
- Small changes make a difference
    `
    }
};

export default function ArticleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = articles[id];

    if (!article) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-white">Article not found</div>
            </div>
        );
    }

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-500/20 text-green-400';
            case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
            case 'advanced': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const renderContent = (content) => {
        return content
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((line, idx) => {
                // Skip the first h1 since we already show title
                if (line.startsWith('# ') && idx < 3) return null;

                // H1 headers
                if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-3xl font-bold mt-10 mb-4 text-white">{line.slice(2)}</h1>;
                }

                // H2 headers
                if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-2xl font-bold mt-8 mb-4 text-white border-b border-white/10 pb-2">{line.slice(3)}</h2>;
                }

                // H3 headers  
                if (line.startsWith('### ')) {
                    return <h3 key={idx} className="text-xl font-bold mt-6 mb-3 text-accent-primary">{line.slice(4)}</h3>;
                }

                // Bold line (entire line is bold)
                if (line.startsWith('**') && line.endsWith('**') && !line.includes(':**')) {
                    return <p key={idx} className="font-bold text-white mt-4 mb-2">{line.slice(2, -2)}</p>;
                }

                // Bold with colon (like **Protein:** description)
                if (line.includes(':**')) {
                    const parts = line.split(':**');
                    const boldPart = parts[0].replace('**', '');
                    const rest = parts[1]?.replace('**', '') || '';
                    return (
                        <p key={idx} className="mb-2 text-white/90">
                            <span className="font-bold text-white">{boldPart}:</span>{rest}
                        </p>
                    );
                }

                // Inline bold text
                if (line.includes('**')) {
                    const parts = line.split(/(\*\*[^*]+\*\*)/g);
                    return (
                        <p key={idx} className="mb-3 text-white/80 leading-relaxed">
                            {parts.map((part, i) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </p>
                    );
                }

                // Numbered list
                if (/^\d+\.\s/.test(line)) {
                    const text = line.replace(/^\d+\.\s/, '');
                    return (
                        <div key={idx} className="flex gap-3 mb-2 ml-4">
                            <span className="text-accent-primary font-bold">{line.match(/^\d+/)[0]}.</span>
                            <span className="text-white/80">{text}</span>
                        </div>
                    );
                }

                // Bullet list
                if (line.startsWith('- ')) {
                    return (
                        <div key={idx} className="flex gap-3 mb-2 ml-4">
                            <span className="text-accent-primary">•</span>
                            <span className="text-white/80">{line.slice(2)}</span>
                        </div>
                    );
                }

                // Regular paragraph
                return <p key={idx} className="mb-3 text-white/80 leading-relaxed text-base">{line}</p>;
            });
    };

    return (
        <div className="min-h-screen bg-background-dark px-3 sm:px-6 lg:px-10 pb-16 sm:pb-20 pt-6 sm:pt-10 text-white relative overflow-hidden">
            <DitheredBackground />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.button
                    onClick={() => navigate('/knowledge')}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={20} />
                    <span>Back to Articles</span>
                </motion.button>

                <MagicBento>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary">
                            {article.category}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Clock size={16} />
                            <span>{article.readingTime} min read</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-6">
                        <GradientText>{article.title}</GradientText>
                    </h1>

                    <div className="article-content">
                        {renderContent(article.content)}
                    </div>
                </MagicBento>
            </div>
        </div>
    );
}

