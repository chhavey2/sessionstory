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
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your session recordings</p>
        </div>
      </header>

      <div className="stats-grid stats-grid-2">
        <div className="stat-card">
          <div className="stat-icon sessions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalSessions}</span>
            <span className="stat-label">Total Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon visitors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.uniqueVisitors}</span>
            <span className="stat-label">Unique Visitors</span>
          </div>
        </div>
      </div>

      <section className="recent-sessions">
        <div className="section-header">
          <h2>Recent Sessions</h2>
          <Link to="/sessions" className="view-all-link">
            View all
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentSessions.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3>No sessions yet</h3>
            <p>Install the recorder script on your website to start capturing sessions.</p>
            <Link to="/setup" className="empty-state-button">
              Get started
            </Link>
          </div>
        ) : (
          <div className="sessions-table">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Visitor</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session._id || session.sessionId}>
                    <td>
                      <code className="session-id">{session.sessionId?.slice(-12) || 'N/A'}</code>
                    </td>
                    <td>
                      <span className="visitor-badge">
                        {session.visitor?.fingerprint?.slice(-8) ||
                          session.visitor?.fp?.slice(-8) ||
                          'Anonymous'}
                      </span>
                    </td>
                    <td>
                      <span className="visitor-badge">
                        {session.visitor?.city || 'Unknown'}
                      </span>
                    </td>
                    <td>{formatDate(session.createdAt)}</td>
                    <td>
                      <a
                        href={`${PLAYER_URL}/${session.sessionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="play-button"
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
