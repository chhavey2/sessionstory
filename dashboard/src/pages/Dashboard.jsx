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

  const formatLocation = (visitor) => {
    if (!visitor) return 'Unknown';
    const city = visitor.city || visitor.region;
    const country = visitor.country;
    if (city && country) return `${city}, ${country}`;
    if (city) return city;
    if (country) return country;
    return 'Unknown';
  };

  const getEventCount = (session) =>
    session.eventsLength ?? session.eventCount ?? session.events?.length ?? 0;

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-muted-foreground">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6 md:px-12 md:pt-10 md:pb-8">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            Dashboard
          </h1>
          <p className="text-[15px] text-muted-foreground">Overview of your session recordings</p>
        </div>
      </header>

      <div className="relative z-10 grid max-w-[700px] grid-cols-1 gap-6 px-6 pb-6 md:grid-cols-2 md:px-12 md:pb-8">
        <div className="inset-shadow-2xs ring-background relative flex items-start gap-5 overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-lg shadow-zinc-950/15 ring-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7] text-white">
            <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[36px] font-bold leading-tight tracking-tight text-foreground">
              {stats.totalSessions}
            </span>
            <span className="mt-1.5 text-sm font-medium text-muted-foreground">Total Sessions</span>
          </div>
        </div>

        <div className="inset-shadow-2xs ring-background relative flex items-start gap-5 overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-lg shadow-zinc-950/15 ring-1 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2BC8B7] to-[#9B99FE] text-white">
            <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[36px] font-bold leading-tight tracking-tight text-foreground">
              {stats.uniqueVisitors}
            </span>
            <span className="mt-1.5 text-sm font-medium text-muted-foreground">Unique Visitors</span>
          </div>
        </div>
      </div>

      <section className="relative z-10 px-6 md:px-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent Sessions</h2>
          <Link
            to="/sessions"
            className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all duration-150 hover:bg-muted"
          >
            View all
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="inset-shadow-2xs ring-background relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 text-center md:px-12 md:py-20 shadow-lg shadow-zinc-950/15 ring-1">
            <svg className="relative z-10 mx-auto mb-6 h-[72px] w-[72px] text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="relative z-10 mb-2.5 text-xl font-semibold text-foreground">No sessions yet</h3>
            <p className="relative z-10 mx-auto mb-7 max-w-[320px] text-[15px] text-muted-foreground">
              Install the recorder script on your website to start capturing sessions.
            </p>
            <Link
              to="/setup"
              className="relative z-10 inline-flex items-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        ) : (
          <div className="inset-shadow-2xs ring-background relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-zinc-950/15 ring-1">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-border bg-secondary/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Session</th>
                  <th className="border-b border-border bg-secondary/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Visitor</th>
                  <th className="border-b border-border bg-secondary/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Location</th>
                  <th className="border-b border-border bg-secondary/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Events</th>
                  <th className="border-b border-border bg-secondary/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="border-b border-border bg-secondary/50 px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session._id || session.sessionId} className="transition-colors duration-150 hover:bg-secondary/30">
                    <td className="border-b border-border/50 px-6 py-4">
                      <code className="rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs">
                        {session.sessionId?.slice(-12) || 'N/A'}
                      </code>
                    </td>
                    <td className="border-b border-border/50 px-6 py-4">
                      <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground/70">
                        {session.visitor?.fingerprint?.slice(-8) ||
                          session.visitor?.fp?.slice(-8) ||
                          'Anonymous'}
                      </span>
                    </td>
                    <td className="border-b border-border/50 px-6 py-4">
                      <span className="text-xs font-medium text-foreground/70">
                        {formatLocation(session.visitor)}
                      </span>
                    </td>
                    <td className="border-b border-border/50 px-6 py-4 text-xs font-medium text-foreground/70">
                      {getEventCount(session)} events
                    </td>
                    <td className="border-b border-border/50 px-6 py-4 text-foreground/70">{formatDate(session.createdAt)}</td>
                    <td className="border-b border-border/50 px-6 py-4">
                      <a
                        href={`${PLAYER_URL}/${session.sessionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all duration-300 hover:scale-110 hover:bg-primary/90 [&_svg]:ml-0.5 [&_svg]:h-3.5 [&_svg]:w-3.5"
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
