import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, User, Heart, Activity, Target } from 'lucide-react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DitheredBackground from '../components/DitheredBackground';

export default function ProfilePageEnhanced() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [processingPreference, setProcessingPreference] = useState('auto');

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
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  const calculateBMI = () => {
    if (profile?.height && profile?.weight) {
      const heightM = profile.height / 100;
      return (profile.weight / (heightM * heightM)).toFixed(1);
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-background-dark px-6 pb-20 pt-10 text-white sm:px-10 lg:px-16 relative">
      <DitheredBackground />
      <div className="relative z-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Your Profile</p>
          <h1 className="mt-2 text-4xl font-semibold">
            <GradientText>Metabolic Identity</GradientText>
          </h1>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-accent-soft"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold uppercase tracking-wide transition hover:border-red-500"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-accent-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide shadow-glow transition hover:scale-[1.02] disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Main Profile Info */}
        <MagicBento className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute -top-10 right-16 h-56 w-56 rounded-full bg-accent-secondary/30 blur-[140px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent-primary/30 blur-[160px]" />
          </div>
          
          <div className="relative space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                <p className="text-white/60">{profile?.email}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  />
                ) : (
                  <p className="text-lg">{profile?.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Age</label>
                {editing ? (
                  <input
                    type="number"
                    value={editData.age || ''}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  />
                ) : (
                  <p className="text-lg">{profile?.age || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Gender</label>
                {editing ? (
                  <select
                    value={editData.gender || ''}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <p className="text-lg">{profile?.gender || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Activity Level</label>
                {editing ? (
                  <select
                    value={editData.activity_level || ''}
                    onChange={(e) => handleChange('activity_level', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  >
                    <option value="">Select...</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="extreme">Extremely Active</option>
                  </select>
                ) : (
                  <p className="text-lg capitalize">{profile?.activity_level?.replace('_', ' ') || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Height (cm)</label>
                {editing ? (
                  <input
                    type="number"
                    value={editData.height || ''}
                    onChange={(e) => handleChange('height', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  />
                ) : (
                  <p className="text-lg">{profile?.height || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Weight (kg)</label>
                {editing ? (
                  <input
                    type="number"
                    value={editData.weight || ''}
                    onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  />
                ) : (
                  <p className="text-lg">{profile?.weight || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Dietary Preference</label>
                {editing ? (
                  <select
                    value={editData.dietary_preference || ''}
                    onChange={(e) => handleChange('dietary_preference', e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  >
                    <option value="">Select...</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                  </select>
                ) : (
                  <p className="text-lg capitalize">{profile?.dietary_preference || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Goals</label>
                {editing ? (
                  <textarea
                    value={editData.goals || ''}
                    onChange={(e) => handleChange('goals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition resize-none"
                  />
                ) : (
                  <p className="text-lg">{profile?.goals || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Allergies</label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.allergies || ''}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="e.g., Dairy, Nuts, Gluten"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  />
                ) : (
                  <p className="text-lg">{profile?.allergies || 'None'}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm uppercase tracking-[0.3em] text-white/60">Health Conditions</label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.health_conditions || ''}
                    onChange={(e) => handleChange('health_conditions', e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension"
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-accent-primary transition"
                  />
                ) : (
                  <p className="text-lg">{profile?.health_conditions || 'None'}</p>
                )}
              </div>
            </div>
          </div>
        </MagicBento>

        {/* Stats + Settings Cards */}
        <div className="space-y-6">
          <SpotlightCard className="bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">BMI</p>
                <GradientText className="text-2xl font-bold">{calculateBMI()}</GradientText>
              </div>
            </div>
            <p className="text-sm text-white/70">
              {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) < 18.5 && 'Underweight'}
              {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) >= 18.5 && parseFloat(calculateBMI()) < 25 && 'Normal weight'}
              {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) >= 25 && parseFloat(calculateBMI()) < 30 && 'Overweight'}
              {calculateBMI() !== 'N/A' && parseFloat(calculateBMI()) >= 30 && 'Obese'}
            </p>
          </SpotlightCard>

          <SpotlightCard className="bg-white/5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
              Processing Mode
            </p>
            <p className="text-sm text-white/70 mb-4">
              Choose where your meal images are processed. Device mode uses RTQVLM locally, cloud uses Gemini.
            </p>
            <div className="flex gap-2">
              {[
                { value: 'auto', label: 'Auto' },
                { value: 'cloud', label: 'Cloud' },
                { value: 'device', label: 'Device' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleProcessingPreferenceChange(option.value)}
                  className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide border transition ${
                    processingPreference === option.value
                      ? 'bg-accent-primary border-accent-primary text-black'
                      : 'bg-white/5 border-white/15 text-white/70 hover:border-accent-soft'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-secondary/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-accent-secondary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Diet Type</p>
                <GradientText className="text-xl font-bold capitalize">
                  {profile?.dietary_preference || 'Not set'}
                </GradientText>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-soft/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent-soft" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Activity</p>
                <GradientText className="text-xl font-bold capitalize">
                  {profile?.activity_level?.replace('_', ' ') || 'Not set'}
                </GradientText>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
      </div>
    </div>
  );
}
