import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown, User, Sparkles, Camera, History, FileText, Leaf, Baby } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

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
      { to: '/menu', label: 'Menu & Order', icon: Menu },
      { to: '/history', label: 'History', icon: History },
    ]
  },
  {
    label: 'SDG Features',
    items: [
      { to: '/children', label: 'Children', icon: Baby },
      { to: '/sustainability', label: 'Sustainability', icon: Leaf },
      { to: '/knowledge', label: 'Learn', icon: FileText },
    ]
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: User },
    ]
  },
  {
    label: 'Legal',
    items: [
      { to: '/terms', label: 'Terms', icon: FileText },
      { to: '/privacy', label: 'Privacy', icon: Sparkles },
    ]
  }
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const isLanding = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  if (isLanding) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    },
    hidden: { y: -20, opacity: 0 }
  };

  const itemVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -10, opacity: 0 }
  };

  return (
    <>
      <div className="h-24 pointer-events-none" aria-hidden="true" />

      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-12 py-6 transition-all duration-500",
          scrolled ? "backdrop-blur-md bg-black/5 py-4 border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-12">
          {/* Logo */}
          <motion.div variants={itemVariants} className="relative group cursor-pointer" onClick={() => navigate('/dashboard')}>
            <span className="font-bricolage text-2xl font-bold tracking-tighter uppercase text-white mix-blend-difference z-10 relative">
              NAFIRA
            </span>
            <div className="absolute -inset-2 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated && menuGroups.map((group) => (
              <div key={group.label} className="relative" onMouseEnter={() => setOpenDropdown(group.label)} onMouseLeave={() => setOpenDropdown(null)}>
                <button
                  className={clsx(
                    'font-bricolage text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5',
                    openDropdown === group.label || location.pathname.includes(group.items[0].to) // Basic active check
                      ? 'text-white bg-white/10 ring-1 ring-white/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {group.label}
                  <ChevronDown
                    size={12}
                    className={clsx(
                      'transition-transform duration-300 opacity-50',
                      openDropdown === group.label && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {openDropdown === group.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 min-w-[240px] p-2 rounded-2xl liquid-glass bg-black/40 overflow-hidden z-50"
                    >
                      {/* Decorative gradient blob inside dropdown */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent-primary/20 blur-2xl rounded-full pointer-events-none" />

                      <div className="relative z-10 flex flex-col gap-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          return (
                            <NavLink
                              key={item.to}
                              to={item.to}
                              onClick={() => setOpenDropdown(null)}
                              className={({ isActive }) =>
                                clsx(
                                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group/item',
                                  isActive ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5 text-white/60 hover:text-white'
                                )
                              }
                            >
                              <div className={clsx(
                                "p-2 rounded-lg transition-colors duration-300",
                                "bg-white/5 group-hover/item:bg-accent-primary/20 group-hover/item:text-accent-primary"
                              )}>
                                {Icon && <Icon size={16} />}
                              </div>
                              <span className="font-bricolage text-sm font-medium tracking-wide">{item.label}</span>
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
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <motion.button
              variants={itemVariants}
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
            >
              <LogOut size={14} className="text-white/40 group-hover:text-amber-500 transition-colors" />
              <span className="font-bricolage text-xs font-semibold uppercase tracking-wider text-white/60 group-hover:text-white transition-colors">Log out</span>
            </motion.button>
          ) : (
            !isLanding && location.pathname !== '/login' && (
              <motion.button
                variants={itemVariants}
                onClick={() => navigate('/login')}
                className="hidden lg:flex px-6 py-2 rounded-full bg-white text-black font-bricolage font-bold text-sm hover:scale-105 transition-transform"
              >
                Login
              </motion.button>
            )
          )}

          {/* Mobile Menu Toggle */}
          <motion.button
            variants={itemVariants}
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-white/80 hover:text-white transition-colors relative"
          >
            <Menu size={28} strokeWidth={1.5} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#050505] z-[70] p-8 overflow-y-auto border-l border-white/10"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-bricolage text-2xl font-bold tracking-tighter uppercase text-white">
                  NAFIRA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-10">
                {isAuthenticated && menuGroups.map((group, idx) => (
                  <motion.div
                    key={group.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    className="space-y-4"
                  >
                    <div className="font-mono text-xs text-accent-primary uppercase tracking-widest">{group.label}</div>
                    <div className="grid gap-3">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              clsx(
                                'flex items-center gap-4 px-4 py-3 rounded-xl transition-all border border-transparent',
                                isActive
                                  ? 'bg-white/10 border-white/5 text-white'
                                  : 'text-white/50 hover:text-white hover:bg-white/5'
                              )
                            }
                          >
                            {Icon && <Icon size={20} />}
                            <span className="font-bricolage text-lg font-medium">{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                <div className="pt-8 border-t border-white/10">
                  {isAuthenticated ? (
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all font-bricolage font-bold uppercase text-sm tracking-wider"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-black hover:bg-white/90 transition-all font-bricolage font-bold uppercase text-sm tracking-wider"
                    >
                      <User size={18} />
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}