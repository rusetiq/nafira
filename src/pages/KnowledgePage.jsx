import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Clock } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import GradientText from '../components/GradientText';
import DitheredBackground from '../components/DitheredBackground';

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

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-500/20 text-green-400';
            case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
            case 'advanced': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-background-dark px-3 sm:px-6 lg:px-10 pb-16 sm:pb-20 pt-6 sm:pt-10 text-white relative overflow-hidden">
            <DitheredBackground />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.header
                    className="mb-6 sm:mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60">
                        Food Knowledge Hub
                    </p>
                    <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                        <GradientText>Learn About Nutrition</GradientText>
                    </h1>
                    <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/60">
                        Evidence-based nutrition education for better health
                    </p>
                </motion.header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article, idx) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(`/knowledge/${article.id}`)}
                        >
                            <MagicBento className="h-full cursor-pointer hover:scale-105 transition-transform">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-xs px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary">
                                        {article.category}
                                    </span>
                                    <span className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(article.difficulty)}`}>
                                        {article.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>

                                <div className="flex items-center gap-4 text-sm text-white/60 mt-4">
                                    <div className="flex items-center gap-1">
                                        <Clock size={16} />
                                        <span>{article.readingTime} min</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Book size={16} />
                                        <span>Article</span>
                                    </div>
                                </div>
                            </MagicBento>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
