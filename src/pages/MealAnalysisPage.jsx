import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Upload, Sparkles, CheckCircle, TrendingUp, Droplet, Zap, Share2 } from 'lucide-react';
import FluidGlassModal from '../components/FluidGlassModal';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import TargetCursor from '../components/TargetCursor';
import ShareToStoryModal from '../components/ShareToStoryModal';
import LegalDisclaimer from '../components/LegalDisclaimer';
import { useAppData } from '../context/AppDataContext.jsx';

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

function CircularHealthScore({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
    >
      <svg width="200" height="200" className="text-white/20">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC299" />
            <stop offset="60%" stopColor="#FD8B5D" />
            <stop offset="100%" stopColor="#f54703" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="100" r={radius} stroke="currentColor" strokeWidth="12" fill="none" />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.text
          x="50%"
          y="45%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-3xl font-semibold fill-white"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.text>
        <motion.text
          x="50%"
          y="60%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-sm fill-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Health score
        </motion.text>
      </svg>
    </motion.div>
  );
}

export default function MealAnalysisPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [displayScore, setDisplayScore] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { analysisState, startAnalysis } = useAppData();
  const analyzing = analysisState.running;
  const result = analysisState.result;

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

  useEffect(() => {
    if (analyzing) {
      setDisplayText('');
      setDisplayScore(0);
      return () => { };
    }
    if (result?.advice) {
      setDisplayText('');
      setDisplayScore(0);
      const fullText = result.advice;
      const words = fullText.split(' ');
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayText(words.slice(0, currentIndex + 1).join(' '));
          setDisplayScore((prev) => Math.min(result.score, prev + 3));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 140);

      return () => clearInterval(interval);
    }
    return () => { };
  }, [analyzing, result]);

  const handleAnalyze = async (files) => {
    const file = files?.[0];
    if (!file) return;

    setModalOpen(false);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    await startAnalysis(file);
  };

  const liveScore = result?.score ?? displayScore;
  const displayImage = uploadedImageUrl || result?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80";
  const macros = result?.macros;
  const hydration = result?.hydration;
  const adviceText = displayText || result?.advice || '';
  const hasAnalysisCompleted = result && !analyzing;

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
        <FloatingShape color="rgba(245, 71, 3, 0.05)" size={800} top="-20%" right="-10%" delay={0} />
        <FloatingShape color="rgba(30, 64, 175, 0.05)" size={600} bottom="-10%" left="10%" delay={4} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload or snap a meal">
          <motion.div className="space-y-6 text-white/80">
            <p className="text-sm leading-relaxed">Upload a clear photo of your meal. Natural lighting and a top-down angle provide the best analysis results.</p>
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
              <span className="text-base relative z-10">Drag & drop a meal photo or tap to browse</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleAnalyze(e.target.files)} />
            </motion.label>
          </motion.div>
        </FluidGlassModal>

        <ShareToStoryModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          mealData={{ name: result?.name || "My Healthy Meal", score: liveScore, macros: macros, image: displayImage }}
        />

        <motion.div className="flex flex-wrap items-center justify-between gap-4 mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
            <span className="text-[#f54703] font-mono text-xs uppercase tracking-[0.2em] mb-2 block">Meal Analysis</span>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
              Food Intelligence
            </h1>
          </div>
          <div className="flex gap-4">
            {hasAnalysisCompleted && (
              <motion.button onClick={() => setShareModalOpen(true)} whileHover={{ scale: 1.05 }} onMouseEnter={textEnter} onMouseLeave={textLeave} className="px-6 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
                <Share2 size={16} /> Share
              </motion.button>
            )}
            <motion.button onClick={() => setModalOpen(true)} whileHover={{ scale: 1.05 }} onMouseEnter={textEnter} onMouseLeave={textLeave} className="px-6 py-3 bg-[#f54703] text-black rounded-full font-bold uppercase text-xs tracking-widest flex items-center gap-2">
              {analyzing ? <span className="animate-spin"><Upload size={16} /></span> : <Upload size={16} />}
              {analyzing ? 'Analyzing...' : 'Upload Meal'}
            </motion.button>
          </div>
        </motion.div>

        <motion.section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <MagicBento className="relative overflow-hidden border-white/10 bg-[#0d0d0e]/50">
            <motion.div className="relative h-72 rounded-3xl border border-white/10 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${displayImage})` }} onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <AnimatePresence>
                {analyzing && (
                  <>
                    <TargetCursor className="left-10 top-14" />
                    <motion.div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-black/40">
                      <ShinyText className="text-2xl font-bold uppercase tracking-widest">Scanning...</ShinyText>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mt-6 grid gap-4 md:grid-cols-2" variants={staggerContainer} initial="hidden" animate="show">
              <motion.div variants={fadeInUp}>
                <SpotlightCard className="bg-white/5 border-white/10" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">Nutritional Balance</p>
                  <div className="mt-3 flex items-center gap-3 text-2xl font-black">
                    <TrendingUp className="text-[#f54703]" />
                    <span>{analyzing ? '...' : hasAnalysisCompleted ? 'Optimized' : 'Pending'}</span>
                  </div>
                </SpotlightCard>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <SpotlightCard className="bg-white/5 border-white/10" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono">Status</p>
                  <div className="mt-3 flex items-center gap-3 text-2xl font-black">
                    <CheckCircle className="text-[#f54703]" />
                    <span>{analyzing ? 'Processing' : hasAnalysisCompleted ? 'Complete' : 'Ready'}</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          </MagicBento>

          <MagicBento className="flex flex-col items-center gap-6 text-center border-white/10 bg-[#0d0d0e]/50">
            <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <CircularHealthScore score={liveScore} />
            </div>
            <motion.div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40 mb-2">Score</p>
              <h3 className="text-3xl font-black uppercase tracking-tight">{analyzing ? 'Calculating...' : hasAnalysisCompleted ? 'Analysis Complete' : 'Upload to begin'}</h3>
            </motion.div>

            <AnimatePresence>
              {macros && hasAnalysisCompleted && (
                <motion.div className="grid w-full grid-cols-3 gap-3 text-left text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[{ label: 'Carbs', value: macros.carbs }, { label: 'Protein', value: macros.protein }, { label: 'Fats', value: macros.fats }].map((macro) => (
                    <motion.div key={macro.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center" whileHover={{ scale: 1.05 }} onMouseEnter={textEnter} onMouseLeave={textLeave}>
                      <GradientText className="text-xl font-bold">{macro.value}g</GradientText>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{macro.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </MagicBento>
        </motion.section>

        <AnimatePresence>
          {hasAnalysisCompleted && (
            <motion.section className="mt-10 grid gap-8 lg:grid-cols-2" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
              <MagicBento className="border-white/10 bg-[#0d0d0e]/50">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">AI Insight</p>
                  <Zap className="text-[#f54703] h-5 w-5" />
                </div>
                <div className="min-h-[150px] rounded-2xl border border-white/5 bg-black/20 p-6 text-left mb-4" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <p className="text-lg font-light leading-relaxed opacity-90">{adviceText}</p>
                </div>
                <LegalDisclaimer />
              </MagicBento>

              <MagicBento className="border-white/10 bg-[#0d0d0e]/50">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">Details</p>
                  <Sparkles className="text-[#f54703]" />
                </div>

                <div className="space-y-6">
                  {result?.ingredients && (
                    <div onMouseEnter={textEnter} onMouseLeave={textLeave}>
                      <p className="text-xs font-mono uppercase tracking-widest text-[#f54703] mb-3">Ingredients</p>
                      <div className="flex flex-wrap gap-2">
                        {result.ingredients.map((ing, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wide text-white/70">{ing}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {hydration && (
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-bold uppercase tracking-wide text-white/70">
                      <Droplet className="text-[#f54703]" /> Hydration Impact: {hydration}%
                    </div>
                  )}
                </div>
              </MagicBento>
            </motion.section>
          )}
        </AnimatePresence>
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
