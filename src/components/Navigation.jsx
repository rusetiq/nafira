import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles, Droplet } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analysis', label: 'Meal Analysis' },
  { to: '/history', label: 'History' },
  { to: '/profile', label: 'Profile' },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isLanding = location.pathname === '/';
  
  if (isLanding) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-3xl bg-gradient-to-br from-background-dark/80 via-background-dark/70 to-background-dark/80">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-primary/5" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-5 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between gap-8">
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary/30 blur-2xl rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-2xl border border-white/20 group-hover:border-accent-primary/50 transition-all duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-transparent rounded-2xl" />
                <Droplet size={22} className="text-accent-primary relative z-10 drop-shadow-lg" strokeWidth={2} fill="currentColor" fillOpacity={0.3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                NAFIRA
              </span>
              <span className="text-xs tracking-widest text-accent-primary/80 uppercase font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Smart Nutrition
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'relative px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-500 overflow-hidden',
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-xl rounded-xl" />
                        <div className="absolute inset-0 bg-accent-primary/10 rounded-xl shadow-lg shadow-accent-primary/20" />
                        <div className="absolute inset-0 border border-white/20 rounded-xl" />
                      </>
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-white/0 hover:bg-white/5 rounded-xl transition-all duration-300" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="relative p-3 text-white/60 hover:text-white rounded-xl transition-all duration-300 overflow-hidden group"
              title="Logout"
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 backdrop-blur-xl rounded-xl transition-all duration-300" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-300" />
              <LogOut size={18} className="relative z-10" />
            </button>
            
            <NavLink
              to="/analysis"
              className="relative group overflow-hidden rounded-2xl px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-500 hover:scale-[1.03]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary via-accent-primary to-accent-primary/80" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 shadow-2xl shadow-accent-primary/40 group-hover:shadow-accent-primary/60 transition-all duration-500" />
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center gap-2.5 z-10 drop-shadow-lg">
                <Sparkles size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                Analyze Meal
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}