import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, TrendingUp, Calendar, Download, Sparkles } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import DitheredBackground from '../components/DitheredBackground';
import api from '../services/api';
import { exportToPDF } from '../services/pdfService';

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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl px-4 py-3 text-sm shadow-xl"
    >
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="text-xs text-white/70">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }} />
          {item.dataKey}: {item.value}
        </p>
      ))}
    </motion.div>
  );
}

export default function HistoryPage() {
  const [timelineMeals, setTimelineMeals] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [glowBadges, setGlowBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [meals, stats, badges] = await Promise.all([
        api.getMealHistory(20),
        api.getWeeklyStats(),
        api.getBadges()
      ]);
      setTimelineMeals(meals);
      setWeeklyTrend(stats);
      setGlowBadges(badges);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('history-content', 'Nafira-History-Report');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            <Sparkles className="text-accent-primary w-12 h-12 mb-4" />
          </motion.div>
          <p className="text-white text-xl">Loading history...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark px-4 sm:px-6 lg:px-10 pb-20 pt-10 text-white relative overflow-hidden">
      <DitheredBackground />
      
      <div id="history-content" className="relative z-10 max-w-7xl mx-auto">
        <motion.header 
          className="flex flex-wrap items-center justify-between gap-6 mb-10"
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
              History & Progress
            </motion.p>
            <motion.h1 
              className="mt-2 text-4xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GradientText>Your Nutrition Journey</GradientText>
            </motion.h1>
            <motion.p 
              className="mt-2 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Track your meals, trends, and achievements over time
            </motion.p>
          </div>
          <motion.button
            onClick={handleExport}
            disabled={isExporting}
            whileHover={{ scale: isExporting ? 1 : 1.05 }}
            whileTap={{ scale: isExporting ? 1 : 0.95 }}
            className="group relative flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-medium uppercase tracking-wider text-white/80 transition-all duration-300 hover:border-accent-soft hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <motion.div
              animate={isExporting ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: isExporting ? Infinity : 0, ease: 'linear' }}
              className="relative z-10"
            >
              <Download size={18} />
            </motion.div>
            <span className="relative z-10">{isExporting ? 'Exporting...' : 'Export Report'}</span>
          </motion.button>
        </motion.header>

        <motion.section 
          className="grid gap-8 lg:grid-cols-[1fr_1fr]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <MagicBento>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Performance Metrics</p>
                    <h2 className="text-2xl font-semibold mt-1">Weekly Health Trend</h2>
                  </div>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp className="text-accent-primary" size={24} />
                  </motion.div>
                </div>
                <motion.div 
                  className="h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f54703" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#f54703" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        stroke="#ffffff40" 
                        tickLine={false} 
                        axisLine={false}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#ffffff40" 
                        tickLine={false} 
                        axisLine={false}
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip content={<TrendTooltip />} />
                      <Area type="monotone" dataKey="score" stroke="#f54703" fill="url(#scoreGradient)" strokeWidth={3} />
                      <Line type="monotone" dataKey="calories" stroke="#FD8B5D" strokeWidth={2} dot={{ fill: '#FD8B5D', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>
              </MagicBento>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <MagicBento>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Caloric Intake</p>
                    <h2 className="text-2xl font-semibold mt-1">Daily Calorie Distribution</h2>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Calendar className="text-accent-soft" size={24} />
                  </motion.div>
                </div>
                <motion.div 
                  className="h-56"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFC299" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FFC299" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="day" 
                        stroke="#ffffff40" 
                        tickLine={false} 
                        axisLine={false}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#ffffff40" 
                        tickLine={false} 
                        axisLine={false}
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip content={<TrendTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#FFC299" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#calGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </MagicBento>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <MagicBento>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Meal Timeline</p>
                  <h2 className="text-2xl font-semibold mt-1">Recent Meals</h2>
                </div>
              </div>
              <motion.div 
                className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {timelineMeals.map((meal, idx) => (
                  <motion.div 
                    key={meal.id}
                    variants={fadeInUp}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 transition-all duration-300 hover:bg-white/10 hover:border-accent-primary/30 cursor-pointer relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <motion.div
                      className="h-20 w-20 flex-shrink-0 rounded-xl bg-cover bg-center border border-white/10 relative z-10"
                      style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL.replace('/api', '')}${meal.image})` }}
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-base font-semibold truncate group-hover:text-accent-primary transition-colors duration-300">{meal.title}</p>
                          <p className="text-xs text-white/60 mt-1">{meal.date}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Score</p>
                          <GradientText className="text-2xl font-bold">{meal.score}</GradientText>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-white/70 line-clamp-2">{meal.notes}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </MagicBento>
          </motion.div>
        </motion.section>

        <AnimatePresence>
          {glowBadges.length > 0 && (
            <motion.section 
              className="mt-10"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Achievements</p>
                <h2 className="text-3xl font-semibold mt-1">
                  <GradientText>Your Milestones</GradientText>
                </h2>
              </motion.div>
              <motion.div 
                className="grid gap-6 md:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {glowBadges.map((badge, idx) => (
                  <motion.div
                    key={badge.id}
                    variants={fadeInUp}
                  >
                    <SpotlightCard 
                      delay={0}
                      className="relative overflow-hidden bg-white/5 text-center p-6 group hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="relative z-10">
                        <motion.div 
                          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-soft/20 border border-accent-primary/30 mb-4"
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Award className="text-accent-primary" size={32} />
                        </motion.div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">Achievement Unlocked</p>
                        <GradientText className="text-xl font-bold mb-2">{badge.title}</GradientText>
                        <p className="text-sm text-white/70">{badge.description}</p>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}