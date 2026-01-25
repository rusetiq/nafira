import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Droplet, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DitheredBackground from '../components/DitheredBackground';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    allergies: '',
    goals: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await register(
          formData.email,
          formData.password,
          formData.name,
          formData.allergies,
          formData.goals
        );
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const fillDemo = () => {
    setFormData({
      email: 'demo@nafira.app',
      password: 'demo123',
      name: '',
      allergies: '',
      goals: ''
    });
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050505] -z-20" />
      <DitheredBackground opacity={0.4} />

      {/* Animated Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none -z-10" />

      {/* Back to Home Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 backdrop-blur-md text-white/60 hover:text-white transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bricolage text-sm font-semibold">Back to Home</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Glass Container */}
        <div className="liquid-glass rounded-[2.5rem] p-1 overflow-hidden relative group">

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

          <div className="bg-black/20 rounded-[2.3rem] p-6 sm:p-10 backdrop-blur-sm">

            {/* Header */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 border border-white/10 mb-6 relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 via-transparent to-transparent"
                  />
                  <Droplet className="w-8 h-8 text-accent-primary relative z-10 drop-shadow-[0_0_15px_rgba(245,71,3,0.5)]" />
                </div>
              </motion.div>

              <h1 className="font-bricolage text-5xl sm:text-6xl font-bold mb-3 tracking-tight text-white drop-shadow-xl">
                NAFIRA
              </h1>
              <p className="font-display text-accent-secondary/80 text-sm font-semibold tracking-widest uppercase">
                {isLogin ? 'Welcome Back' : 'Join the Revolution'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="relative group/input">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required={!isLogin}
                          placeholder="Full Name"
                          className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-accent-primary/50 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="relative group/input">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email Address"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-accent-primary/50 transition-all font-medium"
                  />
                </div>

                <div className="relative group/input">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-accent-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Allergies (Optional)"
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-accent-primary/50 transition-all font-medium"
                    />
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Health Goals..."
                      className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/10 focus:border-accent-primary/50 transition-all font-medium resize-none"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-medium text-center"
                >
                  {error}
                </motion.div>
              )}

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold text-lg tracking-wide shadow-lg shadow-accent-primary/25 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                    {!loading && <ArrowRight size={20} />}
                  </span>
                </motion.button>
              </div>

            </form>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/50 text-sm hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-accent-primary font-semibold underline decoration-transparent hover:decoration-accent-primary underline-offset-4 transition-all">
                  {isLogin ? 'Register' : 'Login'}
                </span>
              </button>

              {isLogin && (
                <button
                  onClick={fillDemo}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs text-white/40 hover:text-white/80 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Sparkles size={12} />
                  Demo Mode
                </button>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
