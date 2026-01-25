import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Upload, Coffee, CheckCircle, Heart, Users, TrendingUp, Plus, ArrowRight, Zap } from 'lucide-react';
import GradientText from '../components/GradientText';
import SpotlightCard from '../components/SpotlightCard';
import MagicBento from '../components/MagicBento';
import FluidGlassModal from '../components/FluidGlassModal';
import { useAppData } from '../context/AppDataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [aiInsight, setAiInsight] = useState('Loading your personalized insight...');
  const [greeting, setGreeting] = useState('');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const { quickStats, recentMeals, startAnalysis } = useAppData();
  const { user } = useAuth();

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
      backgroundColor: "transparent", border: "1px solid #fff",
      mixBlendMode: "difference"
    }
  };

  const textEnter = () => setCursorVariant("hover");
  const textLeave = () => setCursorVariant("default");

  useEffect(() => {
    const fetchAIFocus = async () => {
      try {
        const data = await api.getAIFocus();
        setAiInsight(data.insight);
        setGreeting(data.greeting);
      } catch (error) {
        console.error('Failed to fetch AI focus:', error);
        const hour = new Date().getHours();
        const timeGreet = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
        setGreeting(`${timeGreet}, ${user?.name || 'there'}`);
        setAiInsight('Your metabolic journey is unique. Every meal is data, every choice compounds toward your goals.');
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    fetchAIFocus();
  }, [user]);

  const handleFile = async (files) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await startAnalysis(file);
    setLastRun(result);
    setUploading(false);
    setModalOpen(false);
  };

  const truncateText = (text, wordLimit = 5) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center font-display">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-t-4 border-[#f54703] border-r-4 border-r-transparent rounded-full animate-spin" />
          <span className="text-white/50 tracking-[0.2em] text-sm uppercase">Syncing Dashboard</span>
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
        <FloatingShape color="rgba(245, 71, 3, 0.08)" size={800} top="-20%" right="-10%" delay={0} />
        <FloatingShape color="rgba(30, 64, 175, 0.05)" size={600} bottom="-10%" left="10%" delay={4} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20">
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
              <span className="w-2 h-2 rounded-full bg-[#f54703] animate-pulse" />
              <span className="text-[#f54703] font-mono text-xs uppercase tracking-[0.2em]">Live Dashboard</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-2" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              {greeting || `Hello, ${user?.name || 'There'}`}
            </h1>
            <p className="text-white/40 text-lg font-light tracking-wide max-w-xl">
              Your metabolic data suggests you are trending <span className="text-white">upward</span> this week.
            </p>
          </div>

          <motion.button
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={textEnter} onMouseLeave={textLeave}
            className="group relative px-8 py-4 bg-[#f54703] text-[#050505] rounded-full font-black uppercase tracking-wider overflow-hidden shadow-[0_0_30px_rgba(245,71,3,0.3)] hover:shadow-[0_0_50px_rgba(245,71,3,0.5)] transition-shadow whitespace-nowrap min-w-fit shrink-0"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Upload size={20} />
              Analyze Meal
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </motion.button>
        </motion.header>

        {/* Quick Stats Grid */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {quickStats.filter(s => !s.label.toLowerCase().includes('macro')).map((stat, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <SpotlightCard className="h-full bg-white/5 border-white/10 hover:border-[#f54703]/30" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                <div className="flex flex-col h-full justify-between gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">{stat.label}</span>
                    <TrendingUp size={16} className="text-[#f54703]" />
                  </div>
                  <div>
                    <div className="text-4xl font-black tracking-tight flex items-baseline gap-1">
                      {stat.value}
                      {/* Unit inference hack for display, could be passed in prop */}
                      <span className="text-sm font-normal text-white/30 uppercase tracking-normal">
                        {stat.label.includes('Calories') ? 'kcal' : stat.label.includes('Protein') ? 'g' : ''}
                      </span>
                    </div>
                    <div className="text-xs text-white/50 mt-2 font-mono flex items-center gap-2">
                      <span className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">{stat.delta}</span>
                      <span>vs last week</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.section>

        {/* Main Content Areas */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Meals Feed */}
          <MagicBento className="min-h-[500px] border-white/10 bg-[#0d0d0e]/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight">Recent Logs</h2>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest mt-1">Vision AI Analysis</p>
              </div>
              <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {recentMeals.slice(0, 3).map((meal, idx) => (
                <motion.div
                  key={meal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  onClick={() => setSelectedMeal(meal)}
                  className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#f54703]/30 transition-all cursor-crosshair relative overflow-hidden"
                  onMouseEnter={textEnter} onMouseLeave={textLeave}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f54703]/20 to-[#f54703]/5 flex items-center justify-center text-[#f54703]">
                        <Zap size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg leading-tight group-hover:text-[#f54703] transition-colors">{meal.name}</h4>
                        <p className="text-xs text-white/40 mt-1 font-mono uppercase">{meal.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">{meal.score}</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">Score</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.button
                className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-white/30 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
                onClick={() => setModalOpen(true)}
                onMouseEnter={textEnter} onMouseLeave={textLeave}
              >
                + Log New Meal
              </motion.button>
            </div>
          </MagicBento>

          {/* AI Insights & SDGs */}
          <div className="flex flex-col gap-6">
            <MagicBento className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-white/10">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-full bg-[#f54703]/10 text-[#f54703]">
                  <Coffee size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Daily Focus</h3>
                  <p className="text-xs text-white/40 font-mono uppercase tracking-widest mt-1">AI Generated Strategy</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed font-light text-white/80 border-l-2 border-[#f54703] pl-6 my-4">
                "{aiInsight}"
              </p>
            </MagicBento>

            <MagicBento className="flex-1 bg-white/5 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <Heart size={100} />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                  UN Goal 3
                </span>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Well-Being First</h3>
                <p className="text-sm text-white/60 mb-6 max-w-sm">
                  Your journey directly contributes to the global goal of ensuring healthy lives and promoting well-being for all ages.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
                    <Users size={14} /> Community
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40">
                    <TrendingUp size={14} /> Longevity
                  </div>
                </div>
              </div>
            </MagicBento>
          </div>
        </div>

        {/* Modals */}
        <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Analyze Meal">
          <motion.div className="flex flex-col gap-8 text-center py-6">
            <div className="p-1 rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent">
              <motion.label
                className={`flex flex-col items-center justify-center gap-6 rounded-[1.9rem] bg-[#0d0d0e] border border-white/10 p-12 transition-all cursor-pointer group ${isDragging ? 'bg-white/5 border-[#f54703]' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files); }}
                whileHover={{ scale: 0.99 }}
              >
                <div className="w-20 h-20 rounded-full bg-[#f54703]/10 flex items-center justify-center text-[#f54703] group-hover:scale-110 transition-transform duration-500">
                  <Upload size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight">Drop Image Here</h3>
                  <p className="text-white/40 text-sm">or click to browse device</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files)}
                />
              </motion.label>
            </div>
          </motion.div>
        </FluidGlassModal>

        <FluidGlassModal open={!!selectedMeal} onClose={() => setSelectedMeal(null)} title={selectedMeal?.name || 'Meal Details'}>
          {selectedMeal && (
            <motion.div className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <div className="text-4xl font-black text-[#f54703] mb-1">{selectedMeal.score}</div>
                  <div className="text-xs uppercase tracking-widest text-white/40">Health Score</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="text-right">
                    <div className="text-xl font-bold">{selectedMeal.time}</div>
                    <div className="text-xs uppercase tracking-widest text-white/40">Logged Time</div>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Zap size={20} className="text-[#f54703]" />
                  <span className="text-sm font-bold uppercase tracking-widest">AI Analysis</span>
                </div>
                <p className="text-lg font-light leading-relaxed text-white/80">{selectedMeal.advice}</p>
              </div>
            </motion.div>
          )}
        </FluidGlassModal>
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