import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import MagicBento from '../components/MagicBento';
import SpotlightCard from '../components/SpotlightCard';
import GradientText from '../components/GradientText';
import FluidGlassModal from '../components/FluidGlassModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState({
    name: '',
    goals: '',
    allergies: '',
    notifications: {
      insights: true,
      reminders: false,
      challenges: true
    },
    processing_preference: 'auto'
  });
  const [loading, setLoading] = useState(true);
  const [goalInput, setGoalInput] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const profile = await api.getProfile();
      setSettings(profile);
      setGoalInput(profile.goals);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = async (key) => {
    const newNotifications = {
      ...settings.notifications,
      [key]: !settings.notifications[key]
    };
    
    try {
      await api.updateSettings({ notifications: newNotifications });
      setSettings((prev) => ({
        ...prev,
        notifications: newNotifications
      }));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleSaveGoals = async () => {
    try {
      await updateUserProfile(settings.name, settings.allergies, goalInput);
      setSettings(prev => ({ ...prev, goals: goalInput }));
      setOpen(false);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark px-6 pb-20 pt-12 text-white sm:px-10 lg:px-16">
      <FluidGlassModal open={open} onClose={() => setOpen(false)} title="Update goals">
        <div className="space-y-4 text-white/80">
          <label className="space-y-2">
            <span className="text-sm uppercase tracking-[0.3em] text-white/60">Goals</span>
            <textarea
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
              rows={4}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
          </label>
          <button onClick={handleSaveGoals} className="w-full rounded-full bg-accent-primary py-3 text-sm font-semibold uppercase tracking-widest shadow-glow">
            Save goals
          </button>
        </div>
      </FluidGlassModal>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Profile & rituals</p>
          <h1 className="mt-2 text-4xl font-semibold">FluidGlass insights for {settings.name}</h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm uppercase tracking-wider text-white/80 transition hover:border-accent-soft"
        >
          Edit goals
        </button>
      </header>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <MagicBento className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute -top-10 right-16 h-56 w-56 rounded-full bg-accent-secondary/30 blur-[140px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent-primary/30 blur-[160px]" />
          </div>
          <div className="relative grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">User</p>
              <GradientText className="text-3xl">{settings.name}</GradientText>
              <p className="text-sm text-white/70">Allergies: {settings.allergies}</p>
              <p className="text-sm text-white/70">Goals: {settings.goals}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Health profile</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li>• VO2 max upgrade in progress</li>
                <li>• Insulin resistance reversal ritual</li>
                <li>• Hydration streak 9 days</li>
              </ul>
            </div>
          </div>
        </MagicBento>

        <div className="space-y-6">
          <MagicBento>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">MagicBento actions</p>
            <div className="mt-5 space-y-3">
              {['Update wearable', 'Sync FastVLM logs', 'Customize gamification'].map((action) => (
                <button
                  key={action}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition hover:border-accent-soft"
                >
                  {action}
                </button>
              ))}
            </div>
          </MagicBento>
          <MagicBento>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Notification toggles</p>
            <div className="mt-4 space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-white/80">{key}</span>
                  <Switch
                    checked={value}
                    onChange={() => toggleSetting(key)}
                    className={`${value ? 'bg-accent-primary' : 'bg-white/10'} relative inline-flex h-6 w-12 items-center rounded-full border border-white/10 transition`}
                  >
                    <span className="sr-only">Toggle {key}</span>
                    <span
                      className={`${value ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white/60'} inline-block h-4 w-4 transform rounded-full transition`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </MagicBento>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((idx) => (
          <SpotlightCard key={idx} className="bg-white/5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">Routine #{idx}</p>
            <GradientText className="text-xl">Breath + fuel stack</GradientText>
            <p className="text-sm text-white/70">Meditative breathing, hydration, and metabolic priming cues bundled.</p>
          </SpotlightCard>
        ))}
      </section>
    </div>
  );
}
