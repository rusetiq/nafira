import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Zap, Leaf, Activity, Utensils, TrendingUp } from 'lucide-react';

const NoiseFilter = () => (
    <svg className="hidden">
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
        </filter>
    </svg>
);

function SlotMachineText({ text, isActive }) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!isActive) return;
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                text.split("").map((char, i) => {
                    if (i < iteration) return text[i];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );
            iteration += 1 / 2;
            if (iteration >= text.length) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [text, isActive]);

    return <span className="font-mono">{displayText}</span>;
}

function VariableNumber({ value, delay = 0 }) {
    const [current, setCurrent] = useState(0);
    const [fontWeight, setFontWeight] = useState(400);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setCurrent(prev => {
                    if (prev >= value) {
                        clearInterval(interval);
                        return value;
                    }
                    const step = Math.ceil((value - prev) / 10);
                    setFontWeight(400 + step * 50);
                    setTimeout(() => setFontWeight(700), 50);
                    return prev + step;
                });
            }, 40);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return (
        <span style={{ fontWeight, fontStretch: fontWeight > 500 ? '125%' : '100%', transition: 'all 0.1s' }}>
            {current}
        </span>
    );
}

function GlassTile({ children, className = "", delay = 0, glowing = false, gridArea }) {
    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl ${className}`}
            style={{ gridArea }}
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.3, y: -50 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay
            }}
        >
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />

            <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                    backgroundSize: '200% 200%'
                }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {glowing && (
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        boxShadow: 'inset 0 0 60px rgba(255,77,0,0.4), inset 0 0 120px rgba(255,77,0,0.2)'
                    }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            )}

            <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: glowing
                        ? '0 0 30px rgba(255,77,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
            />

            <div className="relative z-10 h-full p-6">
                {children}
            </div>
        </motion.div>
    );
}

function MacroBar({ label, value, max, color, delay = 0 }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setWidth(prev => {
                    const target = (value / max) * 100;
                    if (prev >= target) return target;
                    return prev + 5;
                });
            }, 20);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timeout);
    }, [value, max, delay]);

    return (
        <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60 uppercase tracking-wider">{label}</span>
                <span className="text-white font-bold">{value}g</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: color, width: `${width}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
            </div>
        </div>
    );
}

// 3D Globe component
function Globe3D() {
    return (
        <motion.div
            className="relative w-32 h-32 mx-auto"
            animate={{ rotateY: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle at 30% 30%, #10b981 0%, #059669 50%, #047857 100%)',
                    boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(16,185,129,0.3)'
                }}
            />
            {/* Longitude lines */}
            {[0, 45, 90, 135].map((rot) => (
                <div
                    key={rot}
                    className="absolute inset-0 rounded-full border border-white/20"
                    style={{ transform: `rotateY(${rot}deg)` }}
                />
            ))}
            {/* Latitude lines */}
            <div className="absolute left-1/2 top-1/4 w-3/4 h-px bg-white/20 -translate-x-1/2" />
            <div className="absolute left-1/2 top-1/2 w-full h-px bg-white/30 -translate-x-1/2" />
            <div className="absolute left-1/2 top-3/4 w-3/4 h-px bg-white/20 -translate-x-1/2" />
        </motion.div>
    );
}

// Parallax mesh background
function ParallaxMesh({ mouseX, mouseY }) {
    const x = useTransform(mouseX, [0, 1], [-20, 20]);
    const y = useTransform(mouseY, [0, 1], [-20, 20]);

    return (
        <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ x, y }}
        >
            <svg className="w-full h-full opacity-10">
                <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,77,0,0.3)" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </motion.div>
    );
}

const scenes = [
    { id: 'hook', duration: 2000 },
    { id: 'burst', duration: 3000 },
    { id: 'features', duration: 7000 },
    { id: 'outro', duration: 3000 },
];

