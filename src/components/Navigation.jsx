import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Sparkles, Droplet, Menu, X, Baby, Leaf, Book, ChevronDown, Camera, History, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: Sparkles },
    ]
  },
  {
    label: 'Nutrition',
    items: [
      { to: '/analysis', label: 'Meal Analysis', icon: Camera },
      { to: '/history', label: 'History', icon: History },
    ]
  },
  {
    label: 'SDG Features',
    items: [
      { to: '/children', label: 'Children', icon: Baby },
      { to: '/sustainability', label: 'Sustainability', icon: Leaf },
      { to: '/knowledge', label: 'Learn', icon: Book },
    ]
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: User },
    ]
  }
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isLanding = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  if (isLanding) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-3xl bg-gradient-to-br from-background-dark/80 via-background-dark/70 to-background-dark/80">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/5 via-transparent to-accent-primary/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16 py-3 sm:py-5">
        <div className="flex items-center justify-between gap-4 sm:gap-8">

          <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-primary/30 blur-2xl rounded-full" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl shadow-2xl border border-white/20 group-hover:border-accent-primary/50 transition-all duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-transparent rounded-2xl" />
                <Droplet size={18} className="sm:w-[22px] sm:h-[22px] text-accent-primary relative z-10 drop-shadow-lg" strokeWidth={2} fill="currentColor" fillOpacity={0.3} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent drop-shadow-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                NAFIRA
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest text-accent-primary/80 uppercase font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Smart Nutrition
              </span>
            </div>
          </div>

          {/* Desktop Navigation with Dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            {menuGroups.map((group) => (
              <div key={group.label} className="relative">
                <button
                  onClick={() => toggleDropdown(group.label)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300',
                    openDropdown === group.label
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {group.label}
                  <ChevronDown
                    size={16}
                    className={clsx(
                      'transition-transform duration-300',
                      openDropdown === group.label && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {openDropdown === group.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full mt-2 right-0 min-w-[200px] rounded-2xl bg-background-dark/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                      <div className="p-2">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              onClick={() => setOpenDropdown(null)}
                              className={({ isActive }) =>
                                clsx(
                                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                  isActive
                                    ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-white border border-accent-primary/30'
                                    : 'text-white/70 hover:text-white hover:bg-white/5'
                                )
                              }
                            >
                              {Icon && <Icon size={18} />}
                              <span className="text-sm font-medium">{item.label}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className="space-y-4 pb-4">
                {menuGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs uppercase tracking-wider text-white/40 px-4 mb-2">{group.label}</p>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                isActive
                                  ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-white border border-accent-primary/30'
                                  : 'text-white/70 hover:text-white hover:bg-white/5'
                              )
                            }
                          >
                            {Icon && <Icon size={18} />}
                            <span className="text-sm font-medium">{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all w-full"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}