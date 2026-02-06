import { useRef, useCallback, cloneElement } from 'react';
import { useOutlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LimelightNav from './LimelightNav';
import Logo1 from '../assets/Logo1.svg';
import PatternText from './PatternText';

const InsightsIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const SessionsIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SetupIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

const PAGE_ORDER = ['/', '/sessions', '/setup'];

export default function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentOutlet = useOutlet();
  const directionRef = useRef(1);
  const prevIndexRef = useRef(PAGE_ORDER.indexOf(location.pathname));
  const isFirstRender = useRef(true);

  const getCurrentIndex = (pathname) => {
    const idx = PAGE_ORDER.indexOf(pathname);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getCurrentIndex(location.pathname);

  const getDirection = useCallback(() => {
    const newIndex = currentIndex;
    const prevIndex = prevIndexRef.current;
    
    if (newIndex !== prevIndex) {
      directionRef.current = newIndex > prevIndex ? 1 : -1;
      prevIndexRef.current = newIndex;
    }
    
    return directionRef.current;
  }, [currentIndex]);

  const direction = getDirection();

  const handleLogout = () => {
    logout();
    navigate('/login', { state: { loggedOut: true } });
  };

  const handleNavChange = (index) => {
    if (index === 3) {
      handleLogout();
      return;
    }
    const targetPath = PAGE_ORDER[index];
    if (targetPath && targetPath !== location.pathname) {
      const newDirection = index > currentIndex ? 1 : -1;
      directionRef.current = newDirection;
      navigate(targetPath);
    }
  };

  const navItems = [
    { id: 'insights', icon: <InsightsIcon />, label: 'Insights' },
    { id: 'sessions', icon: <SessionsIcon />, label: 'Sessions' },
    { id: 'setup', icon: <SetupIcon />, label: 'Setup' },
    { id: 'logout', icon: <LogoutIcon />, label: 'Logout' },
  ];

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 -z-20">
        <img
          src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div
        aria-hidden
        className="fixed inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
      />
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 h-48 -z-10 bg-gradient-to-t from-background via-background/80 to-transparent"
      />
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 h-28 z-40 pointer-events-none bg-gradient-to-b from-background via-background/85 to-transparent"
      />

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-1.5">
            <img src={Logo1} alt="SessionStory" className="h-8 w-auto object-contain" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/25 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(52,211,153,0.15)]" />
              Online
            </span>
          </div>

          <PatternText text="SessionStory" className="text-3xl sm:text-4xl tracking-tight" />
        </div>
      </header>

      <main className="relative min-h-screen pt-16 pb-24 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={isFirstRender.current ? false : { x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={pageTransition}
            onAnimationComplete={() => { isFirstRender.current = false; }}
            className="w-full"
          >
            {currentOutlet && cloneElement(currentOutlet, { key: location.pathname })}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <LimelightNav
          items={navItems}
          activeIndex={currentIndex < 3 ? currentIndex : -1}
          onTabChange={handleNavChange}
          className="shadow-lg shadow-zinc-950/30 border-border bg-card/65 backdrop-blur-xl"
        />
      </div>
    </div>
  );
}
