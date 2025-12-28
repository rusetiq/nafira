import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Sparkles, CheckCircle, TrendingUp, Droplet, Zap, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FluidGlassModal from '../components/FluidGlassModal';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import TargetCursor from '../components/TargetCursor';
import DitheredBackground from '../components/DitheredBackground';

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
          }, 2000);
        }
      }, 140);

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
      console.log('Demo API URL:', apiBaseUrl);
      const response = await fetch(`${apiBaseUrl}/demo/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Demo analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const liveScore = result?.score ?? displayScore;
  const displayImage = uploadedImageUrl || result?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80";
  const macros = result?.macros;
  const hydration = result?.hydration;
  const adviceText = displayText || result?.advice || '';
  const hasAnalysisCompleted = result && !analyzing;

  return (
    <div className="min-h-screen bg-background-dark px-4 sm:px-6 lg:px-10 pb-20 pt-10 text-white relative overflow-hidden">
      <DitheredBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        <AnimatePresence>
          {showLoginPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleLoginRedirect}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-md w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl p-8 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 mb-6"
                >
                  <Lock className="w-10 h-10 text-accent-primary" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">
                  <GradientText>Demo Complete!</GradientText>
                </h2>
                <p className="text-white/70 mb-6 leading-relaxed">
                  You've experienced the power of NAFIRA's AI-powered nutrition analysis. Create an account to unlock unlimited meal tracking, personalized insights, and more.
                </p>
                <motion.button
                  onClick={handleLoginRedirect}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold uppercase tracking-wide shadow-lg shadow-accent-primary/30 flex items-center justify-center gap-2"
                >
                  Sign Up Now
                  <ArrowRight size={18} />
                </motion.button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="mt-4 text-sm text-white/60 hover:text-white transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title={hasAnalyzed ? "Demo Limit Reached" : "Upload or snap a meal"}>
          {hasAnalyzed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/20"
              >
                <Lock className="w-8 h-8 text-accent-primary" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold mb-3">
                  <GradientText>Upgrade to Continue</GradientText>
                </h3>
                <p className="text-white/70 leading-relaxed">
                  The demo allows one free analysis. Sign up to unlock unlimited meal tracking and personalized nutrition insights.
                </p>
              </div>
              <motion.button
                onClick={handleLoginRedirect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold uppercase tracking-wide shadow-lg shadow-accent-primary/30 flex items-center justify-center gap-2"
              >
                Create Free Account
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6 text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl border border-accent-primary/30 bg-accent-primary/10 p-4 text-sm">
                <p className="text-accent-primary font-semibold mb-1">🎉 Free Demo</p>
                <p className="text-white/70">Try one meal analysis to experience NAFIRA's AI-powered nutrition insights.</p>
              </div>
              <p className="text-sm leading-relaxed">Upload a clear photo of your meal. Natural lighting and a top-down angle provide the best analysis results.</p>
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
                <span className="text-base relative z-10">Drag & drop a meal photo or tap to browse</span>
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
          )}
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
              Demo - Meal Analysis
            </motion.p>
            <motion.h1
              className="mt-2 text-4xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              AI-Powered Nutrition Insights
            </motion.h1>
            {!hasAnalyzed && (
              <motion.p
                className="mt-2 text-sm text-accent-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Try one free analysis
              </motion.p>
            )}
          </div>
          <motion.button
            onClick={() => hasAnalyzed ? setShowLoginPrompt(true) : setModalOpen(true)}
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
              {hasAnalyzed ? <Lock size={18} className="relative z-10" /> : <Upload size={18} className="relative z-10" />}
            </motion.div>
            <span className="relative z-10">{analyzing ? 'Analyzing...' : hasAnalyzed ? 'Upgrade to Continue' : 'Upload meal'}</span>
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
                  <>
                    <TargetCursor className="left-10 top-14" />
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
                        <ShinyText className="text-2xl">Analyzing your meal...</ShinyText>
                      </motion.div>
                      <motion.p
                        className="mt-2 text-sm text-white/70"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Identifying ingredients, calculating macros, and generating insights
                      </motion.p>
                    </motion.div>
                  </>
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
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Nutritional Balance</p>
                  <div className="mt-3 flex items-center gap-3 text-2xl font-semibold">
                    <motion.div
                      animate={analyzing ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: analyzing ? Infinity : 0 }}
                    >
                      <TrendingUp className="h-6 w-6 text-accent-soft" />
                    </motion.div>
                    <span>{analyzing ? 'Calculating...' : hasAnalysisCompleted ? 'Optimized' : 'Pending'}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">Macro and micronutrient distribution</p>
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
                      <CheckCircle className="h-6 w-6 text-accent-primary" />
                    </motion.div>
                    <span>{analyzing ? 'Processing' : hasAnalysisCompleted ? 'Complete' : 'Ready'}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">AI vision model inference</p>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          </MagicBento>

          <MagicBento className="flex flex-col items-center gap-6 text-center">
            <CircularHealthScore score={liveScore} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Nutrition Score</p>
              <GradientText className="text-3xl">{analyzing ? 'Calculating...' : hasAnalysisCompleted ? 'Analysis Complete' : 'Upload to begin'}</GradientText>
            </motion.div>
            <motion.p
              className="text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              The nutrition score evaluates your meal based on macronutrient balance, ingredient quality, and overall nutritional value.
            </motion.p>
            <AnimatePresence>
              {macros && hasAnalysisCompleted && (
                <motion.div
                  className="grid w-full grid-cols-3 gap-3 text-left text-sm text-white/70"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {[
                    { label: 'Carbs', value: macros.carbs },
                    { label: 'Protein', value: macros.protein },
                    { label: 'Fats', value: macros.fats }
                  ].map((macro, idx) => (
                    <motion.div
                      key={macro.label}
                      className="rounded-2xl border border-white/10 bg-black/40 p-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      whileHover={{ y: -3, scale: 1.05 }}
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">{macro.label}</p>
                      <GradientText className="text-xl">{macro.value}g</GradientText>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </MagicBento>
        </motion.section>

        <AnimatePresence>
          {hasAnalysisCompleted && (
            <motion.section
              className="mt-10 grid gap-8 lg:grid-cols-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
            >
              <MagicBento>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">AI Recommendations</p>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap className="text-accent-soft h-5 w-5" />
                  </motion.div>
                </div>
                <div className="min-h-[150px] rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
                  <motion.p
                    className="text-base leading-relaxed"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <GradientText>{adviceText}</GradientText>
                  </motion.p>
                </div>
              </MagicBento>

              <MagicBento>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Detailed Analysis</p>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="text-accent-soft" />
                  </motion.div>
                </div>

                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {result?.ingredients && result.ingredients.length > 0 && (
                    <motion.div variants={fadeInUp}>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Detected Ingredients</p>
                      <div className="flex flex-wrap gap-2">
                        {result.ingredients.map((ingredient, idx) => (
                          <motion.span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80 border border-white/10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * idx }}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                          >
                            {ingredient}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {result?.strengths && result.strengths.length > 0 && (
                    <motion.div variants={fadeInUp}>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Nutritional Strengths</p>
                      <div className="space-y-2">
                        {result.strengths.map((strength, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start gap-2 text-sm text-green-400"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ x: 5 }}
                          >
                            <span className="mt-1">✓</span>
                            <span>{strength}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {result?.improvements && result.improvements.length > 0 && (
                    <motion.div variants={fadeInUp}>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Suggested Improvements</p>
                      <div className="space-y-2">
                        {result.improvements.map((improvement, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start gap-2 text-sm text-accent-soft"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ x: 5 }}
                          >
                            <span className="mt-1">→</span>
                            <span>{improvement}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {hydration && (
                    <motion.div
                      variants={fadeInUp}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70"
                    >
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Droplet className="h-5 w-5 text-accent-soft" />
                      </motion.div>
                      Estimated hydration contribution: {hydration}%
                    </motion.div>
                  )}
                </motion.div>
              </MagicBento>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}