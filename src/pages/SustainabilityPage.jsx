import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplet, TrendingDown, Lightbulb, RefreshCw } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import GradientText from '../components/GradientText';
import DitheredBackground from '../components/DitheredBackground';
import api from '../services/api';

export default function SustainabilityPage() {
    const [stats, setStats] = useState(null);
    const [impact, setImpact] = useState(null);
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [backfilling, setBackfilling] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

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
        } catch (error) {
            console.error('Error loading sustainability data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackfill = async () => {
        setBackfilling(true);
        try {
            const result = await api.post('/sustainability/backfill', {});
            alert(`Success! ${result.message}`);
            await loadData();
        } catch (error) {
            console.error('Backfill error:', error);
            alert('Failed to backfill sustainability data');
        } finally {
            setBackfilling(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-orange-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    const hasNoData = !stats?.totalMeals && !impact?.mealsAnalyzed;

    return (
        <div className="min-h-screen bg-background-dark px-3 sm:px-6 lg:px-10 pb-16 sm:pb-20 pt-6 sm:pt-10 text-white relative overflow-hidden">
            <DitheredBackground />

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.header
                    className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/60">
                            Planetary Health Diet
                        </p>
                        <h1 className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                            <GradientText>Environmental Impact</GradientText>
                        </h1>
                        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-white/60">
                            Track your food's impact on the planet
                        </p>
                    </div>
                    <motion.button
                        onClick={handleBackfill}
                        disabled={backfilling}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-medium disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={backfilling ? 'animate-spin' : ''} />
                        {backfilling ? 'Analyzing...' : 'Analyze Past Meals'}
                    </motion.button>
                </motion.header>

                {hasNoData && (
                    <MagicBento className="text-center py-8 mb-8">
                        <Leaf className="w-16 h-16 mx-auto text-white/40 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Sustainability Data Yet</h3>
                        <p className="text-white/60 mb-6 max-w-md mx-auto">
                            Click "Analyze Past Meals" to calculate sustainability metrics for your existing meals,
                            or log a new meal to see your environmental impact.
                        </p>
                    </MagicBento>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <MagicBento>
                        <div className="flex items-center gap-3 mb-2">
                            <Leaf className="w-6 h-6 text-green-400" />
                            <p className="text-sm text-white/60">Sustainability Score</p>
                        </div>
                        <p className={`text-4xl font-bold ${getScoreColor(stats?.avgScore || 0)}`}>
                            {stats?.avgScore || 0}
                        </p>
                        <p className="text-xs text-white/50 mt-1">Out of 100</p>
                    </MagicBento>

                    <MagicBento>
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingDown className="w-6 h-6 text-orange-400" />
                            <p className="text-sm text-white/60">Carbon Footprint</p>
                        </div>
                        <p className="text-4xl font-bold">
                            <GradientText>{impact?.totalCarbon?.toFixed(1) || 0}</GradientText>
                        </p>
                        <p className="text-xs text-white/50 mt-1">kg CO₂</p>
                    </MagicBento>

                    <MagicBento>
                        <div className="flex items-center gap-3 mb-2">
                            <Droplet className="w-6 h-6 text-blue-400" />
                            <p className="text-sm text-white/60">Water Usage</p>
                        </div>
                        <p className="text-4xl font-bold">
                            <GradientText>{Math.round(impact?.totalWater || 0)}</GradientText>
                        </p>
                        <p className="text-xs text-white/50 mt-1">liters</p>
                    </MagicBento>

                    <MagicBento>
                        <div className="flex items-center gap-3 mb-2">
                            <Leaf className="w-6 h-6 text-green-400" />
                            <p className="text-sm text-white/60">Plant-Based</p>
                        </div>
                        <p className="text-4xl font-bold text-green-400">
                            {stats?.plantBasedPercent || 0}%
                        </p>
                        <p className="text-xs text-white/50 mt-1">of meals</p>
                    </MagicBento>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <MagicBento>
                        <h2 className="text-xl font-semibold mb-4">
                            <GradientText>Your Environmental Impact</GradientText>
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                <span className="text-white/80">Meals Analyzed</span>
                                <span className="font-semibold">{impact?.mealsAnalyzed || stats?.totalMeals || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                <span className="text-white/80">Trees to Offset</span>
                                <span className="font-semibold">{impact?.treesEquivalent || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                                <span className="text-white/80">Avg Carbon per Meal</span>
                                <span className="font-semibold">{stats?.avgCarbon?.toFixed(2) || 0} kg</span>
                            </div>
                        </div>
                    </MagicBento>

                    <MagicBento>
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-xl font-semibold">
                                <GradientText>Eco-Friendly Tips</GradientText>
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {tips.slice(0, 5).map((tip, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                                >
                                    <h3 className="font-semibold text-sm mb-1">{tip.title}</h3>
                                    <p className="text-xs text-white/60">{tip.description}</p>
                                    <span className={`text-xs mt-2 inline-block px-2 py-1 rounded ${tip.impact === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
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

