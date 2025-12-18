import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Coffee, CheckCircle } from 'lucide-react';
import GradientText from '../components/GradientText';
import SpotlightCard from '../components/SpotlightCard';
import MagicBento from '../components/MagicBento';
import FluidGlassModal from '../components/FluidGlassModal';
import DitheredBackground from '../components/DitheredBackground';
import { useAppData } from '../context/AppDataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api';

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastRun, setLastRun] = useState(null);
  const [aiInsight, setAiInsight] = useState('Loading your personalized insight...');
  const [greeting, setGreeting] = useState('');
  const fileInputRef = useRef(null);
  const { quickStats, recentMeals, startAnalysis } = useAppData();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-background-dark px-6 pb-20 pt-10 text-white sm:px-10 lg:px-16 relative">
      <DitheredBackground />
      <div className="relative z-10">
      <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Analyze a new meal">
        <div className="flex flex-col gap-4 text-white/80">
          <p>Upload a photo or drag + drop. Gemini AI will analyze ingredients, macros, and provide personalized nutrition insights.</p>
          <label
            className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-white/20 bg-white/5 p-10 text-center transition hover:border-accent-primary"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files);
            }}
          >
            <Upload className="h-10 w-10 text-accent-soft" />
            <span className="text-sm text-white/70">Drop meal photo or tap to browse</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files)}
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
            disabled={uploading}
            onClick={() => fileInputRef.current?.files?.length && handleFile(fileInputRef.current.files)}
            className="rounded-full bg-accent-primary py-3 text-sm font-semibold uppercase tracking-wide shadow-glow disabled:opacity-60"
          >
            {uploading ? 'Analyzing…' : 'Start analysis'}
          </button>
        </div>
      </FluidGlassModal>

      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold">
            <GradientText>{greeting || `Hello, ${user?.name || 'there'}`}</GradientText>
          </h1>
        </div>
        {lastRun && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
            <CheckCircle className="h-4 w-4 text-accent-primary" />
            Synced {lastRun.name} · score {lastRun.score}
          </div>
        )}
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-3 rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-glow transition hover:scale-[1.02]"
        >
          <Upload size={18} /> Analyze new meal
        </button>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {quickStats.map((stat, idx) => (
          <SpotlightCard key={stat.label} delay={idx * 0.1} className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
            <div className="flex items-end gap-3">
              <GradientText className="text-3xl leading-none" style={{ color: stat.accent }}>
                {stat.value}
              </GradientText>
              <span className="text-xs text-white/60">{stat.delta}</span>
            </div>
          </SpotlightCard>
        ))}
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <MagicBento>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Recent meals</p>
              <h2 className="text-2xl font-semibold">Vision-assisted logs</h2>
            </div>
            <button className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:border-accent-soft">
              View history
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {recentMeals.map((meal) => (
              <div key={meal.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div
                  className="h-40 w-full rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${meal.image})` }}
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{meal.name}</p>
                    <p className="text-xs text-white/60">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Score</p>
                    <GradientText className="text-2xl">{meal.score}</GradientText>
                  </div>
                </div>
                <p className="mt-3 text-sm text-white/70">{meal.advice}</p>
              </div>
            ))}
          </div>
        </MagicBento>

        <MagicBento className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-br from-accent-primary/40 to-transparent blur-[120px]" />
          </div>
          <div className="relative space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">AI Metabolic Intelligence</p>
            <h3 className="text-3xl font-semibold">
              <GradientText>Your Personalized Insight</GradientText>
            </h3>
            <p className="text-white/70">
              Real-time AI analysis of your nutrition patterns, metabolic state, and optimization opportunities.
            </p>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <Coffee size={16} />
                <span>AI-Generated Focus</span>
              </div>
              <motion.p
                className="mt-3 text-base leading-relaxed"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {aiInsight}
              </motion.p>
            </div>
          </div>
        </MagicBento>
      </section>
      </div>
    </div>
  );
}
