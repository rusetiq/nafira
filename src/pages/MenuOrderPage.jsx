import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, Award, Flame, Droplets, Wheat, Activity, Star, TrendingUp, Zap } from 'lucide-react';
import FluidGlassModal from '../components/FluidGlassModal';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import DitheredBackground from '../components/DitheredBackground';
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
                    className="text-2xl font-semibold fill-white"
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
                    className="text-xs fill-white/70"
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

            const token = localStorage.getItem('token');
            const baseUrl = process.env.NODE_ENV === 'production'
                ? '/api/menu/analyze'
                : `http://${window.location.hostname}:5000/api/menu/analyze`;
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                body: formData
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Menu analysis error:', error);
            const sampleResponse = await api.get('/menu/sample');
            setResult(sampleResponse);
        } finally {
            setAnalyzing(false);
        }
    };

    const displayImage = uploadedImageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80";
    const recommendation = result?.recommendation;
    const menuItems = result?.menuItems || [];

    return (
        <div className="min-h-screen bg-background-dark px-4 sm:px-6 lg:px-10 pb-20 pt-10 text-white relative overflow-hidden">
            <DitheredBackground />

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
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleAnalyze(e.dataTransfer.files);
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            <motion.div
                                animate={isDragging ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                                transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                            >
                                <Upload className="h-10 w-10 text-accent-soft relative z-10" />
                            </motion.div>
                            <span className="text-base relative z-10">Drag & drop a menu photo or tap to browse</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleAnalyze(e.target.files)}
                            />
                            <motion.button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    fileInputRef.current?.click();
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative z-10 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-accent-primary hover:bg-white/10 transition-all duration-300"
                            >
                                Browse files
                            </motion.button>
                        </motion.label>
                    </motion.div>
                </FluidGlassModal>

                <motion.div
                    className="flex flex-wrap items-center justify-between gap-4 mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <motion.p
                            className="text-sm uppercase tracking-[0.3em] text-white/60"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Smart Menu Analysis
                        </motion.p>
                        <motion.h1
                            className="mt-2 text-4xl font-semibold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Find the Best Nutritious Option
                        </motion.h1>
                    </div>
                    <motion.button
                        onClick={() => setModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex items-center gap-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-300 hover:border-accent-soft hover:bg-white/10 overflow-hidden"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <motion.div
                            animate={analyzing ? { rotate: 360 } : {}}
                            transition={{ duration: 2, repeat: analyzing ? Infinity : 0, ease: 'linear' }}
                        >
                            <Upload size={18} className="relative z-10" />
                        </motion.div>
                        <span className="relative z-10">{analyzing ? 'Analyzing...' : 'Upload Menu'}</span>
                    </motion.button>
                </motion.div>

                <motion.section
                    className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <MagicBento className="relative overflow-hidden">
                        <motion.div
                            className="relative h-72 rounded-3xl border border-white/10 bg-cover bg-center overflow-hidden"
                            style={{ backgroundImage: `url(${displayImage})` }}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <AnimatePresence>
                                {analyzing && (
                                    <motion.div
                                        className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.05, 1],
                                                rotate: [0, 2, -2, 0]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <ShinyText className="text-2xl">Scanning menu items...</ShinyText>
                                        </motion.div>
                                        <motion.p
                                            className="mt-2 text-sm text-white/70"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            Identifying dishes and calculating nutrition values
                                        </motion.p>
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
                                <SpotlightCard className="bg-black/40">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Items Detected</p>
                                    <div className="mt-3 flex items-center gap-3 text-2xl font-semibold">
                                        <motion.div
                                            animate={analyzing ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 1, repeat: analyzing ? Infinity : 0 }}
                                        >
                                            <TrendingUp className="h-6 w-6 text-accent-soft" />
                                        </motion.div>
                                        <span>{analyzing ? 'Scanning...' : menuItems.length > 0 ? `${menuItems.length} items` : 'Upload to start'}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-white/60">Menu items identified</p>
                                </SpotlightCard>
                            </motion.div>

                            <motion.div variants={fadeInUp}>
                                <SpotlightCard className="bg-black/40">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">Analysis Status</p>
                                    <div className="mt-3 flex items-center gap-3 text-2xl font-semibold">
                                        <motion.div
                                            animate={analyzing ? { rotate: 360 } : {}}
                                            transition={{ duration: 2, repeat: analyzing ? Infinity : 0, ease: 'linear' }}
                                        >
                                            <Sparkles className="h-6 w-6 text-accent-primary" />
                                        </motion.div>
                                        <span>{analyzing ? 'Processing' : result ? 'Complete' : 'Ready'}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-white/60">AI nutrition analysis</p>
                                </SpotlightCard>
                            </motion.div>
                        </motion.div>
                    </MagicBento>

                    <MagicBento className="flex flex-col items-center gap-6 text-center">
                        <CircularScore score={recommendation?.score || 0} label="Best Score" />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Top Recommendation</p>
                            <GradientText className="text-2xl">{analyzing ? 'Analyzing...' : recommendation?.name || 'Upload menu to see'}</GradientText>
                        </motion.div>
                        <motion.p
                            className="text-white/70 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            {recommendation?.reason || 'Our AI will analyze each item and recommend the healthiest choice based on nutritional content.'}
                        </motion.p>
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
                                        { label: 'Calories', value: recommendation.calories, icon: Flame, color: 'text-red-400' },
                                        { label: 'Protein', value: `${recommendation.protein}g`, icon: Activity, color: 'text-blue-400' },
                                        { label: 'Carbs', value: `${recommendation.carbs}g`, icon: Wheat, color: 'text-amber-400' },
                                        { label: 'Fiber', value: `${recommendation.fiber}g`, icon: Droplets, color: 'text-green-400' }
                                    ].map((macro, idx) => {
                                        const Icon = macro.icon;
                                        return (
                                            <motion.div
                                                key={macro.label}
                                                className="rounded-2xl border border-white/10 bg-black/40 p-3 text-center"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ y: -3, scale: 1.05 }}
                                            >
                                                <Icon className={`w-4 h-4 mx-auto mb-1 ${macro.color}`} />
                                                <GradientText className="text-lg">{macro.value}</GradientText>
                                                <p className="text-xs text-white/50">{macro.label}</p>
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
                            <MagicBento>
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Why This Choice?</p>
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <Award className="text-accent-soft h-5 w-5" />
                                    </motion.div>
                                </div>
                                <div className="min-h-[120px] rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
                                    <GradientText className="text-base leading-relaxed">{recommendation?.reason}</GradientText>
                                </div>
                                {recommendation?.benefits && recommendation.benefits.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Health Benefits</p>
                                        <div className="flex flex-wrap gap-2">
                                            {recommendation.benefits.map((benefit, idx) => (
                                                <motion.span
                                                    key={idx}
                                                    className="px-3 py-1 rounded-full bg-green-500/20 text-sm text-green-400 border border-green-500/30"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.05 * idx }}
                                                >
                                                    ✓ {benefit}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </MagicBento>

                            <MagicBento>
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">All Menu Items</p>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Zap className="text-accent-soft" />
                                    </motion.div>
                                </div>

                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                    {menuItems.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            className={`flex items-center justify-between rounded-2xl border p-4 ${item.name === recommendation?.name
                                                ? 'border-accent-primary/50 bg-accent-primary/10'
                                                : 'border-white/10 bg-black/30'
                                                }`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * idx }}
                                            whileHover={{ x: 5 }}
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white">{item.name}</span>
                                                    {item.name === recommendation?.name && (
                                                        <Star className="w-4 h-4 text-accent-primary fill-accent-primary" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-white/50 mt-1">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="text-center">
                                                    <span className="text-white font-semibold">{item.calories}</span>
                                                    <p className="text-xs text-white/50">cal</p>
                                                </div>
                                                <div className="text-center">
                                                    <span className="text-white font-semibold">{item.protein}g</span>
                                                    <p className="text-xs text-white/50">protein</p>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                                    item.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {item.score}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </MagicBento>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
