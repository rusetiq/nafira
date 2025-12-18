import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
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

  // Demo credentials quick fill
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
    <div className="min-h-screen bg-background-dark flex items-center justify-center px-6 py-12 relative">
      <DitheredBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <GradientText className="text-5xl font-bold mb-4">Nafira</GradientText>
          <p className="text-white/70">Metabolic Radiance Dashboard</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-full text-sm font-semibold uppercase tracking-wide transition ${
                isLogin
                  ? 'bg-accent-primary text-white'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <LogIn className="inline-block mr-2 h-4 w-4" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-full text-sm font-semibold uppercase tracking-wide transition ${
                !isLogin
                  ? 'bg-accent-primary text-white'
                  : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              <UserPlus className="inline-block mr-2 h-4 w-4" />
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-white/60 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary transition"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/60 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/60 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary transition"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Allergies (optional)</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary transition"
                    placeholder="e.g., Dairy, soy"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Goals (optional)</label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-accent-primary transition resize-none"
                    placeholder="Your health goals..."
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-accent-primary text-white font-semibold uppercase tracking-wide shadow-glow hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {isLogin && (
            <button
              onClick={fillDemo}
              className="w-full mt-4 py-2 text-sm text-white/60 hover:text-white transition"
            >
              Use demo credentials
            </button>
          )}
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-primary hover:underline"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
