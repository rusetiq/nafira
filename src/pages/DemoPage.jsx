import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { Upload, Sparkles, CheckCircle, TrendingUp, Droplet, Zap, ArrowRight, Lock, ScanLine, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FluidGlassModal from '../components/FluidGlassModal';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import TargetCursor from '../components/TargetCursor';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

export default function DemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [displayScore, setDisplayScore] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
    if (result?.advice && !hasAnalyzed) {
      setHasAnalyzed(true);
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
          setTimeout(() => {
            setShowLoginPrompt(true);
          }, 4000); // Give them time to read before prompt
        }
      }, 100);

      return () => clearInterval(interval);
    }
    return () => { };
  }, [analyzing, result, hasAnalyzed]);

  const handleAnalyze = async (files) => {
    const file = files?.[0];
    if (!file) return;

    if (hasAnalyzed) {
      setShowLoginPrompt(true);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    setModalOpen(false);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const apiBaseUrl = `http://${window.location.hostname}:5000/api`;
      const response = await fetch(`${apiBaseUrl}/demo/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Demo analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoginRedirect = () => navigate('/login');

  const liveScore = result?.score ?? displayScore;
  const displayImage = uploadedImageUrl || result?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80";
  const macros = result?.macros;
  // const hydration = result?.hydration; // Unused in this layout logic for simplicity, can add back if needed
  const adviceText = displayText || result?.advice || '';
  const hasAnalysisCompleted = result && !analyzing;

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
        <FloatingShape color="rgba(245, 71, 3, 0.05)" size={900} top="-30%" left="-10%" delay={0} />
        <FloatingShape color="rgba(30, 64, 175, 0.05)" size={700} bottom="-10%" right="-10%" delay={3} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md">
            <Sparkles size={14} className="text-[#f54703]" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Live Technology Demo</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8" onMouseEnter={textEnter} onMouseLeave={textLeave}>
            See Food<br />
            <span className="text-transparent" style={{ webkitTextStroke: '1px #fff' }}>Differently.</span>
          </h1>
          <p className="text-xl text-white/50 font-light max-w-2xl mx-auto">
            Experience our advanced computer vision model. Upload a meal to get an instant nutritional breakdown.
          </p>
        </motion.header>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel: Image & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <MagicBento className="relative overflow-hidden min-h-[400px] border-white/10 p-0 group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                style={{ backgroundImage: `url(${displayImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

              {/* Scanning Overlay */}
              {analyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                  <div className="text-center">
                    <div className="w-20 h-20 border-4 border-[#f54703] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#f54703] font-mono text-sm uppercase tracking-widest animate-pulse">Analyzing...</p>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#f54703] shadow-[0_0_20px_#f54703] animate-[scan_2s_ease-in-out_infinite]" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                {!hasAnalysisCompleted && !analyzing && (
                  <motion.button
                    onClick={() => setModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-[#f54703] text-[#050505] font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-colors"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                  >
                    Upload Photo
                  </motion.button>
                )}
                {hasAnalysisCompleted && (
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                      <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Status</div>
                      <div className="text-green-400 font-bold flex items-center gap-2"><CheckCircle size={14} /> Complete</div>
                    </div>
                  </div>
                )}
              </div>
            </MagicBento>
          </div>

          {/* Right Panel: Data HUD */}
          <div className="lg:col-span-7 space-y-6">
            {/* Score & Macros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <MagicBento className="bg-[#111] border-white/10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Nutrition Score</div>
                  <Activity className="text-white/20" size={20} />
                </div>
                <div className="mt-8">
                  <div className="text-7xl font-black tracking-tighter flex items-baseline gap-2">
                    {liveScore}
                    <span className="text-2xl font-normal text-white/30">/100</span>
                  </div>
                </div>
              </MagicBento>

              <MagicBento className="bg-[#111] border-white/10">
                <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Macro Breakdown</div>
                <div className="space-y-4">
                  {macros ? (
                    <>
                      <MacroBar label="Protein" value={macros.protein} color="#f54703" />
                      <MacroBar label="Carbs" value={macros.carbs} color="#3b82f6" />
                      <MacroBar label="Fats" value={macros.fats} color="#eab308" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20 text-sm font-mono">
                      Waiting for data...
                    </div>
                  )}
                </div>
              </MagicBento>
            </div>

            {/* AI Analysis Feed */}
            <MagicBento className="bg-gradient-to-br from-white/10 to-transparent border-white/10 min-h-[300px]">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={18} className="text-[#f54703]" />
                <h3 className="text-sm font-bold uppercase tracking-widest">AI Intelligence</h3>
              </div>

              <div className="space-y-4">
                {adviceText ? (
                  <p className="text-xl font-light leading-relaxed text-white/90">
                    {adviceText}
                    <span className="inline-block w-2 h-5 bg-[#f54703] ml-1 animate-pulse align-middle" />
                  </p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 opacity-30">
                    <Search size={48} className="mb-4" />
                    <p className="font-mono text-xs uppercase tracking-widest">Awaiting Input</p>
                  </div>
                )}
              </div>

              {result?.ingredients && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-4">Detected Components</p>
                  <div className="flex flex-wrap gap-2">
                    {result.ingredients.map((ing, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-white/70">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </MagicBento>
          </div>
        </div>

        {/* Modals & Prompts */}
        <AnimatePresence>
          {showLoginPrompt && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
            >
              <div className="max-w-md w-full p-1 rounded-[2.5rem] bg-gradient-to-br from-[#f54703] to-purple-600">
                <div className="bg-[#050505] rounded-[2.4rem] p-10 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 text-white">
                      <Lock size={32} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Demo Complete</h2>
                    <p className="text-white/50 mb-8">
                      You've seen the power of Nafira AI. Create an account to unlock unlimited analysis and personalized tracking.
                    </p>
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Create Free Account
                    </button>
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="mt-4 text-xs font-mono uppercase tracking-widest text-white/30 hover:text-white"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Analyze Meal">
          <div className="p-8">
            <label
              className="flex flex-col items-center justify-center gap-4 p-12 rounded-3xl border-2 border-dashed border-white/10 hover:border-[#f54703] hover:bg-white/5 transition-all cursor-pointer group"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleAnalyze(e.dataTransfer.files); }}
            >
              <Upload size={32} className="text-white/30 group-hover:text-[#f54703] transition-colors" />
              <div className="text-center">
                <p className="font-bold uppercase tracking-widest text-sm mb-1">Drop Image Here</p>
                <p className="text-xs text-white/30">or click to browse</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAnalyze(e.target.files)}
              />
            </label>
          </div>
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

function MacroBar({ label, value, color }) {
  return (
    <div className="group">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/50 mb-2">
        <span>{label}</span>
        <span className="text-white">{value}g</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }} // varied scales
          transition={{ duration: 1, ease: "circOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}