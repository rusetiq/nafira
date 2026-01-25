import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, ChevronLeft } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import MagicBento from '../components/MagicBento';

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

    // Cursor Logic
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    const [cursorVariant, setCursorVariant] = useState("default");

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        }
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, [mouseX, mouseY]);

    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    const cursorVariants = {
        default: {
            height: 12, width: 12, x: -6, y: -6,
            backgroundColor: "#fff", mixBlendMode: "difference"
        },
        hover: {
            height: 60, width: 60, x: -30, y: -30,
            backgroundColor: "transparent", border: "1px solid #fff",
            mixBlendMode: "difference"
        }
    };

    const textEnter = () => setCursorVariant("hover");
    const textLeave = () => setCursorVariant("default");

    if (!article) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center font-display">
                <div className="text-white text-xl">Article not found</div>
            </div>
        );
    }

    const renderContent = (content) => {
        return content.split('\n').map((line, idx) => {
            if (line.trim().startsWith('# ')) return <h1 key={idx} className="text-4xl sm:text-5xl font-black mb-8 mt-12 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 tracking-tight">{line.replace('# ', '')}</h1>;
            if (line.trim().startsWith('## ')) return <h2 key={idx} className="text-2xl sm:text-3xl font-bold mb-6 mt-10 text-[#FD8B5D] tracking-tight">{line.replace('## ', '')}</h2>;
            if (line.trim().startsWith('### ')) return <h3 key={idx} className="text-xl font-bold mb-4 mt-8 text-white/90">{line.replace('### ', '')}</h3>;
            if (line.trim().startsWith('- ')) return <li key={idx} className="ml-6 mb-3 text-white/70 list-disc marker:text-[#f54703] pl-2">{line.replace('- ', '')}</li>;
            if (line.trim().startsWith('**')) return <p key={idx} className="mb-4 text-lg text-white/90 font-bold">{line.replace(/\*\*/g, '')}</p>;
            if (line.trim() === '') return <div key={idx} className="h-4" />;
            return <p key={idx} className="mb-4 text-lg leading-relaxed text-white/70 font-light tracking-wide">{line}</p>;
        });
    };

    return (
        <div className="relative min-h-screen bg-[#050505] text-[#f8fafc] font-display selection:bg-[#f54703] selection:text-white cursor-none overflow-x-hidden">
            {/* Custom Cursor */}
            <motion.div
                className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={cursorVariants}
                animate={cursorVariant}
                style={{ translateX: cursorX, translateY: cursorY }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <FloatingShape color="rgba(245, 71, 3, 0.15)" size={600} top="-20%" left="-10%" delay={0} />
                <FloatingShape color="rgba(30, 64, 175, 0.1)" size={500} bottom="-10%" right="-10%" delay={2} />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
                <motion.button
                    onClick={() => navigate(-1)}
                    className="group pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all cursor-none"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                    whileHover={{ x: -4 }}
                >
                    <ChevronLeft size={20} className="text-white/70 group-hover:text-white transition-colors" />
                    <span className="text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">Back</span>
                </motion.button>

                <div className="pointer-events-auto flex gap-4">
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#f54703] hover:border-[#f54703] transition-all group" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <Share2 size={18} className="text-white/70 group-hover:text-white" />
                    </button>
                    <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#f54703] hover:border-[#f54703] transition-all group" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <Bookmark size={18} className="text-white/70 group-hover:text-white" />
                    </button>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="max-w-4xl mx-auto mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f54703]/30 bg-[#f54703]/10 mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#f54703] animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#f54703]">{article.category}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8"
                        onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                        {article.title}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-6 text-sm font-mono uppercase tracking-wider text-white/50"
                    >
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{article.readingTime} min read</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            <span className={
                                article.difficulty === 'beginner' ? 'text-green-400' :
                                    article.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
                            }>{article.difficulty}</span>
                        </div>
                    </motion.div>
                </header>

                {/* Content Container */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-white/5 to-transparent">
                        <div className="rounded-[2.4rem] bg-[#0d0d0e] p-8 sm:p-12 md:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
                            {/* Decorative gradient blob inside card */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#f54703] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

                            <article className="relative z-10">
                                {renderContent(article.content)}
                            </article>

                            <div className="mt-16 pt-12 border-t border-white/10 flex justify-between items-end opacity-50">
                                <span className="font-mono text-xs uppercase tracking-widest">Nafira Knowledge Base</span>
                                <span className="font-display font-black text-2xl tracking-tighter">NAFIRA<span className="text-xs align-top">Â®</span></span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

function FloatingShape({ color, size, top, left, right, bottom, delay }) {
    return (
        <motion.div
            className="absolute rounded-full blur-[100px]"
            style={{ backgroundColor: color, width: size, height: size, top, left, right, bottom }}
            animate={{
                y: [0, 50, 0],
                x: [0, 30, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{
                duration: 10,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}
