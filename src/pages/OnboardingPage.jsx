import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Target, Activity, Heart, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import GradientText from '../components/GradientText';
import DitheredBackground from '../components/DitheredBackground';

const questions = [
  {
    id: 'welcome',
    type: 'welcome',
    title: 'Welcome to Your Metabolic Journey',
    subtitle: "Let's personalize your experience in just 2 minutes",
    icon: Sparkles
  },
  {
    id: 'basics',
    type: 'form',
    title: 'Tell us about yourself',
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
    title: 'What is your activity level?',
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
    title: 'Dietary preference?',
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
    title: 'What are your primary goals?',
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
    title: 'Any health considerations?',
    subtitle: 'This helps us provide better recommendations',
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
  useNavigate(); // Keep hook call for React rules, but don't assign

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

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
      const profileData = {
        ...answers,
        onboarding_completed: true
      };

      if (Array.isArray(profileData.goals)) {
        profileData.goals = profileData.goals.join(', ');
      }

      // Convert string values to proper types for numeric fields
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

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      // Use api.put() for consistent URL and auth handling
      await api.put('/user/profile', updateData);

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (field, value) => {
    setAnswers(prev => ({
      ...prev,
      [field]: value
    }));
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
      return currentQuestion.fields
        .filter(f => f.required)
        .every(f => answers[f.name]);
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
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98
    })
  };

  return (
    <div className="min-h-screen bg-background-dark text-white px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden">
      <DitheredBackground />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-between items-center mb-3">
            <motion.span
              key={currentStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium text-white/60"
            >
              Step {currentStep + 1} of {questions.length}
            </motion.span>
            <motion.span
              key={`${currentStep}-percent`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm font-medium text-accent-primary"
            >
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </motion.span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-[length:200%_100%]"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
                backgroundPosition: ['0% 0%', '100% 0%']
              }}
              transition={{
                width: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' }
              }}
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
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl p-6 sm:p-8 md:p-12 shadow-2xl"
          >
            {currentQuestion.type === 'welcome' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center space-y-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 mb-2 relative"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-primary/20 to-transparent"
                  />
                  <currentQuestion.icon className="w-12 h-12 text-accent-primary relative z-10" />
                </motion.div>
                <div className="space-y-3">
                  <GradientText className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1]">
                    {currentQuestion.title}
                  </GradientText>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto"
                  >
                    {currentQuestion.subtitle}
                  </motion.p>
                </div>
              </motion.div>
            )}

            {currentQuestion.type === 'form' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl sm:text-4xl font-bold text-white mb-3"
                  >
                    {currentQuestion.title}
                  </motion.h2>
                  {currentQuestion.subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/60"
                    >
                      {currentQuestion.subtitle}
                    </motion.p>
                  )}
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {currentQuestion.fields.map((field, idx) => (
                    <motion.div
                      key={field.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className={field.type === 'text' ? 'md:col-span-2' : ''}
                    >
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        {field.label} {field.required && <span className="text-accent-primary">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={answers[field.name] || ''}
                          onChange={(e) => handleAnswer(field.name, e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                        >
                          <option value="" className="bg-background-dark">Select...</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt} className="bg-background-dark">{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={answers[field.name] || ''}
                          onChange={(e) => handleAnswer(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentQuestion.type === 'quiz' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-8"
              >
                <div className="text-center mb-8">
                  {currentQuestion.icon && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6 backdrop-blur-sm border border-white/10"
                    >
                      <currentQuestion.icon className="w-10 h-10 text-accent-primary" />
                    </motion.div>
                  )}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl font-bold text-white"
                  >
                    {currentQuestion.title}
                  </motion.h2>
                </div>
                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = currentQuestion.multiple
                      ? answers[currentQuestion.field]?.includes(option.value)
                      : answers[currentQuestion.field] === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * idx }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => currentQuestion.multiple
                          ? handleMultipleAnswer(currentQuestion.field, option.value)
                          : handleAnswer(currentQuestion.field, option.value)
                        }
                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${isSelected
                          ? 'border-accent-primary bg-gradient-to-br from-accent-primary/20 to-accent-secondary/10 shadow-lg shadow-accent-primary/20'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          }`}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0,
                            opacity: isSelected ? 1 : 0
                          }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center"
                        >
                          <Check size={14} className="text-white" />
                        </motion.div>
                        <div className="font-semibold text-white mb-1.5 pr-8">{option.label}</div>
                        <div className="text-sm text-white/60">{option.desc}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between mt-10 pt-6 border-t border-white/10"
            >
              <motion.button
                whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ChevronLeft size={20} />
                <span className="font-medium">Back</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: canProceed() && !loading ? 1.05 : 1 }}
                whileTap={{ scale: canProceed() && !loading ? 0.95 : 1 }}
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="relative flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-primary/30 overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <span className="relative z-10">{loading ? 'Saving...' : isLastStep ? 'Complete' : 'Next'}</span>
                {!loading && <ChevronRight size={20} className="relative z-10" />}
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}