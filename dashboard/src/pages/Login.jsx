import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo1 from '../assets/Logo1.svg';
import PatternText from '../components/PatternText';

const SWIPE_THRESHOLD = 50;

export default function Login() {
  const { signin, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const loggedOut = location.state?.loggedOut === true;
  const showSignup = location.state?.showSignup === true;

  const [activeIndex, setActiveIndex] = useState(showSignup ? 1 : 0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const subtitles = [
    'Watch real user sessions as they happen. See every click, scroll, and interaction so you can reproduce bugs and understand exactly what went wrong.',
    'Stop guessing why users churn or where they get stuck. SessionStory turns session replays into clear insights so you can fix what matters.',
    'From first visit to conversion—see the full journey. Debug faster, support better, and build a product your users actually love.',
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % subtitles.length);
    }, 5000);
    return () => clearInterval(id);
  }, [subtitles.length]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await signin(loginEmail, loginPassword);
      navigate(from, { replace: true });
    } catch (err) {
      setLoginError(err.message || 'Failed to sign in');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupLoading(true);

    try {
      await signup(signupName, signupEmail, signupPassword);
      navigate('/', { replace: true });
    } catch (err) {
      setSignupError(err.message || 'Failed to create account');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % 2);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + 2) % 2);
    }
  };

  const cards = [
    { id: 'login', title: 'Login' },
    { id: 'signup', title: 'Sign Up' }
  ];

  const getStackOrder = () => {
    const reordered = [];
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length;
      reordered.push({ ...cards[index], stackPosition: i });
    }
    return reordered.reverse();
  };

  const getLayoutStyles = (stackPosition) => ({
    top: stackPosition * 8,
    left: stackPosition * 8,
    zIndex: cards.length - stackPosition,
    rotate: (stackPosition - 0.5) * 2,
  });

  const displayCards = getStackOrder();

  const renderLoginCard = (isTopCard) => (
    <>
      <div className="mb-5 text-center">
        <div className="mx-auto mb-4 w-fit">
          <img src={Logo1} alt="" className="h-10 w-auto object-contain" />
        </div>
        <h1 className="mb-1 text-xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-xs text-muted-foreground">Continue reviewing your sessions.</p>
      </div>

      {loggedOut && (
        <div className="mb-4 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground">
          You have been signed out successfully.
        </div>
      )}

      {loginError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {loginError}
        </div>
      )}

      <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className="text-[11px] font-medium tracking-wide text-foreground/70">
            Email
          </label>
          <input
            type="email"
            id="login-email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="login-password" className="text-[11px] font-medium tracking-wide text-foreground/70">
            Password
          </label>
          <div className="relative">
            <input
              type={showLoginPassword ? 'text' : 'password'}
              id="login-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 pr-9 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/20"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
            >
              {showLoginPassword ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loginLoading}
          className="mt-1 flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loginLoading ? (
            <>
              <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {isTopCard && (
        <div className="mt-4 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>
            Don&apos;t have an account?{' '}
            <button 
              onClick={() => setActiveIndex(1)} 
              className="font-semibold text-foreground hover:text-muted-foreground"
            >
              Create one
            </button>
          </p>
        </div>
      )}
    </>
  );

  const renderSignupCard = (isTopCard) => (
    <>
      <div className="mb-5 text-center">
        <div className="mx-auto mb-4 w-fit">
          <img src={Logo1} alt="" className="h-10 w-auto object-contain" />
        </div>
        <h1 className="mb-1 text-xl font-bold tracking-tight text-foreground">
          Create account
        </h1>
        <p className="text-xs text-muted-foreground">Get started with SessionStory, see exactly what your users experienced.</p>
      </div>

      {signupError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {signupError}
        </div>
      )}

      <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="signup-name" className="text-[11px] font-medium tracking-wide text-foreground/70">
            Full name
          </label>
          <input
            type="text"
            id="signup-name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-email" className="text-[11px] font-medium tracking-wide text-foreground/70">
            Email
          </label>
          <input
            type="email"
            id="signup-email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/20"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="signup-password" className="text-[11px] font-medium tracking-wide text-foreground/70">
            Password
          </label>
          <div className="relative">
            <input
              type={showSignupPassword ? 'text' : 'password'}
              id="signup-password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 pr-9 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-1 focus:ring-ring/20"
            />
            <button
              type="button"
              onClick={() => setShowSignupPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
            >
              {showSignupPassword ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={signupLoading}
          className="mt-1 flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signupLoading ? (
            <>
              <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      {isTopCard && (
        <div className="mt-4 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>
            Already have an account?{' '}
            <button 
              onClick={() => setActiveIndex(0)} 
              className="font-semibold text-foreground hover:text-muted-foreground"
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </>
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <img
          src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      {/* Radial gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"
      />

      {/* Bottom black gradient */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-48 -z-10 bg-gradient-to-t from-background via-background/80 to-transparent"
      />

      {/* Main content: on mobile title on top, cards below; on desktop side-by-side */}
      <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-16 py-6 pb-24 lg:py-0 lg:pb-0">
          {/* Title block - first on mobile, left on desktop */}
          <div className="text-center lg:text-left order-1 flex-shrink-0 space-y-4 lg:space-y-6">
            <div className="hidden lg:block">
              <span className="inline-block rounded-full border border-border/60 bg-card/25 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground/90 backdrop-blur-sm">
                Session replay & analytics
              </span>
            </div>
            <PatternText text="SessionStory" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl" />
            {/* Subtitle carousel - desktop only */}
            <div className="hidden lg:block text-center mx-auto max-w-lg min-h-[4.5rem] flex flex-col justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={subtitleIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-base sm:text-lg text-foreground/90 leading-relaxed px-2"
                >
                  {subtitles[subtitleIndex]}
                </motion.p>
              </AnimatePresence>
              <div className="flex justify-center gap-2 mt-4">
                {subtitles.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSubtitleIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === subtitleIndex ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/60'
                    }`}
                    aria-label={`Subtitle ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cards - below title on mobile, right on desktop */}
          <div className="relative w-full max-w-[340px] h-[420px] sm:h-[460px] lg:h-[480px] order-2 flex-shrink-0">
            <AnimatePresence mode="popLayout">
              {displayCards.map((card) => {
                const styles = getLayoutStyles(card.stackPosition);
                const isTopCard = card.stackPosition === 0;

                return (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      ...styles,
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -200 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    drag={isTopCard ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.7}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                    className={`absolute w-full inset-shadow-2xs ring-background rounded-2xl border border-border bg-card p-6 shadow-lg shadow-zinc-950/15 ring-1
                      ${isTopCard ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    style={{
                      position: 'absolute',
                      top: styles.top,
                      left: styles.left,
                      zIndex: styles.zIndex,
                      rotate: `${styles.rotate}deg`,
                    }}
                  >
                    {card.id === 'login' ? renderLoginCard(isTopCard) : renderSignupCard(isTopCard)}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Pagination dots - inside wrapper so not clipped */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'w-5 bg-primary' 
                      : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to ${index === 0 ? 'login' : 'signup'}`}
                />
              ))}
            </div>

            {/* Swipe hint - inside wrapper so not clipped */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <span className="text-[10px] text-muted-foreground/70">Swipe to switch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
