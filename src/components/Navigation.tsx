import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, MapPin, Clock, Info, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/map', label: 'Map', icon: Map },
  { path: '/plan', label: 'Plan', icon: Calendar },
  { path: '/guide', label: 'Spots', icon: MapPin },
  { path: '/timing', label: 'Timing', icon: Clock },
  { path: '/info', label: 'Info', icon: Info },
];

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#5e6ad2] shadow-md sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            aria-label="Home"
          >
            <div className="bg-white p-2 rounded-[0.5rem] shadow-sm group-hover:shadow-md transition-all">
              <svg className="w-6 h-6 text-[#5e6ad2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-white hidden sm:inline font-heading">
              Marathon Spectator
            </span>
            <span className="font-bold text-lg text-white sm:hidden font-heading">
              Marathon
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-4 py-2 rounded-[0.5rem] transition-all flex items-center space-x-2 font-semibold text-sm',
                    isActive(item.path)
                      ? 'bg-white text-[#5e6ad2] shadow-md' 
                      : 'text-white hover:bg-white/20'
                  )}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <button 
            className="md:hidden p-2 rounded-[0.5rem] hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5e6ad2]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-[0.5rem] transition-all font-semibold text-sm',
                    isActive(item.path)
                      ? 'bg-white text-[#5e6ad2] shadow-md' 
                      : 'text-white hover:bg-white/20'
                  )}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
