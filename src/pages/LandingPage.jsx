import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Brain, TrendingUp, Heart, Users, Globe, Flame } from 'lucide-react';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import MagicBento from '../components/MagicBento';
import DitheredBackground from '../components/DitheredBackground';
import { heroHighlights } from '../data/mockData';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      delay, 
      ease: [0.4, 0, 0.2, 1]
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-background-dark px-4 sm:px-6 pb-24 pt-16 text-white lg:px-20">
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
        <DitheredBackground />
      </div>

      <BackgroundOrbs />

      <header className="relative mx-auto max-w-6xl">
        <motion.div
          className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent-soft"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={16} className="text-accent-soft" />
          </motion.div>
          <span>RTQ VLM + Metabolic Intelligence</span>
        </motion.div>

        <motion.h1
          className="mt-8 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
        >
          <motion.span 
            className="text-white/80 block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Meet Nafira —
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ShinyText className="text-5xl sm:text-6xl lg:text-7xl">
              Snap your meal, know your health instantly
            </ShinyText>
          </motion.div>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Snap a photo of your meal and let RTQ VLM analyze ingredients, calculate precise macros, and deliver personalized metabolic insights. Track your health journey with intelligent scoring, trend analysis, and actionable recommendations.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary px-8 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg shadow-accent-primary/30 transition-all duration-300 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <span className="relative z-10 flex items-center gap-2">
              Launch Dashboard
              <ArrowRight size={16} />
            </span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/demo')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-white/10 hover:border-accent-primary/50 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10 flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame size={16} className="text-accent-primary" />
              </motion.div>
              Try Demo
            </span>
          </motion.button>
        </motion.div>
      </header>

      <motion.section 
        className="relative mt-16 grid gap-6 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {heroHighlights.map((card, idx) => (
          <motion.div key={card.title} variants={fadeInUp}>
            <MagicBento delay={0}>
              <motion.div 
                className="flex items-start justify-between"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <GradientText className="text-sm uppercase tracking-[0.3em] text-white/80">
                  {card.title}
                </GradientText>
                <motion.div
                  className="h-10 w-10 rounded-2xl border border-white/10"
                  style={{
                    background: `linear-gradient(140deg, rgba(255,255,255,0.1), ${card.color})`,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
              </motion.div>
              <motion.p 
                className="mt-4 text-base text-white/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {card.description}
              </motion.p>
            </MagicBento>
          </motion.div>
        ))}
      </motion.section>

      <motion.section 
        className="relative mt-24 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-green-500/20 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-green-500/30 backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Heart className="w-6 h-6 text-blue-400" />
            </motion.div>
            <motion.span 
              className="text-sm uppercase tracking-[0.3em] text-blue-400/80 font-semibold"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              UN SDG 3
            </motion.span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <GradientText>Ensuring Healthy Lives and Promoting Well-being</GradientText>
          </motion.h2>

          <motion.p
            className="text-lg text-white/70 leading-relaxed max-w-3xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Nafira aligns with UN Sustainable Development Goal 3 by making nutritional awareness accessible to everyone. Our AI-powered platform democratizes health insights, helping individuals make informed dietary choices that contribute to better health outcomes worldwide.
          </motion.p>

          <motion.div 
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              { 
                icon: Users, 
                title: 'Universal Access', 
                desc: 'Making nutrition tracking accessible to all, regardless of background or income'
              },
              { 
                icon: Brain, 
                title: 'Health Education', 
                desc: 'Empowering individuals with knowledge to make better dietary decisions'
              },
              { 
                icon: Globe, 
                title: 'Global Impact', 
                desc: 'Contributing to worldwide health improvement through technology'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-300"
              >
                <motion.div
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <item.icon className="h-6 w-6 text-blue-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="relative mt-24 grid gap-8 lg:grid-cols-[1.4fr_1fr]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <MagicBento className="h-full">
            <div className="flex flex-wrap items-center gap-3">
              <motion.div 
                className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-accent-soft"
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="inline h-3 w-3 mr-1" />
                AI Core
              </motion.div>
              <GradientText className="text-sm">Intelligent Analysis Engine</GradientText>
            </div>

            <motion.div 
              className="mt-6 grid gap-6 md:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              {[
                { icon: Zap, title: 'Instant Analysis', desc: 'Upload a meal photo and get comprehensive nutritional breakdown in seconds' },
                { icon: TrendingUp, title: 'Smart Tracking', desc: 'Monitor your health score, macro balance, and metabolic trends over time' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-5 w-5 text-accent-primary" />
                    </motion.div>
                    <span>{item.title}</span>
                  </div>
                  <p className="mt-3 text-base text-white/80">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="rounded-2xl bg-black/30 p-3"
                whileHover={{ rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Brain className="h-8 w-8 text-accent-primary" />
              </motion.div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Powered by AI</p>
                <p className="text-lg font-semibold text-white">RTQ's VLM + Smart Analytics</p>
              </div>
            </motion.div>
          </MagicBento>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <MagicBento className="relative overflow-hidden border-white/5 bg-white/10 h-full">
            <motion.div 
              className="absolute inset-0 opacity-40" 
              aria-hidden
            >
              <motion.div 
                className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-accent-soft blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="absolute -bottom-16 left-16 h-56 w-56 rounded-full bg-accent-primary blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, -20, 0],
                  y: [0, 20, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <div className="relative">
              <motion.p 
                className="text-sm uppercase tracking-[0.3em] text-white/60"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Fast by Design
              </motion.p>
              <motion.h3 
                className="mt-4 text-3xl font-semibold text-white"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GradientText>Powered by rusetiq/FastVLM-0.5b.</GradientText>
              </motion.h3>
              <motion.p 
                className="mt-4 text-white/70 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Experience nutrition tracking reimagined with a powerful and efficient vision language model, trained by us.
              </motion.p>
              <motion.ul 
                className="mt-6 space-y-3 text-white/80"
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {[
                  { icon: Sparkles, text: 'Instant meal analysis with detailed nutritional breakdown' },
                  { icon: TrendingUp, text: 'Higher accuracy as compared to other models.' },
                  { icon: Brain, text: 'Personalized recommendations powered by AI' }
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    className="flex items-start gap-2"
                    variants={fadeInUp}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-primary" />
                    </motion.div>
                    <span>{item.text}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </MagicBento>
        </motion.div>
      </motion.section>
    </div>
  );
}

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none" aria-hidden>
      <motion.div 
        className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent-secondary/30 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute left-10 top-40 h-80 w-80 rounded-full bg-accent-glow/20 blur-[150px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-10 right-24 h-64 w-64 rounded-full bg-accent-primary/25 blur-[140px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.25, 0.45, 0.25]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}