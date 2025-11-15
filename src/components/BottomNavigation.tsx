import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/map', label: 'Map', icon: Map },
  { path: '/plan', label: 'Plan', icon: Calendar },
];

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="grid grid-cols-3 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 transition-all duration-200',
                active
                  ? 'text-[#5e6ad2]'
                  : 'text-gray-500 active:text-[#5e6ad2]'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div className={cn(
                'relative',
                active && 'animate-bounce-subtle'
              )}>
                <Icon 
                  size={22} 
                  strokeWidth={active ? 2.5 : 2}
                  aria-hidden="true" 
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#5e6ad2] rounded-full" />
                )}
              </div>
              <span className={cn(
                'text-[10px] font-semibold leading-tight',
                active ? 'text-[#5e6ad2]' : 'text-gray-500'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

