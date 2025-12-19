import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GradientText from '../components/GradientText';
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
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">
      <DitheredBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30 mb-6 relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-primary/20 to-transparent"
            />
            <Droplet className="w-10 h-10 text-accent-primary relative z-10" />
          </motion.div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-2 leading-[1.1] bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            NAFIRA
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 text-sm uppercase tracking-wider"
          >
            Smart Nutrition
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="flex gap-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <LogIn className="inline-block mr-2 h-4 w-4" />
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg shadow-accent-primary/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <UserPlus className="inline-block mr-2 h-4 w-4" />
              Register
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Your name"
                />
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-white/70 mb-2">Allergies (optional)</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    placeholder="e.g., Dairy, Soy"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-white/70 mb-2">Goals (optional)</label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-all duration-300 resize-none backdrop-blur-sm"
                    placeholder="Your health goals..."
                  />
                </motion.div>
              </>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full py-3.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold uppercase tracking-wide shadow-lg shadow-accent-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-secondary to-accent-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <span className="relative z-10">
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </span>
            </motion.button>
          </form>

          {isLogin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fillDemo}
              className="w-full mt-5 py-2.5 text-sm text-white/60 hover:text-accent-primary transition-all duration-300 rounded-full hover:bg-white/5"
            >
              Use demo credentials
            </motion.button>
          )}
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-white/50 text-sm mt-6"
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-primary hover:text-accent-secondary transition-colors duration-300 font-medium"
          >
            {isLogin ? 'Register' : 'Login'}
          </motion.button>
        </motion.p>
      </motion.div>
    </div>
  );
}