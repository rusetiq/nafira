import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Timer, Activity, Droplet } from 'lucide-react';
import FluidGlassModal from '../components/FluidGlassModal';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import TargetCursor from '../components/TargetCursor';
import DitheredBackground from '../components/DitheredBackground';
import { ingredientInsights } from '../data/mockData';
import { useAppData } from '../context/AppDataContext.jsx';

const STREAM_TEXT =
  'Plate scan complete. Hydration is balanced, but omega-3 to omega-6 ratio needs +1 correction. Add leafy greens for methylation support and keep protein density above 30g to sustain your metabolic glow.';

function CircularHealthScore({ score }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  return (
    <svg width="200" height="200" className="text-white/20">
      <defs>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC299" />
          <stop offset="60%" stopColor="#FD8B5D" />
          <stop offset="100%" stopColor="#f54703" />
        </linearGradient>
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
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - progress }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" className="text-3xl font-semibold fill-white">
        {score}
      </text>
      <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" className="text-sm fill-white/70">
        Health score
      </text>
    </svg>
  );
}

export default function MealAnalysisPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [displayChunks, setDisplayChunks] = useState([]);
  const [displayScore, setDisplayScore] = useState(68);
  const fileInputRef = useRef(null);
  const { analysisState, startAnalysis } = useAppData();
  const analyzing = analysisState.running;
  const result = analysisState.result;

  useEffect(() => {
    if (analyzing) {
      setDisplayChunks([]);
      setDisplayScore(68);
      return () => {};
    }
    if (result?.advice) {
      setDisplayChunks([]);
      setDisplayScore(68);
      const words = result.advice.split(' ');
      let idx = 0;
      const interval = setInterval(() => {
        setDisplayChunks((prev) => [...prev, words[idx]]);
        setDisplayScore((prev) => Math.min(result.score, prev + 3));
        idx += 1;
        if (idx >= words.length) {
          clearInterval(interval);
        }
      }, 140);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [analyzing, result]);

  const handleAnalyze = async (files) => {
    const file = files?.[0];
    if (!file) return;
    await startAnalysis(file);
    setModalOpen(false);
  };

  const liveScore = result?.score ?? displayScore;
  const liveImage = result?.image ?? "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80";
  const macros = result?.macros;
  const hydration = result?.hydration;

  const adviceText = useMemo(() => {
    if (displayChunks.length) return displayChunks.join(' ');
    if (result?.advice) return result.advice;
    return STREAM_TEXT;
  }, [displayChunks, result]);

  return (
    <div className="min-h-screen bg-background-dark px-6 pb-20 pt-10 text-white sm:px-10 lg:px-16 relative">
      <DitheredBackground />
      <div className="relative z-10">
      <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload or snap a meal">
        <div className="space-y-6 text-white/80">
          <p>FastVLM needs a clear view of textures. Natural light and top-down framing boost accuracy.</p>
          <label
            className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-white/15 bg-white/5 p-10 text-center transition hover:border-accent-primary"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleAnalyze(e.dataTransfer.files);
            }}
          >
            <Upload className="h-10 w-10 text-accent-soft" />
            <span className="text-base">Drag & drop a meal or tap to browse</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAnalyze(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70"
            >
              Browse files
            </button>
          </label>
          <button
            disabled={analyzing}
            onClick={() => fileInputRef.current?.files?.length && handleAnalyze(fileInputRef.current.files)}
            className="w-full rounded-full bg-accent-primary py-3 text-sm font-semibold uppercase tracking-wide shadow-glow disabled:opacity-50"
          >
            {analyzing ? 'Analyzing…' : 'Start analysis'}
          </button>
        </div>
      </FluidGlassModal>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Meal analysis lab</p>
          <h1 className="mt-2 text-4xl font-semibold">Upload, breathe, let AI narrate your meal.</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-accent-soft"
        >
          <Upload size={18} /> {analyzing ? 'Analysis running' : 'Upload meal'}
        </button>
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <MagicBento className="relative overflow-hidden">
          <div
            className="relative h-72 rounded-3xl border border-white/10 bg-cover bg-center"
            style={{ backgroundImage: `url(${liveImage})` }}
          >
            {analyzing && <TargetCursor className="left-10 top-14" />}
            {analyzing && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ShinyText className="text-2xl">Analyzing your meal…</ShinyText>
                <p className="mt-2 text-sm text-white/70">TargetCursor is scanning oils, grains, greens, micronutrients.</p>
              </motion.div>
            )}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SpotlightCard className="bg-black/40">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">FastVLM runtime</p>
              <div className="mt-3 flex items-center gap-3 text-2xl font-semibold">
                <Timer className="h-6 w-6 text-accent-soft" />
                <span>{analyzing ? 'Running…' : '4.2s'}</span>
              </div>
              <p className="mt-2 text-sm text-white/60">Average inference per frame</p>
            </SpotlightCard>
            <SpotlightCard className="bg-black/40">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Texture fidelity</p>
              <div className="mt-3 flex items-center gap-3 text-2xl font-semibold">
                <Activity className="h-6 w-6 text-accent-primary" />
                <span>{analyzing ? 'Calibrating' : '94%'}</span>
              </div>
              <p className="mt-2 text-sm text-white/60">Surface cues vs training baseline</p>
            </SpotlightCard>
          </div>
        </MagicBento>

        <MagicBento className="flex flex-col items-center gap-6 text-center">
          <CircularHealthScore score={liveScore} />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Health resonance</p>
            <GradientText className="text-3xl">Metabolic score evolving</GradientText>
          </div>
          <p className="text-white/70">
            Health score calibrates as AI identifies oils, colors, chew factors, and hydration cues. Improvements show in
            real time as you edit your plate.
          </p>
          {macros && (
            <div className="grid w-full grid-cols-3 gap-3 text-left text-sm text-white/70">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Carbs</p>
                <GradientText className="text-xl">{macros.carbs}g</GradientText>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Protein</p>
                <GradientText className="text-xl">{macros.protein}g</GradientText>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Fats</p>
                <GradientText className="text-xl">{macros.fats}g</GradientText>
              </div>
            </div>
          )}
        </MagicBento>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <MagicBento>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">GradientText output</p>
          <div className="mt-4 min-h-[150px] rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
            <motion.p
              className="text-base leading-relaxed"
              animate={{ opacity: [0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              <GradientText>{adviceText}</GradientText>
            </motion.p>
          </div>
        </MagicBento>

        <MagicBento>
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">AI Analysis Insights</p>
            <Sparkles className="text-accent-soft" />
          </div>
          
          {/* Ingredients */}
          {result?.ingredients && result.ingredients.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Detected Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {result.ingredients.map((ingredient, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/10 text-sm text-white/80 border border-white/10">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {result?.strengths && result.strengths.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Nutritional Strengths</p>
              <div className="space-y-2">
                {result.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-green-400">
                    <span className="mt-1">✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {result?.improvements && result.improvements.length > 0 && (
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Suggested Improvements</p>
              <div className="space-y-2">
                {result.improvements.map((improvement, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-accent-soft">
                    <span className="mt-1">→</span>
                    <span>{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback to generic insights if no AI data */}
          {(!result?.ingredients || result.ingredients.length === 0) && (
            <div className="mt-5 space-y-4">
              {ingredientInsights.map((tip) => (
                <SpotlightCard key={tip.title} className="bg-black/30">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">{tip.title}</p>
                  <p className="mt-2 text-sm text-white/80">{tip.content}</p>
                </SpotlightCard>
              ))}
            </div>
          )}

          {hydration && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              <Droplet className="h-5 w-5 text-accent-soft" /> Hydration resonance at {hydration}% today.
            </div>
          )}
        </MagicBento>
      </section>
      </div>
    </div>
  );
}
