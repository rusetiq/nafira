import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Switch } from '@headlessui/react';
import { User, Bell, Activity, Edit2, LogOut } from 'lucide-react';
import MagicBento from '../components/MagicBento';
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

  useEffect(() => { loadProfile(); }, [user]);

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
    const newNotifications = { ...settings.notifications, [key]: !settings.notifications[key] };
    try {
      await api.updateSettings({ notifications: newNotifications });
      setSettings((prev) => ({ ...prev, notifications: newNotifications }));
    } catch (error) { console.error('Error updating settings:', error); }
  };

  const handleSaveGoals = async () => {
    try {
      await updateUserProfile(settings.name, settings.allergies, goalInput);
      setSettings(prev => ({ ...prev, goals: goalInput }));
      setOpen(false);
    } catch (error) { console.error('Error saving goals:', error); }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#050505] px-6 pb-20 pt-12 text-white sm:px-10 lg:px-16 font-display cursor-none overflow-hidden">
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

      <FluidGlassModal open={open} onClose={() => setOpen(false)} title="Update Objectives">
        <div className="space-y-6 text-white/80">
          <label className="space-y-4 block">
            <span className="text-xs font-bold uppercase tracking-widest text-[#f54703]">Current Focus</span>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#f54703] transition-colors resize-none"
              rows={4}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onMouseEnter={textEnter} onMouseLeave={textLeave}
            />
          </label>
          <button onClick={handleSaveGoals} className="w-full bg-[#f54703] text-black py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors" onMouseEnter={textEnter} onMouseLeave={textLeave}>
            Save Changes
          </button>
        </div>
      </FluidGlassModal>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-wrap items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <User size={20} className="text-[#f54703]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">User Profile</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9]" onMouseEnter={textEnter} onMouseLeave={textLeave}>
              Subject: {settings.name}
            </h1>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 border border-white/20 rounded-full hover:bg-white hover:text-black px-6 py-3 font-bold uppercase text-xs tracking-widest transition-all"
            onMouseEnter={textEnter} onMouseLeave={textLeave}
          >
            <Edit2 size={14} /> Edit Data
          </button>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <MagicBento className="border-white/10 bg-[#0d0d0e]/50 min-h-[400px] rounded-[2.5rem]">
            <div className="grid gap-8 md:grid-cols-2 h-full">
              <div className="flex flex-col justify-between">
                <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl font-black text-[#f54703]">{settings.name.charAt(0)}</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1">Status</p>
                    <p className="font-bold text-lg">Active / Optimizing</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1">Restrictions</p>
                    <p className="font-bold text-lg">{settings.allergies || 'None Detected'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#f54703] mb-4">Current Objectives</p>
                  <p className="text-lg font-light opacity-80 leading-relaxed">"{settings.goals}"</p>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-white/50">
                    <span>Optimization</span>
                    <span>78%</span>
                  </div>
                  <div className="h-1 bg-white/10 w-full overflow-hidden rounded-full">
                    <motion.div className="h-full bg-[#f54703] rounded-full" initial={{ width: 0 }} animate={{ width: '78%' }} transition={{ duration: 1.5, delay: 0.5 }} />
                  </div>
                </div>
              </div>
            </div>
          </MagicBento>

          <div className="space-y-6">
            <MagicBento className="border-white/10 bg-[#0d0d0e]/50 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <Activity size={18} className="text-[#f54703]" />
                <p className="text-xs font-bold uppercase tracking-widest">System Actions</p>
              </div>
              <div className="space-y-2">
                {['Sync Wearable Data', 'Export Health Report', 'Reset Metabolic Baselines'].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#f54703]/50 rounded-xl transition-all text-sm font-medium"
                    onMouseEnter={textEnter} onMouseLeave={textLeave}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </MagicBento>

            <MagicBento className="border-white/10 bg-[#0d0d0e]/50 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <Bell size={18} className="text-[#f54703]" />
                <p className="text-xs font-bold uppercase tracking-widest">Notifications</p>
              </div>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-2">
                    <span className="text-sm font-bold uppercase text-white/70">{key}</span>
                    <Switch
                      checked={value}
                      onChange={() => toggleSetting(key)}
                      className={`${value ? 'bg-[#f54703]' : 'bg-white/10'} relative inline-flex h-6 w-12 items-center rounded-full border border-white/10 transition-colors`}
                      onMouseEnter={textEnter} onMouseLeave={textLeave}
                    >
                      <span className={`${value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                    </Switch>
                  </div>
                ))}
              </div>
            </MagicBento>
          </div>
        </section>

        <div className="mt-12 border-t border-white/10 pt-8 flex justify-end">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors" onMouseEnter={textEnter} onMouseLeave={textLeave}>
            <LogOut size={16} /> Sign Out
          </button>
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
