import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Target, Activity, Heart } from 'lucide-react';
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
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const handleNext = async () => {
    if (isLastStep) {
      await handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Prepare data
      const profileData = {
        ...answers,
        onboarding_completed: true
      };

      // If goals is array, convert to string
      if (Array.isArray(profileData.goals)) {
        profileData.goals = profileData.goals.join(', ');
      }

      await api.updateProfile(
        profileData.name || user.name,
        profileData.allergies || '',
        profileData.goals || ''
      );

      // Update additional fields
      const additionalData = {
        age: profileData.age,
        gender: profileData.gender,
        height: profileData.height,
        weight: profileData.weight,
        activity_level: profileData.activity_level,
        dietary_preference: profileData.dietary_preference,
        health_conditions: profileData.health_conditions,
        onboarding_completed: true
      };

      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(additionalData)
      });

      // Force reload to update auth context
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

  return (
    <div className="min-h-screen bg-background-dark text-white px-6 py-12 relative">
      <DitheredBackground />
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/60">Step {currentStep + 1} of {questions.length}</span>
            <span className="text-sm text-white/60">{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12"
          >
            {/* Welcome Screen */}
            {currentQuestion.type === 'welcome' && (
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent-primary/20 mb-4">
                  <currentQuestion.icon className="w-10 h-10 text-accent-primary" />
                </div>
                <GradientText className="text-4xl md:text-5xl font-bold">
                  {currentQuestion.title}
                </GradientText>
                <p className="text-xl text-white/70">{currentQuestion.subtitle}</p>
              </div>
            )}

            {/* Form Screen */}
            {currentQuestion.type === 'form' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">{currentQuestion.title}</h2>
                  {currentQuestion.subtitle && (
                    <p className="text-white/60">{currentQuestion.subtitle}</p>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {currentQuestion.fields.map(field => (
                    <div key={field.name} className={field.type === 'text' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm text-white/60 mb-2">
                        {field.label} {field.required && <span className="text-accent-primary">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={answers[field.name] || ''}
                          onChange={(e) => handleAnswer(field.name, e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                        >
                          <option value="">Select...</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={answers[field.name] || ''}
                          onChange={(e) => handleAnswer(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary transition"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Screen */}
            {currentQuestion.type === 'quiz' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  {currentQuestion.icon && (
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-primary/20 mb-4">
                      <currentQuestion.icon className="w-8 h-8 text-accent-primary" />
                    </div>
                  )}
                  <h2 className="text-3xl font-bold text-white">{currentQuestion.title}</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {currentQuestion.options.map(option => {
                    const isSelected = currentQuestion.multiple
                      ? answers[currentQuestion.field]?.includes(option.value)
                      : answers[currentQuestion.field] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => currentQuestion.multiple
                          ? handleMultipleAnswer(currentQuestion.field, option.value)
                          : handleAnswer(currentQuestion.field, option.value)
                        }
                        className={`p-4 rounded-2xl border-2 transition text-left ${
                          isSelected
                            ? 'border-accent-primary bg-accent-primary/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="font-semibold text-white mb-1">{option.label}</div>
                        <div className="text-sm text-white/60">{option.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white/70 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-accent-primary text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {loading ? 'Saving...' : isLastStep ? 'Complete' : 'Next'}
                {!loading && <ChevronRight size={20} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
