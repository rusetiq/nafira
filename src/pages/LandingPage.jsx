import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Brain, TrendingUp } from 'lucide-react';
import ShinyText from '../components/ShinyText';
import GradientText from '../components/GradientText';
import MagicBento from '../components/MagicBento';
import DitheredBackground from '../components/DitheredBackground';
import { heroHighlights } from '../data/mockData';

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-background-dark px-6 pb-24 pt-16 text-white sm:px-10 lg:px-20">
<div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
  <DitheredBackground />
</div>


      <BackgroundOrbs />

      <header className="relative mx-auto max-w-6xl">
        <motion.div
          className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent-soft"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={16} className="text-accent-soft" />
          <span>RTQ VLM + Metabolic Intelligence</span>
        </motion.div>

        <motion.h1
          className="mt-8 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <span className="text-white/80">Meet Nafira —</span>
          <br />
          <ShinyText className="text-5xl sm:text-6xl lg:text-7xl">
            Snap your meal, know your health instantly
          </ShinyText>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          custom={0.15}
        >
          Snap a photo of your meal and let RTQ VLM analyze ingredients, calculate precise macros, and deliver personalized metabolic insights. Track your health journey with intelligent scoring, trend analysis, and actionable recommendations.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          variants={fadeIn}
          initial="hidden"
          animate="show"
          custom={0.3}
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full bg-accent-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider shadow-glow transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-glow"
          >
            Launch Dashboard
          </button>
        </motion.div>
      </header>

      <section className="relative mt-16 grid gap-6 md:grid-cols-3">
        {heroHighlights.map((card, idx) => (
          <MagicBento key={card.title} delay={idx * 0.1}>
            <div className="flex items-start justify-between">
              <GradientText className="text-sm uppercase tracking-[0.3em] text-white/80">
                {card.title}
              </GradientText>
              <div
                className="h-10 w-10 rounded-2xl border border-white/10"
                style={{
                  background: `linear-gradient(140deg, rgba(255,255,255,0.1), ${card.color})`,
                }}
              />
            </div>
            <p className="mt-4 text-base text-white/70">{card.description}</p>
          </MagicBento>
        ))}
      </section>

      <section className="relative mt-24 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <MagicBento className="h-full">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-accent-soft">
              <Brain className="inline h-3 w-3 mr-1" />
              AI Core
            </div>
            <GradientText className="text-sm">Intelligent Analysis Engine</GradientText>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[
              { icon: Zap, title: 'Instant Analysis', desc: 'Upload a meal photo and get comprehensive nutritional breakdown in seconds' },
              { icon: TrendingUp, title: 'Smart Tracking', desc: 'Monitor your health score, macro balance, and metabolic trends over time' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <item.icon className="h-5 w-5 text-accent-primary" />
                  <span>{item.title}</span>
                </div>
                <p className="mt-3 text-base text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-6">
            <div className="rounded-2xl bg-black/30 p-3">
              <Brain className="h-8 w-8 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Powered by AI</p>
              <p className="text-lg font-semibold text-white">RTQ's VLM + Smart Analytics</p>
            </div>
          </div>
        </MagicBento>

        <MagicBento className="relative overflow-hidden border-white/5 bg-white/10">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-accent-soft blur-3xl" />
            <div className="absolute -bottom-16 left-16 h-56 w-56 rounded-full bg-accent-primary blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Fast by Design</p>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              <GradientText>Powered by rusetiq/FastVLM-0.5b.</GradientText>
            </h3>
            <p className="mt-4 text-white/70 leading-relaxed">
              Experience nutrition tracking reimagined with a powerful and efficient vision language model, trained by us.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-primary" />
                <span>Instant meal analysis with detailed nutritional breakdown</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-primary" />
                <span>Higher accuracy as compared to other models.</span>
              </li>
              <li className="flex items-start gap-2">
                <Brain className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-primary" />
                <span>Personalized recommendations powered by AI</span>
              </li>
            </ul>
          </div>
        </MagicBento>
      </section>
    </div>
  );
}

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none" aria-hidden>
      <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-accent-secondary/30 blur-[120px]" />
      <div className="absolute left-10 top-40 h-80 w-80 rounded-full bg-accent-glow/20 blur-[150px]" />
      <div className="absolute bottom-10 right-24 h-64 w-64 rounded-full bg-accent-primary/25 blur-[140px]" />
    </div>
  );
}
