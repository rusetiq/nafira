import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, Activity, Baby, Leaf, BookOpen, TrendingUp, Droplet, Zap,
    Camera, Clock, Calendar, ChevronRight, Star, Image,
    BarChart3, Users, Target, Award, Utensils, Apple, Pizza, Heart
} from 'lucide-react';

function CircularHealthScore({ score, size = 200, delay = 0 }) {
    const radius = (size / 2) - 25;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay, type: 'spring' }}
        >
            <svg width={size} height={size} className="text-white/20">
                <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFC299" />
                        <stop offset="100%" stopColor="#f54703" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="12" fill="none" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    stroke="url(#scoreGrad)" strokeWidth="12" fill="none"
                    strokeDasharray={circumference} strokeLinecap="round"
                    strokeDashoffset={circumference - progress}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.05s ease-out' }}
                />
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
                    className="text-4xl font-bold fill-white">{score}</text>
            </svg>
        </motion.div>
    );
}

function PhoneFrame({ children, delay = 0 }) {
    return (
        <motion.div
            className="relative w-[260px] h-[520px] bg-gray-900 rounded-[2.5rem] p-[6px] shadow-2xl border border-gray-700"
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay }}
        >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full flex items-center justify-center z-20">
                <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700" />
            </div>
            <div className="w-full h-full bg-black rounded-[2.2rem] overflow-hidden">
                {children}
            </div>
        </motion.div>
    );
}

function MealCard({ name, score, time, delay = 0 }) {
    return (
        <motion.div
            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <p className="text-white font-medium text-sm">{name}</p>
                <p className="text-white/50 text-xs">{time}</p>
            </div>
            <div className="text-orange-400 font-bold">{score}</div>
        </motion.div>
    );
}

function ArticleCard({ title, category, delay = 0 }) {
    return (
        <motion.div
            className="p-4 bg-white/5 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <span className="text-xs text-purple-400 uppercase tracking-wide">{category}</span>
            <p className="text-white font-medium mt-1">{title}</p>
            <ChevronRight className="w-4 h-4 text-white/40 mt-2" />
        </motion.div>
    );
}

function StatCard({ icon: Icon, value, label, color, delay = 0 }) {
    return (
        <motion.div
            className="text-center p-4"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay, type: 'spring' }}
        >
            <motion.div
                className={`p-3 rounded-xl ${color} inline-block mb-2`}
                whileHover={{ scale: 1.1 }}
            >
                <Icon className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-white/50 text-sm">{label}</p>
        </motion.div>
    );
}

const scenes = [
    { id: 'mission', duration: 1800 },
    { id: 'upload', duration: 2600 },
    { id: 'analysis', duration: 2500 },
    { id: 'dashboard', duration: 2200 },
    { id: 'history', duration: 2000 },
    { id: 'children', duration: 2000 },
    { id: 'sustainability', duration: 2200 },
    { id: 'knowledge', duration: 2000 },
    { id: 'outro', duration: 1800 },
    { id: 'creator', duration: 2000 },
];

