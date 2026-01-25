import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Leaf, Droplet, TrendingDown, Lightbulb, RefreshCw, ArrowUpRight } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import api from '../services/api';

export default function SustainabilityPage() {
    const [stats, setStats] = useState(null);
    const [impact, setImpact] = useState(null);
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [backfilling, setBackfilling] = useState(false);

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

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [statsData, impactData, tipsData] = await Promise.all([
                api.get('/sustainability/stats'),
                api.get('/sustainability/impact'),
                api.get('/sustainability/tips')
            ]);
            setStats(statsData);
            setImpact(impactData);
            setTips(tipsData);
        } catch (error) { console.error('Error loading data:', error); }
        finally { setLoading(false); }
    };

    const handleBackfill = async () => {
        setBackfilling(true);
        try {
            const result = await api.post('/sustainability/backfill', {});
            alert(`Success! ${result.message}`);
            await loadData();
        } catch (error) { console.error('Backfill error:', error); }
        finally { setBackfilling(false); }
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 tracking-widest uppercase text-xs">Analyzing Impact...</div>;

    const hasNoData = !stats?.totalMeals && !impact?.mealsAnalyzed;

    return (
        <div className="min-h-screen bg-[#050505] px-6 lg:px-10 pb-20 pt-10 text-white relative overflow-hidden font-display cursor-none">
            {/* Custom Cursor */}
            <motion.div
                className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
                variants={cursorVariants}
                animate={cursorVariant}
                style={{ translateX: cursorX, translateY: cursorY }}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <FloatingShape color="rgba(34, 197, 94, 0.05)" size={800} top="-10%" right="-10%" delay={0} />
                <FloatingShape color="rgba(6, 182, 212, 0.05)" size={600} bottom="10%" left="-5%" delay={4} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.header
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Leaf size={20} className="text-green-500" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Eco-Metrics</span>
                        </div>
                        <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                            Planetary<br />Impact
                        </h1>
                    </div>
                    <motion.button
                        onClick={handleBackfill}
                        disabled={backfilling}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black font-bold uppercase text-xs tracking-widest disabled:opacity-50 transition-all"
                        onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                        <RefreshCw size={14} className={backfilling ? 'animate-spin' : ''} />
                        {backfilling ? 'Processing...' : 'Analyze Past Meals'}
                    </motion.button>
                </motion.header>

                {hasNoData && (
                    <div className="bg-white/5 border border-white/10 p-12 text-center rounded-[2.5rem] mb-12">
                        <Leaf className="w-12 h-12 mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-2">No Data Available</h3>
                        <p className="text-white/50 text-sm">Analyze existing meals to unlock your personalized impact report.</p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <div className="flex justify-between items-start mb-8">
                            <Leaf className="w-6 h-6 text-green-500" />
                            <ArrowUpRight size={16} className="text-white/20" />
                        </div>
                        <p className="text-5xl font-black">{stats?.avgScore || 0}</p>
                        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">Sustainability Score</p>
                    </SpotlightCard>

                    <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <div className="flex justify-between items-start mb-8">
                            <TrendingDown className="w-6 h-6 text-[#f54703]" />
                            <ArrowUpRight size={16} className="text-white/20" />
                        </div>
                        <p className="text-5xl font-black">{impact?.totalCarbon?.toFixed(1) || 0}</p>
                        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">kg CO₂ Footprint</p>
                    </SpotlightCard>

                    <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <div className="flex justify-between items-start mb-8">
                            <Droplet className="w-6 h-6 text-blue-500" />
                            <ArrowUpRight size={16} className="text-white/20" />
                        </div>
                        <p className="text-5xl font-black">{Math.round(impact?.totalWater || 0)}</p>
                        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">Liters Water Used</p>
                    </SpotlightCard>

                    <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-6 h-6 rounded-full border-2 border-green-500" />
                            <ArrowUpRight size={16} className="text-white/20" />
                        </div>
                        <p className="text-5xl font-black">{stats?.plantBasedPercent || 0}%</p>
                        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mt-2">Plant-Based Meals</p>
                    </SpotlightCard>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    <MagicBento className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem]">
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8" onMouseEnter={textEnter} onMouseLeave={textLeave}>Overall Impact</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-colors">
                                <span className="text-xs font-mono uppercase tracking-widest text-white/60">Meals Analyzed</span>
                                <span className="text-xl font-bold">{impact?.mealsAnalyzed || stats?.totalMeals || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-colors">
                                <span className="text-xs font-mono uppercase tracking-widest text-white/60">Offset Equivalent</span>
                                <div className="text-right">
                                    <span className="text-xl font-bold block">{impact?.treesEquivalent || 0}</span>
                                    <span className="text-[10px] text-white/30 uppercase">Trees Planted</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl transition-colors">
                                <span className="text-xs font-mono uppercase tracking-widest text-white/60">Avg Carbon / Meal</span>
                                <span className="text-xl font-bold">{stats?.avgCarbon?.toFixed(2) || 0} kg</span>
                            </div>
                        </div>
                    </MagicBento>

                    <MagicBento className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem]">
                        <div className="flex items-center gap-3 mb-8">
                            <Lightbulb className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-2xl font-bold uppercase tracking-tight">AI Insights</h2>
                        </div>
                        <div className="space-y-4">
                            {tips.slice(0, 5).map((tip, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-5 bg-white/5 border-l-2 border-white/20 hover:border-[#f54703] rounded-r-2xl transition-all"
                                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                                >
                                    <h3 className="font-bold uppercase text-sm mb-2">{tip.title}</h3>
                                    <p className="text-xs text-white/50 leading-relaxed mb-3">{tip.description}</p>
                                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${tip.impact === 'high' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                        {tip.impact} impact
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </MagicBento>
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
