import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Coffee, CheckCircle, Heart, Users, TrendingUp, X, Sparkles } from 'lucide-react';
import GradientText from '../components/GradientText';
import SpotlightCard from '../components/SpotlightCard';
import MagicBento from '../components/MagicBento';
import FluidGlassModal from '../components/FluidGlassModal';
import DitheredBackground from '../components/DitheredBackground';
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

  const truncateText = (text, wordLimit = 5) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  return (
    <div className="min-h-screen bg-background-dark px-4 sm:px-6 lg:px-10 pb-20 pt-10 text-white relative overflow-hidden">
      <DitheredBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <FluidGlassModal open={modalOpen} onClose={() => setModalOpen(false)} title="Analyze a new meal">
          <motion.div 
            className="flex flex-col gap-6 text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm leading-relaxed">Upload a photo or drag + drop. Gemini AI will analyze ingredients, macros, and provide personalized nutrition insights.</p>
            <motion.label
              className={`relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed ${
                isDragging ? 'border-accent-primary bg-accent-primary/10' : 'border-white/20 bg-white/5'
              } p-10 text-center transition-all duration-300 cursor-pointer overflow-hidden group`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFile(e.dataTransfer.files);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <motion.div
                animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
              >
                <Upload className="h-12 w-12 text-accent-soft relative z-10" />
              </motion.div>
              <span className="text-sm text-white/70 relative z-10">Drop meal photo or tap to browse</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files)}
              />
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-xs uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 transition-all duration-300"
              >
                Browse files
              </motion.button>
            </motion.label>
            <motion.button
              disabled={uploading}
              onClick={() => fileInputRef.current?.files?.length && handleFile(fileInputRef.current.files)}
              whileHover={{ scale: uploading ? 1 : 1.02 }}
              whileTap={{ scale: uploading ? 1 : 0.98 }}
              className="relative rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary py-3.5 text-sm font-semibold uppercase tracking-wide shadow-lg shadow-accent-primary/30 disabled:opacity-60 overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10">{uploading ? 'Analyzing…' : 'Start analysis'}</span>
            </motion.button>
          </motion.div>
        </FluidGlassModal>

        <FluidGlassModal open={!!selectedMeal} onClose={() => setSelectedMeal(null)} title="Meal Details">
          {selectedMeal && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <motion.h3 
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedMeal.name}
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-white/60 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedMeal.time}
                  </motion.p>
                </div>
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">Score</p>
                  <GradientText className="text-3xl font-bold">{selectedMeal.score}</GradientText>
                </motion.div>
              </div>
              <motion.div 
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-white/60 mb-3">AI Analysis</p>
                <p className="text-base text-white/80 leading-relaxed">{selectedMeal.advice}</p>
              </motion.div>
            </motion.div>
          )}
        </FluidGlassModal>

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
              Dashboard
            </motion.p>
            <motion.h1 
              className="mt-2 text-4xl font-semibold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GradientText>{greeting || `Hello, ${user?.name || 'there'}`}</GradientText>
            </motion.h1>
          </div>
          <AnimatePresence>
            {lastRun && (
              <motion.div 
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs text-white/70"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="h-4 w-4 text-accent-primary" />
                Synced {lastRun.name} · score {lastRun.score}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        <motion.section 
          className="grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {quickStats.map((stat, idx) => (
            <motion.div key={stat.label} variants={fadeInUp}>
              <SpotlightCard delay={idx * 0.1} className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
                <div className="flex items-end gap-3">
                  <GradientText className="text-3xl leading-none" style={{ color: stat.accent }}>
                    {stat.value}
                  </GradientText>
                  <span className="text-xs text-white/60">{stat.delta}</span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.section>

        <motion.section 
          className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <MagicBento>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Recent meals</p>
                <h2 className="text-2xl font-semibold">Vision-assisted logs</h2>
              </div>
            </div>

            <motion.div 
              className="mt-6 grid gap-4 md:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {recentMeals.slice(0, 4).map((meal, idx) => (
                <motion.div 
                  key={meal.id}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/10 hover:border-accent-primary/30 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedMeal(meal)}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-base font-semibold group-hover:text-accent-primary transition-colors duration-300">{meal.name}</p>
                        <p className="text-xs text-white/60 mt-1">{meal.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Score</p>
                        <GradientText className="text-xl font-bold">{meal.score}</GradientText>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">{truncateText(meal.advice)}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </MagicBento>

          <div className="space-y-6">
            <MagicBento className="relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 opacity-40" 
                aria-hidden
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-br from-accent-primary/40 to-transparent blur-[120px]" />
              </motion.div>
              <div className="relative space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">AI Metabolic Intelligence</p>
                <h3 className="text-2xl font-semibold">
                  <GradientText>Your Personalized Insight</GradientText>
                </h3>
                <motion.div 
                  className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-5"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="flex items-center gap-3 text-sm text-white/70 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Coffee size={16} />
                    </motion.div>
                    <span>AI-Generated Focus</span>
                  </div>
                  <motion.p
                    className="text-sm leading-relaxed"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {aiInsight}
                  </motion.p>
                </motion.div>
              </div>
            </MagicBento>

            <MagicBento className="relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 opacity-30" 
                aria-hidden
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-bl from-blue-500/30 to-transparent blur-[100px]" />
              </motion.div>
              <div className="relative space-y-4">
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div 
                    className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Heart size={20} className="text-blue-400" />
                  </motion.div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">UN SDG 3</p>
                    <h3 className="text-lg font-semibold">Good Health & Well-Being</h3>
                  </div>
                </motion.div>
                
                <p className="text-sm text-white/70 leading-relaxed">
                  NAFIRA aligns with Sustainable Development Goal 3 by empowering individuals with AI-driven nutrition insights for healthier lifestyles.
                </p>

                <motion.div 
                  className="grid grid-cols-2 gap-3 mt-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {[
                    { icon: Users, text: 'Accessible nutrition education' },
                    { icon: TrendingUp, text: 'Prevention through awareness' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={fadeInUp}
                      whileHover={{ y: -3, scale: 1.05 }}
                      className="rounded-xl bg-white/5 border border-white/10 p-3 cursor-pointer transition-all duration-300"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <item.icon size={18} className="text-accent-primary mb-2" />
                      </motion.div>
                      <p className="text-xs text-white/60">{item.text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </MagicBento>
          </div>
        </motion.section>
      </div>
    </div>
  );
}