export default function ShowcasePage() {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [score, setScore] = useState(0);
    const scene = scenes[sceneIndex] || scenes[0];

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSceneIndex(prev => prev >= scenes.length - 1 ? 0 : prev + 1);
        }, scene.duration);
        return () => clearTimeout(timeout);
    }, [sceneIndex, scene.duration]);

    useEffect(() => {
        if (scene.id === 'analysis') {
            setScore(0);
            const interval = setInterval(() => {
                setScore(prev => prev >= 87 ? 87 : prev + 3);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [scene.id]);

    const bgColors = {
        mission: '#000', upload: '#050508', analysis: '#08050d',
        dashboard: '#05080a', history: '#080805', children: '#050a08',
        sustainability: '#050a0a', knowledge: '#0a0508', outro: '#000', creator: '#0a0a0a'
    };

    return (
        <motion.div
            className="fixed inset-0 overflow-hidden"
            animate={{ backgroundColor: bgColors[scene.id] || '#000' }}
            transition={{ duration: 0.8 }}
        >
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />

            <AnimatePresence mode="wait">

                {scene.id === 'mission' && (
                    <motion.div key="mission" className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
                        <motion.div className="absolute w-[900px] h-[900px] rounded-full opacity-25 blur-[80px]"
                            style={{ background: 'radial-gradient(circle, #10b981 0%, #059669 50%, transparent 70%)' }}
                            animate={{ scale: [0.8, 1.2, 1], rotate: [0, 45, 0] }}
                            transition={{ duration: 2.5 }} />
                        <motion.p
                            className="text-5xl md:text-7xl font-light text-white text-center max-w-4xl leading-tight"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Good health should be <motion.span
                                className="font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent"
                                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >accessible</motion.span>.
                        </motion.p>
                    </motion.div>
                )}

                {scene.id === 'upload' && (
                    <motion.div key="upload" className="absolute inset-0 flex items-center justify-center gap-16"
                        initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.4 }}>
                        <motion.div className="absolute w-[700px] h-[700px] rounded-full opacity-20 blur-[70px]"
                            style={{ background: 'radial-gradient(circle, #3b82f6 0%, #8b5cf6 50%, transparent 70%)' }} />

                        <PhoneFrame delay={0.1}>
                            <div className="p-4 h-full flex flex-col pt-10">
                                <p className="text-white/60 text-xs text-center mb-4">Snap or Upload</p>
                                <motion.div
                                    className="flex-1 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative bg-gradient-to-br from-orange-900/30 to-amber-900/30">
                                    <motion.div
                                        className="absolute inset-4 rounded-xl overflow-hidden"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}>
                                        <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-6xl mb-2">🥗</div>
                                                <p className="text-white/60 text-xs">Chicken Salad</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="absolute inset-0 border-4 border-orange-500 rounded-2xl"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ delay: 0.8, duration: 0.3 }} />
                                    <motion.div
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-orange-500 rounded-full"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 }}>
                                        <p className="text-white text-xs font-medium">Analyzing...</p>
                                    </motion.div>
                                </motion.div>
                                <div className="flex gap-3 mt-4">
                                    <motion.button className="flex-1 py-3 bg-orange-500 rounded-xl text-white font-medium flex items-center justify-center gap-2">
                                        <Camera className="w-5 h-5" /> Camera
                                    </motion.button>
                                    <button className="flex-1 py-3 bg-white/10 rounded-xl text-white flex items-center justify-center gap-2">
                                        <Image className="w-5 h-5" /> Gallery
                                    </button>
                                </div>
                            </div>
                        </PhoneFrame>

                        <motion.div className="text-left max-w-md"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                            <motion.h2 className="text-6xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                Snap Your Meal
                            </motion.h2>
                            <motion.p className="text-2xl text-white/50"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                Take a photo. Watch AI work its magic.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}

                {scene.id === 'analysis' && (
                    <motion.div key="analysis" className="absolute inset-0 flex items-center justify-center gap-16"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.4 }}>
                        <motion.div className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-[80px]"
                            style={{ background: 'radial-gradient(circle, #a855f7 0%, #ec4899 50%, transparent 70%)' }}
                            animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} />

                        <div className="flex flex-col items-center">
                            <CircularHealthScore score={score} size={260} />
                            <motion.div
                                className="mt-6 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 min-w-[320px]"
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                            <Utensils className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Grilled Chicken Salad</p>
                                            <p className="text-white/50 text-xs">420 calories</p>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="px-2 py-1 bg-green-500/20 rounded-full"
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
                                        <span className="text-green-400 text-xs font-medium">Healthy</span>
                                    </motion.div>
                                </div>
                                <div className="flex gap-2">
                                    {[{ label: 'Carbs', value: '45g', color: 'from-blue-500 to-cyan-400' },
                                    { label: 'Protein', value: '32g', color: 'from-green-500 to-emerald-400' },
                                    { label: 'Fats', value: '18g', color: 'from-orange-500 to-amber-400' }].map((m, i) => (
                                        <motion.div
                                            key={m.label}
                                            className="flex-1 p-2 rounded-lg bg-white/5 text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 + i * 0.1 }}>
                                            <p className="text-white/50 text-[10px] uppercase tracking-wide">{m.label}</p>
                                            <p className={`text-lg font-bold bg-gradient-to-r ${m.color} bg-clip-text text-transparent`}>{m.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div className="text-left max-w-md"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            <motion.div className="flex items-center gap-3 mb-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                                    <Sparkles className="w-8 h-8 text-purple-400" />
                                </motion.div>
                                <span className="text-xl text-purple-400 uppercase tracking-wide">AI Analysis</span>
                            </motion.div>
                            <motion.h2 className="text-6xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                Instant Results
                            </motion.h2>
                            <motion.p className="text-2xl text-white/50"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                                Complete nutrition breakdown in seconds.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}

                {scene.id === 'dashboard' && (
                    <motion.div key="dashboard" className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.4 }}>
                        <motion.div className="absolute w-[900px] h-[900px] rounded-full opacity-20 blur-[80px]"
                            style={{ background: 'radial-gradient(circle, #06b6d4 0%, #3b82f6 50%, transparent 70%)' }} />

                        <div className="text-center">
                            <motion.h2 className="text-6xl font-bold text-white mb-12"
                                initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
                                Your Dashboard
                            </motion.h2>

                            <div className="grid grid-cols-4 gap-8 mb-12">
                                <StatCard icon={Target} value="1,850" label="Calories Today" color="bg-orange-500/20" delay={0.15} />
                                <StatCard icon={Activity} value="87" label="Health Score" color="bg-green-500/20" delay={0.25} />
                                <StatCard icon={BarChart3} value="23" label="Meals Logged" color="bg-blue-500/20" delay={0.35} />
                                <StatCard icon={Award} value="7" label="Day Streak" color="bg-purple-500/20" delay={0.45} />
                            </div>

                            <motion.div className="flex justify-center gap-6"
                                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                                {[Apple, Pizza, Utensils].map((Icon, i) => (
                                    <motion.div key={i} className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"
                                        animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
                                        <Icon className="w-8 h-8 text-white/60" />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {scene.id === 'history' && (
                    <motion.div key="history" className="absolute inset-0 flex items-center justify-center gap-16"
                        initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}>
                        <motion.div className="absolute w-[700px] h-[700px] rounded-full opacity-20 blur-[70px]"
                            style={{ background: 'radial-gradient(circle, #eab308 0%, #f97316 50%, transparent 70%)' }} />

                        <div className="text-left">
                            <motion.div className="flex items-center gap-3 mb-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Clock className="w-8 h-8 text-yellow-400" />
                                <span className="text-xl text-yellow-400 uppercase tracking-wide">History</span>
                            </motion.div>
                            <motion.h2 className="text-6xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                Track Everything
                            </motion.h2>
                        </div>

                        <div className="w-[350px] space-y-3">
                            <motion.div className="flex items-center gap-2 mb-4"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                                <Calendar className="w-5 h-5 text-white/40" />
                                <span className="text-white/60">Today</span>
                            </motion.div>
                            <MealCard name="Grilled Chicken Salad" score={92} time="12:30 PM" delay={0.3} />
                            <MealCard name="Avocado Toast" score={85} time="8:15 AM" delay={0.4} />
                            <MealCard name="Protein Smoothie" score={88} time="7:00 AM" delay={0.5} />
                        </div>
                    </motion.div>
                )}

                {scene.id === 'children' && (
                    <motion.div key="children" className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.4 }}>
                        <motion.div className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-[80px]"
                            style={{ background: 'radial-gradient(circle, #10b981 0%, #059669 50%, transparent 70%)' }} />

                        <div className="text-center">
                            <motion.div className="mb-8" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 10 }}>
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 inline-block">
                                    <Baby className="w-20 h-20 text-white" />
                                </div>
                            </motion.div>
                            <motion.h2 className="text-6xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                Child Nutrition
                            </motion.h2>
                            <motion.p className="text-2xl text-white/60 mb-8"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                WHO-based growth tracking • SDG 3
                            </motion.p>
                            <motion.div className="flex justify-center gap-8"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                {[{ icon: Users, text: 'Family Profiles' }, { icon: TrendingUp, text: 'Growth Charts' }, { icon: Star, text: 'Meal Ideas' }].map((item, i) => (
                                    <motion.div key={i} className="text-center"
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                                        <item.icon className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                                        <p className="text-white font-medium">{item.text}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {scene.id === 'sustainability' && (
                    <motion.div key="sustainability" className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, rotateY: -10 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 10 }}
                        transition={{ duration: 0.4 }}>
                        <motion.div className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-[80px]"
                            style={{ background: 'radial-gradient(circle, #14b8a6 0%, #0d9488 50%, transparent 70%)' }}
                            animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} />

                        <div className="text-center">
                            <motion.div className="mb-8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-400 to-green-500 inline-block">
                                    <Heart className="w-14 h-14 text-white" />
                                </div>
                            </motion.div>
                            <motion.h2 className="text-6xl font-bold text-white mb-12"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                Planet Health
                            </motion.h2>
                            <div className="flex gap-12 justify-center">
                                <StatCard icon={TrendingUp} value="0.5kg" label="CO₂ Saved" color="bg-green-500/20" delay={0.2} />
                                <StatCard icon={Droplet} value="45L" label="Water Saved" color="bg-blue-500/20" delay={0.35} />
                                <StatCard icon={Leaf} value="92%" label="Eco Score" color="bg-teal-500/20" delay={0.5} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {scene.id === 'knowledge' && (
                    <motion.div key="knowledge" className="absolute inset-0 flex items-center justify-center gap-16"
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.4 }}>
                        <motion.div className="absolute w-[700px] h-[700px] rounded-full opacity-25 blur-[70px]"
                            style={{ background: 'radial-gradient(circle, #ec4899 0%, #f43f5e 50%, transparent 70%)' }} />

                        <div className="text-left">
                            <motion.div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 inline-block mb-6"
                                initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }}>
                                <BookOpen className="w-14 h-14 text-white" />
                            </motion.div>
                            <motion.h2 className="text-6xl font-bold text-white mb-4"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                Knowledge Hub
                            </motion.h2>
                            <motion.p className="text-xl text-white/50"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                                Evidence-based nutrition education
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-[400px]">
                            <ArticleCard title="Understanding Macros" category="Basics" delay={0.2} />
                            <ArticleCard title="Plant-Based Eating" category="Diet" delay={0.3} />
                            <ArticleCard title="Child Nutrition" category="Family" delay={0.4} />
                            <ArticleCard title="Seasonal Eating" category="Eco" delay={0.5} />
                        </div>
                    </motion.div>
                )}

                {scene.id === 'outro' && (
                    <motion.div key="outro" className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="absolute w-[1000px] h-[1000px] rounded-full opacity-40 blur-[100px]"
                            style={{ background: 'radial-gradient(circle, #FF6B35 0%, #F7931E 40%, transparent 70%)' }}
                            animate={{ scale: [0.7, 1.2, 1] }} transition={{ duration: 2 }} />

                        <motion.div className="text-center"
                            initial={{ scale: 2.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}>
                            <motion.h1 className="text-[12rem] font-bold tracking-tight"
                                style={{
                                    fontFamily: '"Space Grotesk", sans-serif',
                                    background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #F7931E 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                                }}>
                                NAFIRA
                            </motion.h1>
                            <motion.p className="text-3xl text-white/70 tracking-[0.4em] uppercase mt-4"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                AI metabolic insights
                            </motion.p>
                            <motion.div className="mt-8" initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <Zap className="w-12 h-12 text-orange-500 mx-auto" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

                {scene.id === 'creator' && (
                    <motion.div key="creator" className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <motion.div className="absolute w-[600px] h-[600px] rounded-full opacity-25 blur-[70px]"
                            style={{ background: 'radial-gradient(circle, #FF6B35 0%, #f97316 50%, transparent 70%)' }}
                            animate={{ scale: [0.8, 1.1, 1] }} transition={{ duration: 2 }} />

                        <motion.div className="text-center"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, type: 'spring' }}>
                            <motion.img
                                src="/rusetiq-logo.png"
                                alt="RUSETIQ"
                                className="w-72 h-auto mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            />
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>

            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)' }} />
        </motion.div>
    );
}