export default function Showcase2Page() {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [activeTile, setActiveTile] = useState(0);
    const mouseX = useSpring(0.5, { stiffness: 100, damping: 30 });
    const mouseY = useSpring(0.5, { stiffness: 100, damping: 30 });

    const scene = scenes[sceneIndex];

    // Scene progression with loop
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSceneIndex(prev => (prev + 1) % scenes.length);
        }, scene.duration);
        return () => clearTimeout(timeout);
    }, [sceneIndex, scene.duration]);

    // Tile highlighting during features scene
    useEffect(() => {
        if (scene.id === 'features') {
            const interval = setInterval(() => {
                setActiveTile(prev => (prev + 1) % 4);
            }, 1750);
            return () => clearInterval(interval);
        }
    }, [scene.id]);

    // Mouse tracking for parallax
    const handleMouseMove = (e) => {
        mouseX.set(e.clientX / window.innerWidth);
        mouseY.set(e.clientY / window.innerHeight);
    };

    return (
        <motion.div
            className="fixed inset-0 overflow-hidden cursor-none"
            style={{ backgroundColor: '#0D0D0D' }}
            onMouseMove={handleMouseMove}
        >
            <NoiseFilter />

            {/* Noise texture overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ filter: 'url(#noise)' }}
            />

            {/* Parallax mesh background */}
            <ParallaxMesh mouseX={mouseX} mouseY={mouseY} />

            {/* Import font */}
            <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <AnimatePresence mode="wait">

                {/* SCENE 1: THE HOOK - Macro shot with laser scan */}
                {scene.id === 'hook' && (
                    <motion.div
                        key="hook"
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Caramel pancakes macro */}
                        <div className="relative w-96 h-96">
                            <div
                                className="w-full h-full rounded-3xl overflow-hidden"
                                style={{
                                    background: 'linear-gradient(145deg, #8B4513 0%, #D2691E 30%, #CD853F 60%, #DEB887 100%)',
                                    boxShadow: '0 0 100px rgba(210,105,30,0.4)'
                                }}
                            >
                                {/* Pancake texture layers */}
                                <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 p-8">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-48 h-12 rounded-full"
                                            style={{
                                                background: `linear-gradient(180deg, #D2691E ${i * 10}%, #8B4513 100%)`,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                            }}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        />
                                    ))}
                                    {/* Caramel drizzle */}
                                    <motion.div
                                        className="absolute w-32 h-32"
                                        style={{
                                            background: 'radial-gradient(ellipse, rgba(255,140,0,0.8) 0%, transparent 70%)',
                                        }}
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                            </div>

                            {/* Orange laser scan */}
                            <motion.div
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <motion.div
                                    className="absolute left-0 right-0 h-1"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, #FF4D00, transparent)',
                                        boxShadow: '0 0 30px #FF4D00, 0 0 60px #FF4D00'
                                    }}
                                    initial={{ top: 0 }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 1.5, ease: 'linear' }}
                                />
                            </motion.div>
                        </div>

                        {/* Digital chirp indicator */}
                        <motion.div
                            className="absolute bottom-20 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            <div className="flex items-center gap-2 text-orange-500">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-orange-500"
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                />
                                <span className="text-sm font-mono tracking-wider">SCANNING...</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 2: THE BURST - Shatter into Bento tiles */}
                {scene.id === 'burst' && (
                    <motion.div
                        key="burst"
                        className="absolute inset-0 flex items-center justify-center p-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="grid gap-4 w-full max-w-6xl h-[80vh]"
                            style={{
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gridTemplateRows: 'repeat(2, 1fr)',
                            }}
                        >
                            <GlassTile delay={0} gridArea="1 / 1 / 2 / 2">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-orange-500/20">
                                        <Utensils className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs">MEAL</p>
                                        <p className="text-white font-bold">Caramel Pancakes</p>
                                    </div>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.05} gridArea="1 / 2 / 2 / 3">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Health Score</p>
                                    <p className="text-6xl font-bold text-white">
                                        <VariableNumber value={87} delay={500} />
                                    </p>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.1} gridArea="1 / 3 / 2 / 4">
                                <div className="flex flex-col items-center justify-center h-full gap-2">
                                    <Activity className="w-8 h-8 text-green-500" />
                                    <p className="text-green-400 text-lg font-bold">
                                        <SlotMachineText text="READY" isActive={true} />
                                    </p>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.15} gridArea="2 / 1 / 3 / 2">
                                <MacroBar label="Carbs" value={70} max={100} color="#3b82f6" delay={300} />
                                <MacroBar label="Protein" value={39} max={100} color="#10b981" delay={400} />
                                <MacroBar label="Fats" value={22} max={100} color="#f59e0b" delay={500} />
                            </GlassTile>

                            <GlassTile delay={0.2} gridArea="2 / 2 / 3 / 3">
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Leaf className="w-8 h-8 text-emerald-500 mb-2" />
                                    <p className="text-white/60 text-xs">ECO SCORE</p>
                                    <p className="text-3xl font-bold text-emerald-400">92%</p>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.25} gridArea="2 / 3 / 3 / 4">
                                <div className="flex items-center justify-center h-full">
                                    <span
                                        className="text-4xl font-bold tracking-tight"
                                        style={{
                                            fontFamily: '"Space Grotesk", sans-serif',
                                            background: 'linear-gradient(135deg, #FF8C42 0%, #FF4D00 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        NAFIRA
                                    </span>
                                </div>
                            </GlassTile>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 3: FEATURES - Tiles glow when highlighted */}
                {scene.id === 'features' && (
                    <motion.div
                        key="features"
                        className="absolute inset-0 flex items-center justify-center p-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="grid gap-4 w-full max-w-6xl h-[80vh]"
                            style={{
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gridTemplateRows: 'repeat(2, 1fr)',
                            }}
                        >
                            <GlassTile delay={0} glowing={activeTile === 0}>
                                <div className="h-full flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 rounded-xl bg-orange-500/20">
                                            <Utensils className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs">DETECTED</p>
                                            <p className="text-white font-bold">Caramel Pancakes</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-6xl">🥞</div>
                                    </div>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.05} glowing={activeTile === 1}>
                                <div className="flex flex-col items-center justify-center h-full">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Health Score</p>
                                    <motion.p
                                        className="text-7xl font-bold text-white"
                                        animate={activeTile === 1 ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        87
                                    </motion.p>
                                    <div className="flex gap-1 mt-3">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${i < 4 ? 'bg-orange-500' : 'bg-white/20'}`}
                                                animate={activeTile === 1 ? { scale: [1, 1.3, 1] } : {}}
                                                transition={{ delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.1} glowing={activeTile === 2}>
                                <div className="h-full flex flex-col">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Macronutrients</p>
                                    <div className="flex-1">
                                        <MacroBar label="Carbs" value={70} max={100} color="linear-gradient(90deg, #3b82f6, #60a5fa)" delay={0} />
                                        <MacroBar label="Protein" value={39} max={100} color="linear-gradient(90deg, #10b981, #34d399)" delay={0} />
                                        <MacroBar label="Fats" value={22} max={100} color="linear-gradient(90deg, #f59e0b, #fbbf24)" delay={0} />
                                    </div>
                                    <div className="text-center mt-2">
                                        <span className="text-white/60 text-sm">193</span>
                                        <span className="text-white/40 text-xs ml-1">kcal</span>
                                    </div>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.15} glowing={activeTile === 3}>
                                <div className="h-full flex flex-col items-center justify-center">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Sustainability</p>
                                    <Globe3D />
                                    <p className="text-emerald-400 text-sm mt-4 font-medium">Low Carbon Footprint</p>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.2}>
                                <div className="h-full flex flex-col">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Status</p>
                                    <div className="flex-1 flex flex-col justify-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-green-400 text-sm">Analysis Complete</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            <span className="text-blue-400 text-sm">Logged to History</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-500" />
                                            <span className="text-purple-400 text-sm">Synced to Cloud</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassTile>

                            <GlassTile delay={0.25}>
                                <div className="h-full flex flex-col items-center justify-center">
                                    <TrendingUp className="w-10 h-10 text-orange-500 mb-3" />
                                    <p className="text-white font-bold">+12%</p>
                                    <p className="text-white/40 text-xs">Weekly Improvement</p>
                                </div>
                            </GlassTile>
                        </motion.div>
                    </motion.div>
                )}

                {/* SCENE 4: OUTRO - Collapse to logo */}
                {scene.id === 'outro' && (
                    <motion.div
                        key="outro"
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Collapsing tiles animation */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                        >
                            <div className="grid grid-cols-3 gap-2 w-32 h-24">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="bg-white/10 rounded"
                                        initial={{ scale: 1 }}
                                        animate={{ scale: 0, rotate: 180 }}
                                        transition={{ delay: i * 0.05, type: 'spring' }}
                                    />
                                ))}
                            </div>
                        </motion.div>

                        {/* Logo reveal */}
                        <motion.div
                            className="text-center"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <motion.h1
                                className="text-8xl md:text-9xl font-bold tracking-tight mb-6"
                                style={{
                                    fontFamily: '"Space Grotesk", sans-serif',
                                    background: 'linear-gradient(135deg, #FF8C42 0%, #FF4D00 50%, #FF6B35 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                NAFIRA
                            </motion.h1>

                            {/* Tagline flash */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <motion.p
                                    className="text-xl md:text-2xl tracking-[0.3em] uppercase font-medium"
                                    style={{ color: 'white' }}
                                    animate={{ opacity: [0, 1, 1, 0.8] }}
                                    transition={{ duration: 1, times: [0, 0.3, 0.7, 1] }}
                                >
                                    METABOLIC INTELLIGENCE. NOW.
                                </motion.p>
                            </motion.div>

                            {/* Pulsing icon */}
                            <motion.div
                                className="mt-8"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: 'spring' }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <Zap className="w-10 h-10 text-orange-500 mx-auto" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}

            </AnimatePresence>

            {/* Vignette overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)'
                }}
            />

            {/* Scene indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {scenes.map((s, i) => (
                    <motion.div
                        key={s.id}
                        className={`w-8 h-1 rounded-full ${i === sceneIndex ? 'bg-orange-500' : 'bg-white/20'}`}
                        animate={i === sceneIndex ? { scaleX: [0, 1] } : {}}
                        transition={{ duration: scene.duration / 1000, ease: 'linear' }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
