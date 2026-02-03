import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PLAYER_URL = import.meta.env.VITE_PLAYER_URL || 'https://player.sessionstory.co';

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user?._id) {
      loadSessions();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortSessions();
  }, [sessions, searchTerm, sortBy]);

  const loadSessions = async () => {
    try {
      const data = await api.getUserSessions(user._id);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSessions = () => {
    let result = [...sessions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (session) =>
          session.sessionId?.toLowerCase().includes(term) ||
          session.visitor?.fingerprint?.toLowerCase().includes(term) ||
          session.visitor?.city?.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredSessions(result);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="sessions-page">
      <header className="page-header">
        <div>
          <h1>Sessions</h1>
          <p>
            {sessions.length} recorded session
            {sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="sessions-toolbar">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by session ID or visitor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-dropdown">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="empty-state">
          {sessions.length === 0 ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>No sessions recorded</h3>
              <p>Install the recorder script on your website to start capturing user sessions.</p>
              <Link to="/setup" className="empty-state-button">
                Get setup instructions
              </Link>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <h3>No matching sessions</h3>
              <p>Try adjusting your search or filters.</p>
              <button onClick={() => setSearchTerm('')} className="empty-state-button">
                Clear search
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="sessions-grid">
          {filteredSessions.map((session) => (
            <a
              key={session._id || session.sessionId}
              href={`${PLAYER_URL}/${session.sessionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="session-card"
            >
              <div className="session-card-header">
                <div className="session-thumbnail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="session-play-overlay">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              <div className="session-card-body">
                <div className="session-meta">
                  <code className="session-id">{session.sessionId?.slice(-12) || 'N/A'}</code>
                  <span className="session-date">{formatDate(session.createdAt)}</span>
                </div>

                <div className="session-stats">
                  <div className="session-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>
                      {session.visitor?.fingerprint?.slice(-8) ||
                        session.visitor?.fp?.slice(-8) ||
                        'Anonymous'}
                    </span>
                  </div>
                  <div className="session-stat">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{session.visitor?.city || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

