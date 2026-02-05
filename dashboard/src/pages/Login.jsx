import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const loggedOut = location.state?.loggedOut === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signin(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-6">
      {/* Floating orbs */}
      <div
        className="absolute -left-[100px] -top-[100px] h-[400px] w-[400px] rounded-full bg-[rgba(16,185,129,0.4)] blur-[80px] animate-[float_20s_ease-in-out_infinite]"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="absolute -bottom-[50px] -right-[50px] h-[300px] w-[300px] rounded-full bg-[rgba(59,130,246,0.3)] blur-[80px] animate-[float_20s_ease-in-out_infinite]"
        style={{ animationDelay: '-10s' }}
      />

      <div
        className="relative z-10 w-full max-w-[440px] rounded-3xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] p-12 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-[40px]"
        style={{ WebkitBackdropFilter: 'blur(40px)' }}
      >
        <div
          className="absolute right-5 top-5 h-[120px] w-[120px] opacity-80"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='rgba(16,185,129,0.06)' stroke-width='1' stroke-dasharray='2 2'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div className="mb-9 text-center">
          <div className='mx-auto mb-6 w-fit bg-[#0DAF7B] p-3 rounded-2xl shadow-[0_0_25px_rgba(13,175,123,0.8),0_0_50px_rgba(13,175,123,0.4)]'>
            <img
              className="h-9 w-9 object-contain brightness-0 invert"
              src="/logo2.svg"
              alt=""
            />
          </div>
          <h1 className="mb-2 text-[28px] font-bold tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-[15px] text-white/40">Sign in to your SessionStory account</p>
        </div>

        {loggedOut && (
          <div className="mb-6 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            You have been signed out successfully.
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm text-red-300">
            <svg className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[13px] font-medium tracking-wide text-white/70">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3.5 text-[15px] text-white transition-all duration-150 placeholder:text-white/25 hover:border-white/15 hover:bg-white/[0.06] focus:border-emerald-500 focus:bg-white/[0.06] focus:outline-none focus:ring-[3px] focus:ring-[rgba(16,185,129,0.1)] focus:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[13px] font-medium tracking-wide text-white/70">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-3.5 text-[15px] text-white transition-all duration-150 placeholder:text-white/25 hover:border-white/15 hover:bg-white/[0.06] focus:border-emerald-500 focus:bg-white/[0.06] focus:outline-none focus:ring-[3px] focus:ring-[rgba(16,185,129,0.1)] focus:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="relative mt-2 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-4 text-[15px] font-semibold tracking-wide text-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-7 border-t border-dashed border-white/10 pt-7 text-center text-sm text-white/40">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-emerald-400 hover:text-emerald-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
