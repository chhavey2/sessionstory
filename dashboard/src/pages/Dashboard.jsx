import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PLAYER_URL = import.meta.env.VITE_PLAYER_URL || 'https://player.sessionstory.co';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSessions: 0,
    uniqueVisitors: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const sessions = await api.getUserSessions(user._id);

      const totalSessions = sessions.length;
      const uniqueVisitors = new Set(sessions.map((s) => s.visitor?._id || s.visitor)).size;

      setStats({
        totalSessions,
        uniqueVisitors,
      });

      setRecentSessions(sessions.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setRecentSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-white/70">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6 md:px-12 md:pt-10 md:pb-8">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight md:text-3xl bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-[15px] text-white/40">Overview of your session recordings</p>
        </div>
      </header>

      <div className="relative z-10 grid max-w-[700px] grid-cols-1 gap-6 px-6 pb-6 md:grid-cols-2 md:px-12 md:pb-8">
        <div className="relative flex items-start gap-5 overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] p-7 backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:border-solid hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[36px] font-bold leading-tight tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
              {stats.totalSessions}
            </span>
            <span className="mt-1.5 text-sm font-medium text-white/40">Total Sessions</span>
          </div>
        </div>

        <div className="relative flex items-start gap-5 overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] p-7 backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:border-solid hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[36px] font-bold leading-tight tracking-tight bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
              {stats.uniqueVisitors}
            </span>
            <span className="mt-1.5 text-sm font-medium text-white/40">Unique Visitors</span>
          </div>
        </div>
      </div>

      <section className="relative z-10 px-6 md:px-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Recent Sessions</h2>
          <Link
            to="/sessions"
            className="flex items-center gap-2 rounded-full bg-[rgba(16,185,129,0.1)] px-4 py-2 text-sm font-medium text-emerald-400 transition-all duration-150 hover:bg-emerald-500/15 hover:text-emerald-300"
          >
            View all
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-6 py-16 text-center md:px-12 md:py-20 backdrop-blur-[20px] before:absolute before:left-1/2 before:top-[-50%] before:h-[300px] before:w-[300px] before:-translate-x-1/2 before:rounded-full before:bg-[rgba(16,185,129,0.4)] before:blur-[100px] before:opacity-30 before:content-[''] after:absolute after:inset-0 after:bg-[length:80px_80px] after:opacity-100 after:content-['']"
            style={{ WebkitBackdropFilter: 'blur(20px)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='rgba(16,185,129,0.03)' stroke-width='0.5' stroke-dasharray='2 3'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'/%3E%3C/svg%3E")` }}
          >
            <svg className="relative z-10 mx-auto mb-6 h-[72px] w-[72px] text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="relative z-10 mb-2.5 text-xl font-semibold">No sessions yet</h3>
            <p className="relative z-10 mx-auto mb-7 max-w-[320px] text-[15px] text-white/40">
              Install the recorder script on your website to start capturing sessions.
            </p>
            <Link
              to="/setup"
              className="relative z-10 inline-flex items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)]"
            >
              Get started
            </Link>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] before:absolute before:right-5 before:top-[60px] before:h-[100px] before:w-[100px] before:bg-[length:50px_50px] before:opacity-100 before:content-['']"
            style={{ WebkitBackdropFilter: 'blur(20px)', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24' fill='none' stroke='rgba(16,185,129,0.03)' stroke-width='0.5' stroke-dasharray='2 2'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'/%3E%3C/svg%3E")` }}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-dashed border-white/10 bg-white/[0.02] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-white/40">Session</th>
                  <th className="border-b border-dashed border-white/10 bg-white/[0.02] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-white/40">Visitor</th>
                  <th className="border-b border-dashed border-white/10 bg-white/[0.02] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-white/40">Location</th>
                  <th className="border-b border-dashed border-white/10 bg-white/[0.02] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-white/40">Date</th>
                  <th className="border-b border-dashed border-white/10 bg-white/[0.02] px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-white/40"></th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session._id || session.sessionId} className="transition-colors duration-150 hover:bg-white/[0.06]">
                    <td className="border-b border-white/[0.04] px-6 py-4">
                      <code className="rounded-lg border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-2.5 py-1.5 text-xs">
                        {session.sessionId?.slice(-12) || 'N/A'}
                      </code>
                    </td>
                    <td className="border-b border-white/[0.04] px-6 py-4">
                      <span className="inline-flex rounded-full border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs font-medium text-white/70">
                        {session.visitor?.fingerprint?.slice(-8) ||
                          session.visitor?.fp?.slice(-8) ||
                          'Anonymous'}
                      </span>
                    </td>
                    <td className="border-b border-white/[0.04] px-6 py-4">
                      <span className="inline-flex rounded-full border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-xs font-medium text-white/70">
                        {session.visitor?.city || 'Unknown'}
                      </span>
                    </td>
                    <td className="border-b border-white/[0.04] px-6 py-4 text-white/70">{formatDate(session.createdAt)}</td>
                    <td className="border-b border-white/[0.04] px-6 py-4">
                      <a
                        href={`${PLAYER_URL}/${session.sessionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] [&_svg]:ml-0.5 [&_svg]:h-3.5 [&_svg]:w-3.5"
                        title="Watch session"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
