import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
    <nav className="flow-nav sticky top-0 z-40 flex items-center justify-between border-b border-white/10 px-6 py-4 text-white sm:px-10 lg:px-16 backdrop-blur-xl bg-background-dark/80">
      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-white/60">
        <div className="h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
        NAFIRA
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              clsx(
                'rounded-full px-4 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary',
                isActive
                  ? 'bg-white/20 text-white shadow-glow'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="rounded-full px-4 py-2 text-white/70 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
      <NavLink
        to="/analysis"
        className="rounded-full bg-accent-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest shadow-glow hover:scale-[1.02] transition"
      >
        Analyze meal
      </NavLink>
    </nav>
  );
}
