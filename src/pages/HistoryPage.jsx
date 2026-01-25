import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Award, TrendingUp, Calendar, Download, Sparkles, ArrowUpRight } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import api from '../services/api';
import { exportToPDF } from '../services/pdfService';
import { formatLocalDateTime } from '../utils/timeUtils';

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
      className="rounded-xl border border-white/10 bg-[#050505] backdrop-blur-xl px-4 py-3 text-sm shadow-xl"
    >
      <p className="text-white font-mono uppercase tracking-widest text-xs mb-2 opacity-50">{label}</p>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-3 text-sm font-bold">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="capitalize text-white/70">{item.dataKey}:</span>
          <span className="text-white text-lg">{item.value}</span>
        </div>
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-display">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-4 border-[#f54703] border-r-4 border-r-transparent rounded-full animate-spin" />
          <span className="text-white/50 tracking-[0.2em] text-sm uppercase">Loading History</span>
        </div>
      </div>
    );
  }

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
        <FloatingShape color="rgba(245, 71, 3, 0.05)" size={800} top="0%" right="-20%" delay={0} />
        <FloatingShape color="rgba(30, 64, 175, 0.05)" size={600} bottom="10%" left="-10%" delay={4} />
      </div>

      <div id="history-content" className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-4"
            >
              <TrendingUp size={16} className="text-[#f54703]" />
              <span className="text-white/50 font-mono text-xs uppercase tracking-[0.2em]">History & Progress</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              Your Journey
            </h1>
          </div>

          <motion.button
            onClick={handleExport}
            disabled={isExporting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            className="group relative px-6 py-3 border border-white/20 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <Download size={18} />
              {isExporting ? 'Exporting...' : 'Export Report'}
            </span>
          </motion.button>
        </motion.header>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <MagicBento className="border-white/10 bg-[#0d0d0e]/50 min-h-[400px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Performance</h3>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest mt-1">Weekly Score Trend</p>
              </div>
            </div>
            <div className="h-[300px] w-full" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineColors" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f54703" />
                      <stop offset="100%" stopColor="#ff8c00" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff40" tickLine={false} axisLine={false} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="#ffffff40" tickLine={false} axisLine={false} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="score" stroke="url(#lineColors)" strokeWidth={4} fill="url(#lineColors)" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="score" stroke="url(#lineColors)" strokeWidth={4} dot={{ fill: '#050505', stroke: '#f54703', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>

          <MagicBento className="border-white/10 bg-[#0d0d0e]/50 min-h-[400px]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold uppercase tracking-tight">Calories</h3>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest mt-1">Daily Intake Distribution</p>
              </div>
            </div>
            <div className="h-[300px] w-full" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="calGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f54703" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f54703" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="#ffffff40" tickLine={false} axisLine={false} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis stroke="#ffffff40" tickLine={false} axisLine={false} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 2 }} />
                  <Area
                    type="monotone"
                    dataKey="calories"
                    stroke="#f54703"
                    strokeWidth={2}
                    fill="url(#calGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </MagicBento>
        </div>

        {/* Meals Timeline */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-3xl font-black uppercase tracking-tight">Timeline</h2>
              <div className="h-px flex-1 bg-white/10 mx-6 mb-2" />
            </div>

            <div className="space-y-4">
              {timelineMeals.map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="group flex gap-6 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-[#f54703]/50 transition-all"
                  onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL.replace('/api', '')}${meal.image})` }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold uppercase tracking-tight group-hover:text-[#f54703] transition-colors">
                        {meal.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/40">{formatLocalDateTime(meal.date)}</span>
                        <div className="px-2 py-1 bg-white/10 rounded-md font-mono font-bold text-xs">{meal.score}</div>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm line-clamp-2 mb-4 font-light">
                      {meal.notes}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-[#f54703]">
                      <span className="flex items-center gap-1 group/link cursor-pointer">
                        Full Details <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-10">
              <div className="mb-6">
                <h2 className="text-xl font-bold uppercase tracking-tight">Milestones</h2>
              </div>
              <div className="grid gap-4">
                {glowBadges.map((badge, idx) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent hover:from-[#f54703]/20 hover:to-transparent transition-colors group cursor-pointer"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                  >
                    <div className="bg-[#0a0a0a] rounded-xl p-5 border border-white/5 h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award size={48} />
                      </div>
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-[#f54703]/10 flex items-center justify-center text-[#f54703] mb-3 group-hover:scale-110 transition-transform">
                          <Award size={20} />
                        </div>
                        <h4 className="font-bold uppercase tracking-tight text-sm mb-1">{badge.title}</h4>
                        <p className="text-xs text-white/40">{badge.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {glowBadges.length === 0 && (
                  <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center">
                    <p className="text-white/30 text-xs uppercase tracking-widest">No badges earned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
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