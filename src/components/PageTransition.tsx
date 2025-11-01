import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Page transition wrapper component
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return <div className="page-transition">{children}</div>;
};

