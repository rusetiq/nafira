import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Target, Activity, Heart, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const questions = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Metabolic Genesis',
    subtitle: "Initialize your biological profile in 2 minutes",
    icon: Sparkles
  },
  {
    id: 'basics',
    type: 'form',
    title: 'Biological Metrics',
    subtitle: 'Baseline data for your metabolic twin',
    fields: [
      { name: 'age', label: 'Age', type: 'number', placeholder: '25', required: true },
      { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'], required: true },
      { name: 'height', label: 'Height (cm)', type: 'number', placeholder: '170', required: true },
      { name: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '70', required: true }
    ]
  },
  {
    id: 'activity',
    type: 'quiz',
    title: 'Energy Expenditure',
    icon: Activity,
    field: 'activity_level',
    options: [
      { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
      { value: 'light', label: 'Lightly Active', desc: '1-3 days per week' },
      { value: 'moderate', label: 'Moderately Active', desc: '3-5 days per week' },
      { value: 'very', label: 'Very Active', desc: '6-7 days per week' },
      { value: 'extreme', label: 'Extremely Active', desc: 'Physical job and training' }
    ]
  },
  {
    id: 'diet',
    type: 'quiz',
    title: 'Fuel Source Preference',
    icon: Heart,
    field: 'dietary_preference',
    options: [
      { value: 'omnivore', label: 'Omnivore', desc: 'Eat everything' },
      { value: 'vegetarian', label: 'Vegetarian', desc: 'No meat' },
      { value: 'vegan', label: 'Vegan', desc: 'No animal products' },
      { value: 'pescatarian', label: 'Pescatarian', desc: 'Fish but no meat' },
      { value: 'keto', label: 'Keto', desc: 'Low carb, high fat' },
      { value: 'paleo', label: 'Paleo', desc: 'Whole foods focused' }
    ]
  },
  {
    id: 'goals',
    type: 'quiz',
    title: 'System Objectives',
    icon: Target,
    field: 'goals',
    multiple: true,
    options: [
      { value: 'weight_loss', label: 'Weight Loss', desc: 'Reduce body fat' },
      { value: 'muscle_gain', label: 'Muscle Gain', desc: 'Build strength' },
      { value: 'energy', label: 'More Energy', desc: 'Feel more energized' },
      { value: 'health', label: 'Better Health', desc: 'Improve overall health' },
      { value: 'performance', label: 'Performance', desc: 'Athletic performance' },
      { value: 'longevity', label: 'Longevity', desc: 'Healthy aging' }
    ]
  },
  {
    id: 'health',
    type: 'form',
    title: 'System Constraints',
    subtitle: 'Allergies and conditions',
    fields: [
      { name: 'allergies', label: 'Food Allergies', type: 'text', placeholder: 'e.g., Dairy, Nuts, Gluten', required: false },
      { name: 'health_conditions', label: 'Health Conditions', type: 'text', placeholder: 'e.g., Diabetes, Hypertension', required: false }
    ]
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);
  const { user } = useAuth();
  useNavigate();

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

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

  const handleNext = async () => {
    if (isLastStep) {
      await handleComplete();
    } else {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const profileData = { ...answers, onboarding_completed: true };
      if (Array.isArray(profileData.goals)) {
        profileData.goals = profileData.goals.join(', ');
      }
      const updateData = {
        name: profileData.name || user.name,
        allergies: profileData.allergies || '',
        goals: profileData.goals || '',
        age: profileData.age ? parseInt(profileData.age, 10) : undefined,
        gender: profileData.gender,
        height: profileData.height ? parseFloat(profileData.height) : undefined,
        weight: profileData.weight ? parseFloat(profileData.weight) : undefined,
        activity_level: profileData.activity_level,
        dietary_preference: profileData.dietary_preference,
        health_conditions: profileData.health_conditions,
        onboarding_completed: true
      };
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      await api.put('/user/profile', updateData);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (field, value) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleMultipleAnswer = (field, value) => {
    setAnswers(prev => {
      const current = prev[field] || [];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [field]: newValue };
    });
  };

  const canProceed = () => {
    if (currentQuestion.type === 'welcome') return true;
    if (currentQuestion.type === 'form') {
      return currentQuestion.fields.filter(f => f.required).every(f => answers[f.name]);
    }
    if (currentQuestion.type === 'quiz') {
      if (currentQuestion.multiple) {
        return answers[currentQuestion.field]?.length > 0;
      }
      return !!answers[currentQuestion.field];
    }
    return true;
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -50 : 50, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden font-display cursor-none">
      {/* Custom Cursor */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        variants={cursorVariants}
        animate={cursorVariant}
        style={{ translateX: cursorX, translateY: cursorY }}
      />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingShape color="rgba(245, 71, 3, 0.05)" size={800} top="-20%" right="-10%" delay={0} />
        <FloatingShape color="rgba(30, 64, 175, 0.05)" size={600} bottom="-10%" left="10%" delay={4} />
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[#f54703] font-mono text-xs uppercase tracking-[0.2em]">Step {currentStep + 1} / {questions.length}</span>
            <span className="text-white/40 font-mono text-xs uppercase tracking-[0.2em]">{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-white/10 w-full overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-[#f54703] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="bg-[#0d0d0e]/50 backdrop-blur-xl border border-white/10 p-8 sm:p-12 rounded-[3.5rem]"
          >
            {currentQuestion.type === 'welcome' && (
              <div className="text-center py-10" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                <div className="mb-8 inline-flex items-center justify-center">
                  <Sparkles size={64} className="text-[#f54703]" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">{currentQuestion.title}</h1>
                <p className="text-xl text-white/50 font-light">{currentQuestion.subtitle}</p>
              </div>
            )}

            {currentQuestion.type === 'form' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold uppercase tracking-tight mb-2" onMouseEnter={textEnter} onMouseLeave={textLeave}>{currentQuestion.title}</h2>
                  <p className="text-white/50">{currentQuestion.subtitle}</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {currentQuestion.fields.map((field, idx) => (
                    <div key={field.name} className={field.type === 'text' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#f54703] mb-2">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          value={answers[field.name] || ''}
                          onChange={(e) => handleAnswer(field.name, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:border-[#f54703] transition-colors"
                          onMouseEnter={textEnter} onMouseLeave={textLeave}
                        >
                          <option value="" className="bg-black">Select...</option>
                          {field.options.map(opt => <option key={opt} value={opt} className="bg-black">{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={answers[field.name] || ''}
                          onChange={(e) => handleAnswer(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:border-[#f54703] transition-colors placeholder:text-white/20"
                          onMouseEnter={textEnter} onMouseLeave={textLeave}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentQuestion.type === 'quiz' && (
              <div className="space-y-8">
                <div className="text-center mb-8" onMouseEnter={textEnter} onMouseLeave={textLeave}>
                  <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">{currentQuestion.title}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = currentQuestion.multiple
                      ? answers[currentQuestion.field]?.includes(option.value)
                      : answers[currentQuestion.field] === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => currentQuestion.multiple
                          ? handleMultipleAnswer(currentQuestion.field, option.value)
                          : handleAnswer(currentQuestion.field, option.value)
                        }
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`text-left p-6 border transition-all rounded-3xl group ${isSelected ? 'border-[#f54703] bg-[#f54703]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                        onMouseEnter={textEnter} onMouseLeave={textLeave}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-bold uppercase tracking-wider text-sm ${isSelected ? 'text-[#f54703]' : 'text-white'}`}>{option.label}</span>
                          {isSelected && <Check size={16} className="text-[#f54703]" />}
                        </div>
                        <p className="text-xs text-white/40">{option.desc}</p>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="text-white/40 hover:text-white disabled:opacity-20 transition-colors uppercase text-xs font-bold tracking-widest flex items-center gap-2"
                onMouseEnter={textEnter} onMouseLeave={textLeave}
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="bg-[#f54703] text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 flex items-center gap-2"
                onMouseEnter={textEnter} onMouseLeave={textLeave}
              >
                {loading ? 'Processing...' : isLastStep ? 'Initialize' : 'Next'} <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
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