import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Book, Clock, ArrowRight, BookOpen, Star, Brain } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import GradientText from '../components/GradientText';
import SpotlightCard from '../components/SpotlightCard';

export default function KnowledgePage() {
    const navigate = useNavigate();
    const [articles] = useState([
        {
            id: 1,
            title: 'Understanding Macronutrients',
            category: 'Nutrition Basics',
            readingTime: 5,
            difficulty: 'beginner',
            content: 'Learn about proteins, carbohydrates, and fats...'
        },
        {
            id: 2,
            title: 'The Importance of Micronutrients',
            category: 'Nutrition Basics',
            readingTime: 7,
            difficulty: 'beginner',
            content: 'Vitamins and minerals are essential for health...'
        },
        {
            id: 3,
            title: 'Plant-Based Nutrition',
            category: 'Sustainable Eating',
            readingTime: 10,
            difficulty: 'intermediate',
            content: 'How to get complete nutrition from plants...'
        },
        {
            id: 4,
            title: 'Child Nutrition Guidelines',
            category: 'Child Health',
            readingTime: 8,
            difficulty: 'beginner',
            content: 'Age-appropriate nutrition for growing children...'
        },
        {
            id: 5,
            title: 'Preventing Malnutrition',
            category: 'Child Health',
            readingTime: 12,
            difficulty: 'intermediate',
            content: 'Recognizing and preventing nutritional deficiencies...'
        },
        {
            id: 6,
            title: 'Seasonal Eating Guide',
            category: 'Sustainable Eating',
            readingTime: 6,
            difficulty: 'beginner',
            content: 'Benefits of eating seasonal produce...'
        }
    ]);

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
            backgroundColor: "transparent", border: "1px solid #f54703",
            mixBlendMode: "difference"
        }
    };

    const textEnter = () => setCursorVariant("hover");
    const textLeave = () => setCursorVariant("default");

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'text-green-400 border-green-400/20 bg-green-400/10';
            case 'intermediate': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
            case 'advanced': return 'text-red-400 border-red-400/20 bg-red-400/10';
            default: return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
        }
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
                <FloatingShape color="rgba(245, 71, 3, 0.05)" size={900} top="-30%" right="-30%" delay={0} />
                <FloatingShape color="rgba(30, 64, 175, 0.05)" size={700} bottom="-20%" left="10%" delay={5} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20">
                <motion.header
                    className="mb-20 text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
                        <BookOpen size={14} className="text-[#f54703]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/60">Knowledge Hub</span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        Evidence Based<br />
                        <span className="text-transparent" style={{ webkitTextStroke: '1px #f54703' }}>Nutrition Logic.</span>
                    </h1>
                    <p className="text-xl text-white/50 font-light max-w-2xl mx-auto">
                        Deep dive into metabolic science, sustainable eating, and healthy living guidelines curated by experts.
                    </p>
                </motion.header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(`/knowledge/${article.id}`)}
                            className="group"
                            onMouseEnter={textEnter} onMouseLeave={textLeave}
                        >
                            <SpotlightCard className="h-full bg-white/5 border-white/10 hover:border-[#f54703]/30 transition-all duration-300">
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-full bg-white/5 border border-white/10 text-[#f54703]">
                                            <Brain size={24} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColor(article.difficulty)}`}>
                                            {article.difficulty}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-xs text-[#f54703] font-mono uppercase tracking-widest mb-2 block">
                                            {article.category}
                                        </span>
                                        <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-[#f54703] transition-colors">
                                            {article.title}
                                        </h3>
                                    </div>

                                    <div className="pt-6 border-t border-white/10 flex items-center justify-between text-white/50 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span className="font-mono">{article.readingTime} min read</span>
                                        </div>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
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
