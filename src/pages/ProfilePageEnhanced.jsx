import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Edit2, Save, X, User, Heart, Activity, Target, Zap } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePageEnhanced() {
  useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingPreference, setProcessingPreference] = useState('auto');

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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
      setEditData(data);
      if (data.processing_preference) {
        setProcessingPreference(data.processing_preference);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });

      setProfile(editData);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile);
    setEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleProcessingPreferenceChange = async (value) => {
    setProcessingPreference(value);
    try {
      await api.updateSettings({ processingPreference: value });
      setProfile(prev => (prev ? { ...prev, processing_preference: value } : prev));
      setEditData(prev => ({ ...prev, processing_preference: value }));
    } catch (error) {
      console.error('Error updating processing preference:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/50 font-mono uppercase tracking-widest text-xs">Loading identity...</div>;
  }

  const calculateBMI = () => {
    if (profile?.height && profile?.weight) {
      const heightM = profile.height / 100;
      return (profile.weight / (heightM * heightM)).toFixed(1);
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-[#050505] px-6 pb-20 pt-10 text-white sm:px-10 lg:px-16 relative font-display cursor-none overflow-hidden">
      {/* Custom Cursor */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        variants={cursorVariants}
        animate={cursorVariant}
        style={{ translateX: cursorX, translateY: cursorY }}
      />

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <FloatingShape color="rgba(245, 71, 3, 0.05)" size={800} top="-10%" left="-10%" delay={0} />
        <FloatingShape color="rgba(30, 64, 175, 0.05)" size={600} bottom="10%" right="-10%" delay={4} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-[#f54703]" />
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">User Profile</p>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              Metabolic<br />Identity
            </h1>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all"
              onMouseEnter={textEnter} onMouseLeave={textLeave}
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest transition hover:border-red-500 hover:text-red-500"
                onMouseEnter={textEnter} onMouseLeave={textLeave}
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-full bg-[#f54703] text-black px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-900/20 transition hover:bg-white disabled:opacity-50"
                onMouseEnter={textEnter} onMouseLeave={textLeave}
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Main Profile Info */}
          <MagicBento className="relative overflow-hidden bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem] p-8">
            <div className="relative space-y-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl font-black text-[#f54703]">
                  {profile?.name?.charAt(0) || <User size={32} />}
                </div>
                <div>
                  <h2 className="text-3xl font-bold uppercase tracking-tight">{profile?.name}</h2>
                  <p className="text-white/50 font-mono text-xs mt-1">{profile?.email}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile?.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Age</label>
                  {editing ? (
                    <input
                      type="number"
                      value={editData.age || ''}
                      onChange={(e) => handleChange('age', parseInt(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile?.age || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Gender</label>
                  {editing ? (
                    <select
                      value={editData.gender || ''}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                      <option value="" className="bg-black">Select...</option>
                      <option value="Male" className="bg-black">Male</option>
                      <option value="Female" className="bg-black">Female</option>
                      <option value="Non-binary" className="bg-black">Non-binary</option>
                      <option value="Prefer not to say" className="bg-black">Prefer not to say</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium">{profile?.gender || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Activity Level</label>
                  {editing ? (
                    <select
                      value={editData.activity_level || ''}
                      onChange={(e) => handleChange('activity_level', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                      <option value="" className="bg-black">Select...</option>
                      <option value="sedentary" className="bg-black">Sedentary</option>
                      <option value="light" className="bg-black">Lightly Active</option>
                      <option value="moderate" className="bg-black">Moderately Active</option>
                      <option value="very" className="bg-black">Very Active</option>
                      <option value="extreme" className="bg-black">Extremely Active</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium capitalize">{profile?.activity_level?.replace('_', ' ') || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Height (cm)</label>
                  {editing ? (
                    <input
                      type="number"
                      value={editData.height || ''}
                      onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile?.height || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Weight (kg)</label>
                  {editing ? (
                    <input
                      type="number"
                      value={editData.weight || ''}
                      onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile?.weight || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Dietary Preference</label>
                  {editing ? (
                    <select
                      value={editData.dietary_preference || ''}
                      onChange={(e) => handleChange('dietary_preference', e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                      <option value="" className="bg-black">Select...</option>
                      <option value="omnivore" className="bg-black">Omnivore</option>
                      <option value="vegetarian" className="bg-black">Vegetarian</option>
                      <option value="vegan" className="bg-black">Vegan</option>
                      <option value="pescatarian" className="bg-black">Pescatarian</option>
                      <option value="keto" className="bg-black">Keto</option>
                      <option value="paleo" className="bg-black">Paleo</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium capitalize">{profile?.dietary_preference || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Goals</label>
                  {editing ? (
                    <textarea
                      value={editData.goals || ''}
                      onChange={(e) => handleChange('goals', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors resize-none"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium opacity-80 leading-relaxed">{profile?.goals || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Allergies</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.allergies || ''}
                      onChange={(e) => handleChange('allergies', e.target.value)}
                      placeholder="e.g., Dairy, Nuts, Gluten"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile?.allergies || 'None'}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Health Conditions</label>
                  {editing ? (
                    <input
                      type="text"
                      value={editData.health_conditions || ''}
                      onChange={(e) => handleChange('health_conditions', e.target.value)}
                      placeholder="e.g., Diabetes, Hypertension"
                      className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#f54703] transition-colors"
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    />
                  ) : (
                    <p className="text-lg font-medium">{profile?.health_conditions || 'None'}</p>
                  )}
                </div>
              </div>
            </div>
          </MagicBento>

          {/* Stats + Settings Cards */}
          <div className="space-y-6">
            <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem] p-6" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-[#f54703]" />
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Body Mass</p>
              </div>
              <div className="mb-2">
                <span className="text-5xl font-black">{calculateBMI()}</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) < 18.5 && 'Underweight'}
                {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) >= 18.5 && parseFloat(calculateBMI()) < 25 && 'Normal weight'}
                {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) >= 25 && parseFloat(calculateBMI()) < 30 && 'Overweight'}
                {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) >= 30 && 'Obese'}
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem] p-6" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-[#f54703]" />
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Processing</p>
              </div>
              <p className="text-xs text-white/50 mb-6 leading-relaxed">
                Reroute neural inference compute.
              </p>
              <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/5">
                {[
                  { value: 'auto', label: 'Auto' },
                  { value: 'cloud', label: 'Cloud' },
                  { value: 'device', label: 'Device' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleProcessingPreferenceChange(option.value)}
                    className={`flex-1 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${processingPreference === option.value
                      ? 'bg-[#f54703] text-black shadow-lg shadow-orange-900/20'
                      : 'text-white/40 hover:text-white'
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem] p-6" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-[#f54703]" />
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Dietary</p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold capitalize">{profile?.dietary_preference || 'Unspecified'}</p>
                <div className="w-2 h-2 rounded-full bg-green-500 mb-2 animate-pulse" />
              </div>
            </SpotlightCard>

            <SpotlightCard className="bg-[#0d0d0e]/50 border-white/10 rounded-[2.5rem] p-6" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-[#f54703]" />
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">Activity</p>
              </div>
              <p className="text-2xl font-bold capitalize">{profile?.activity_level?.replace('_', ' ') || 'Unspecified'}</p>
            </SpotlightCard>
          </div>
        </div>
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
