import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Upload, Sparkles, Award, Flame, Droplets, Wheat, Activity, Star, TrendingUp, Zap } from 'lucide-react';
import FluidGlassModal from '../components/FluidGlassModal';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import api from '../services/api';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
        }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

function CircularScore({ score, label }) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        >
            <svg width="160" height="160" className="text-white/20">
                <defs>
                    <linearGradient id="menuScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFC299" />
                        <stop offset="60%" stopColor="#FD8B5D" />
                        <stop offset="100%" stopColor="#f54703" />
                    </linearGradient>
                    <filter id="menuGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="10" fill="none" />
                <motion.circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="url(#menuScoreGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    filter="url(#menuGlow)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - progress }}
                    transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
                />
                <motion.text
                    x="50%"
                    y="45%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-2xl font-black fill-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    {score}
                </motion.text>
                <motion.text
                    x="50%"
                    y="62%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    className="text-[10px] uppercase tracking-widest fill-white/50 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {label}
                </motion.text>
            </svg>
        </motion.div>
    );
}

export default function MenuOrderPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

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
            height: 80, width: 80, x: -40, y: -40,
            backgroundColor: "transparent", border: "1px solid #f54703",
            mixBlendMode: "difference"
        }
    };

    const textEnter = () => setCursorVariant("hover");
    const textLeave = () => setCursorVariant("default");

    const handleAnalyze = async (files) => {
        const file = files?.[0];
        if (!file) return;

        setModalOpen(false);
        setAnalyzing(true);
        setResult(null);

        const imageUrl = URL.createObjectURL(file);
        setUploadedImageUrl(imageUrl);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Simulate API call for smoother UX in demo
            await new Promise(resolve => setTimeout(resolve, 2000));

            // This is a placeholder; in production use the real fetch
            const sampleData = {
                recommendation: {
                    name: "Grilled Salmon Quinoa Bowl",
                    reason: "High protein, rich in Omega-3, and low glycemic index carbohydrates.",
                    calories: 450,
                    protein: 32,
                    carbs: 28,
                    fiber: 6,
                    score: 94,
                    benefits: ["Heart Health", "Sustained Energy", "Muscle Recovery"]
                },
                menuItems: [
                    { name: "Grilled Salmon Quinoa Bowl", description: "Wild caught salmon with organic quinoa", calories: 450, protein: 32, score: 94 },
                    { name: "Classic Cheeseburger", description: "Brioche bun, cheddar cheese, fries", calories: 950, protein: 28, score: 45 },
                    { name: "Caesar Salad", description: "Romaine, parmesan, croutons", calories: 350, protein: 8, score: 72 },
                ]
            };
            setResult(sampleData);

        } catch (error) {
            console.error('Menu analysis error:', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const displayImage = uploadedImageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80";
    const recommendation = result?.recommendation;
    const menuItems = result?.menuItems || [];

    return (
        <div className="min-h-screen bg-[#050505] px-4 sm:px-6 lg:px-10 pb-20 pt-10 text-white relative overflow-hidden font-display cursor-none">
            {/* Custom Cursor */}
            <motion.div
                className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={cursorVariants}
                animate={cursorVariant}
                style={{ translateX: cursorX, translateY: cursorY }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <FloatingShape color="rgba(245, 71, 3, 0.05)" size={800} top="-10%" left="-10%" delay={0} />
                <FloatingShape color="rgba(30, 64, 175, 0.05)" size={600} bottom="10%" right="-10%" delay={4} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Menu Photo">
                    <motion.div
                        className="space-y-6 text-white/80"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <p className="text-sm leading-relaxed">Upload a photo of a restaurant menu. Our AI will analyze all items and recommend the most nutritious option for you.</p>
                        <motion.label
                            className={`relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed ${isDragging ? 'border-accent-primary bg-accent-primary/10' : 'border-white/15 bg-white/5'
                                } p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden group`}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleAnalyze(e.dataTransfer.files); }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={textEnter} onMouseLeave={textLeave}
                        >
                            <Upload className="h-10 w-10 text-accent-soft relative z-10" />
                            <span className="text-base relative z-10">Drag & drop a menu photo or tap to browse</span>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAnalyze(e.target.files)} />
                        </motion.label>
                    </motion.div>
                </FluidGlassModal>

                <motion.div
                    className="flex flex-wrap items-center justify-between gap-4 mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <motion.p className="text-[#f54703] font-mono text-xs uppercase tracking-[0.2em] mb-2 block">
                            Smart Menu Analysis
                        </motion.p>
                        <motion.h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                            Smart Ordering
                        </motion.h1>
                    </div>
                    <motion.button
                        onClick={() => setModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-[#f54703] text-black rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2"
                        onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                        <Upload size={18} />
                        <span>{analyzing ? 'Scanning...' : 'Upload Menu'}</span>
                    </motion.button>
                </motion.div>

                <motion.section
                    className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <MagicBento className="relative overflow-hidden border-white/10 bg-[#0d0d0e]/50">
                        <motion.div
                            className="relative h-72 rounded-3xl border border-white/10 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url(${displayImage})` }}
                            whileHover={{ scale: 1.02 }}
                            onMouseEnter={textEnter} onMouseLeave={textLeave}
                        >
                            <AnimatePresence>
                                {analyzing && (
                                    <motion.div
                                        className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <ShinyText className="text-2xl font-bold uppercase tracking-widest">Scanning Menu...</ShinyText>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            className="mt-6 grid gap-4 md:grid-cols-2"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={fadeInUp}>
                                <SpotlightCard className="bg-white/5 border-white/10" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">Items Found</p>
                                    <div className="mt-3 flex items-center gap-3 text-2xl font-black">
                                        <TrendingUp className="text-[#f54703]" />
                                        <span>{analyzing ? 'Scanning...' : menuItems.length > 0 ? `${menuItems.length} items` : 'Pending'}</span>
                                    </div>
                                </SpotlightCard>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <SpotlightCard className="bg-white/5 border-white/10" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">Analysis</p>
                                    <div className="mt-3 flex items-center gap-3 text-2xl font-black">
                                        <Sparkles className="text-[#f54703]" />
                                        <span>{analyzing ? 'Processing' : result ? 'Complete' : 'Ready'}</span>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        </motion.div>
                    </MagicBento>

                    <MagicBento className="flex flex-col items-center gap-6 text-center border-white/10 bg-[#0d0d0e]/50">
                        <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
                            <CircularScore score={recommendation?.score || 0} label="Top Match" />
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-2">Recommendation</p>
                            <h3 className="text-xl font-bold uppercase tracking-tight">{analyzing ? 'Analyzing...' : recommendation?.name || 'Scan to reveal'}</h3>
                        </motion.div>

                        <AnimatePresence>
                            {recommendation && (
                                <motion.div
                                    className="grid w-full grid-cols-4 gap-2 text-left text-sm text-white/70"
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    {[
                                        { label: 'CAL', value: recommendation.calories, icon: Flame },
                                        { label: 'PRO', value: `${recommendation.protein}g`, icon: Activity },
                                        { label: 'CARB', value: `${recommendation.carbs}g`, icon: Wheat },
                                        { label: 'FIBER', value: `${recommendation.fiber}g`, icon: Droplets }
                                    ].map((macro, idx) => {
                                        const Icon = macro.icon;
                                        return (
                                            <motion.div
                                                key={macro.label}
                                                className="rounded-2xl border border-white/10 bg-white/5 p-2 text-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ y: -3, scale: 1.05 }}
                                                onMouseEnter={textEnter} onMouseLeave={textLeave}
                                            >
                                                <Icon className="w-3 h-3 mx-auto mb-1 text-[#f54703]" />
                                                <div className="text-xs font-bold">{macro.value}</div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </MagicBento>
                </motion.section>

                <AnimatePresence>
                    {result && !analyzing && (
                        <motion.section
                            className="mt-10 grid gap-8 lg:grid-cols-2"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.8 }}
                        >
                            <MagicBento className="border-white/10 bg-[#0d0d0e]/50">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">Why This Choice?</p>
                                    <Award className="text-[#f54703] h-5 w-5" />
                                </div>
                                <div className="min-h-[120px] rounded-2xl border border-white/5 bg-black/20 p-6 text-left" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                                    <p className="text-lg font-light leading-relaxed opacity-90">{recommendation?.reason}</p>
                                </div>
                                {recommendation?.benefits && recommendation.benefits.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {recommendation.benefits.map((benefit, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    className="px-3 py-1 rounded-full bg-[#f54703]/10 text-xs font-bold uppercase tracking-wide text-[#f54703]"
                                                >
                                                    {benefit}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </MagicBento>

                            <MagicBento className="border-white/10 bg-[#0d0d0e]/50">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">All Menu Items</p>
                                    <Zap className="text-[#f54703]" />
                                </div>

                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {menuItems.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${item.name === recommendation?.name
                                                ? 'border-[#f54703]/50 bg-[#f54703]/10'
                                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            onMouseEnter={textEnter} onMouseLeave={textLeave}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm uppercase text-white">{item.name}</span>
                                                    {item.name === recommendation?.name && (
                                                        <Star className="w-3 h-3 text-[#f54703] fill-[#f54703]" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/50 mt-1 line-clamp-1">{item.description}</p>
                                            </div>
                                            <div className="text-right pl-4">
                                                <span className={`text-lg font-black ${item.score >= 80 ? 'text-[#f54703]' : 'text-white/30'}`}>{item.score}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </MagicBento>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 10px;
                }
              `}</style>
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
