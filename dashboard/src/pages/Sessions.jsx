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
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-white/70">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
        <p>Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6 md:px-12 md:pt-10 md:pb-8">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight md:text-3xl bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Sessions
          </h1>
          <p className="text-[15px] text-white/40">
            {sessions.length} recorded session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-stretch gap-4 px-6 pb-6 sm:flex-row md:px-12 md:pb-8">
        <div className="relative max-w-[400px] flex-1">
          <svg
            className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by session ID or visitor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] py-3.5 pl-12 pr-5 text-sm text-white backdrop-blur-[20px] transition-all duration-150 placeholder:text-white/25 hover:border-white/15 focus:border-emerald-500 focus:outline-none focus:ring-[3px] focus:ring-[rgba(16,185,129,0.1)]"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
          />
        </div>

        <div className="sort-dropdown">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer appearance-none rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] py-3.5 pl-5 pr-11 text-sm text-white backdrop-blur-[20px] transition-all duration-150 hover:border-white/15 focus:border-emerald-500 focus:outline-none bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat"
            style={{
              WebkitBackdropFilter: 'blur(20px)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="relative z-10 px-6 md:px-12">
          <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] px-12 py-20 text-center backdrop-blur-[20px] before:absolute before:left-1/2 before:top-[-50%] before:h-[300px] before:w-[300px] before:-translate-x-1/2 before:rounded-full before:bg-[rgba(16,185,129,0.4)] before:blur-[100px] before:opacity-30 before:content-['']"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
          >
            {sessions.length === 0 ? (
              <>
                <svg className="relative z-10 mx-auto mb-6 h-[72px] w-[72px] text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="relative z-10 mb-2.5 text-xl font-semibold">No sessions recorded</h3>
                <p className="relative z-10 mx-auto mb-7 max-w-[320px] text-[15px] text-white/40">
                  Install the recorder script on your website to start capturing user sessions.
                </p>
                <Link
                  to="/setup"
                  className="relative z-10 inline-flex items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)]"
                >
                  Get setup instructions
                </Link>
              </>
            ) : (
              <>
                <svg className="relative z-10 mx-auto mb-6 h-[72px] w-[72px] text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <h3 className="relative z-10 mb-2.5 text-xl font-semibold">No matching sessions</h3>
                <p className="relative z-10 mx-auto mb-7 text-[15px] text-white/40">Try adjusting your search or filters.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="relative z-10 inline-flex items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(16,185,129,0.4)]"
                >
                  Clear search
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 gap-6 px-6 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] md:px-12">
          {filteredSessions.map((session) => (
            <a
              key={session._id || session.sessionId}
              href={`${PLAYER_URL}/${session.sessionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:border-solid hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_40px_rgba(16,185,129,0.4)] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
              style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
              <div className="relative flex h-[180px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a28] to-[#151520] before:absolute before:left-1/2 before:top-1/5 before:h-[200px] before:w-[200px] before:-translate-x-1/2 before:rounded-full before:bg-[rgba(16,185,129,0.4)] before:blur-[40px] before:opacity-50 after:absolute after:inset-0 after:bg-[length:40px_40px] after:opacity-100 after:content-['']"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='0.5' stroke-dasharray='2 2'%3E%3Cpolygon points='5 3 19 12 5 21 5 3'/%3E%3C/svg%3E")` }}
              >
                <div className="relative z-10">
                  <svg className="h-16 w-16 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100">
                  <svg className="h-14 w-14 text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <code className="text-[11px]">{session.sessionId?.slice(-12) || 'N/A'}</code>
                  <span className="text-xs text-white/40">{formatDate(session.createdAt)}</span>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-white/70">
                    <svg className="h-4 w-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>
                      {session.visitor?.fingerprint?.slice(-8) ||
                        session.visitor?.fp?.slice(-8) ||
                        'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-white/70">
                    <svg className="h-4 w-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
