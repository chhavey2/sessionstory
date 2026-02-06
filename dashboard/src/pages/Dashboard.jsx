import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import BentoGrid from '../components/BentoGrid';
import Loader from '../components/Loader';

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
    return <Loader message="Loading dashboard..." />;
  }

  const insightItems = [
    {
      id: 'total-sessions',
      title: 'Total sessions',
      value: stats.totalSessions,
      description: 'How many recordings you’ve captured so far.',
      icon: (
        <svg className="h-4 w-4 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      status: 'Live',
      tags: ['Replays'],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      id: 'unique-visitors',
      title: 'Unique visitors',
      value: stats.uniqueVisitors,
      description: 'Distinct people who generated sessions on your site.',
      icon: (
        <svg className="h-4 w-4 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      status: 'Today',
      tags: ['Users'],
    },
  ];

  return (
    <div className="pb-24">
      <div className="relative z-10 w-full lg:w-[70%] mx-auto px-6">
        <PageHeader
          kicker="Insights"
          title="Dashboard"
          description="A quick snapshot of what’s being recorded, who’s visiting, and what to do next."
        />

        <BentoGrid items={insightItems} className="mt-4" />

        <section className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Recent sessions</h2>
          <Link
            to="/sessions"
            className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold text-foreground transition-all duration-150 hover:bg-muted"
          >
            View all
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-lg shadow-zinc-950/15">
            <svg className="mx-auto mb-6 h-[72px] w-[72px] text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mb-2.5 text-xl font-semibold text-foreground">No sessions yet</h3>
            <p className="mx-auto mb-7 max-w-[320px] text-[15px] text-muted-foreground">
              Install the recorder script on your website to start capturing sessions.
            </p>
            <Link
              to="/setup"
              className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Get started
            </Link>
          </div>
        ) : (
          <div className="table-scroll-touch overflow-x-auto rounded-2xl border border-border bg-card shadow-lg shadow-zinc-950/15">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-border bg-secondary/40 px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Session</th>
                  <th className="border-b border-border bg-secondary/40 px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Visitor</th>
                  <th className="border-b border-border bg-secondary/40 px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Location</th>
                  <th className="border-b border-border bg-secondary/40 px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Events</th>
                  <th className="border-b border-border bg-secondary/40 px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Date</th>
                  <th className="border-b border-border bg-secondary/40 px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session._id || session.sessionId} className="transition-colors duration-150 hover:bg-secondary/30">
                    <td className="border-b border-border/50 px-5 py-3.5">
                      <code className="rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs">
                        {session.sessionId?.slice(-12) || 'N/A'}
                      </code>
                    </td>
                    <td className="border-b border-border/50 px-5 py-3.5">
                      <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground/70">
                        {session.visitor?.fingerprint?.slice(-8) ||
                          session.visitor?.fp?.slice(-8) ||
                          'Anonymous'}
                      </span>
                    </td>
                    <td className="border-b border-border/50 px-5 py-3.5">
                      <span className="text-xs font-medium text-foreground/70">
                        {formatLocation(session.visitor)}
                      </span>
                    </td>
                    <td className="border-b border-border/50 px-5 py-3.5 text-xs font-medium text-foreground/70">
                      {getEventCount(session)} events
                    </td>
                    <td className="border-b border-border/50 px-5 py-3.5 text-foreground/70">{formatDate(session.createdAt)}</td>
                    <td className="border-b border-border/50 px-5 py-3.5">
                      <a
                        href={`${PLAYER_URL}/${session.sessionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-[11px] font-semibold text-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                        title="Watch session"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none" />
                        </svg>
                        Watch
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
    </div>
  );
}
