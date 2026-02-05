import { useState, useEffect, useRef } from 'react';
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      loadSessions();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortSessions();
  }, [sessions, searchTerm, sortBy]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          session.visitor?.fp?.toLowerCase().includes(term) ||
          session.visitor?.city?.toLowerCase().includes(term) ||
          session.visitor?.country?.toLowerCase().includes(term) ||
          session.url?.toLowerCase().includes(term),
      );
    }

    const getEventCount = (s) => s.eventsLength ?? s.eventCount ?? s.events?.length ?? 0;
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'most_events':
          return getEventCount(b) - getEventCount(a);
        case 'least_events':
          return getEventCount(a) - getEventCount(b);
        default:
          return 0;
      }
    });

    setFilteredSessions(result);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'most_events', label: 'Most events' },
    { value: 'least_events', label: 'Least events' },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  const formatUrl = (url) => {
    if (!url) return '—';
    try {
      const u = new URL(url);
      return u.hostname + u.pathname;
    } catch {
      return url.length > 50 ? url.slice(0, 50) + '…' : url;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 text-muted-foreground">
        <div className="h-11 w-11 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <p>Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6 md:px-12 md:pt-10 md:pb-8">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight md:text-3xl text-foreground">
            Sessions
          </h1>
          <p className="text-[15px] text-muted-foreground">
            {sessions.length} recorded session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className={`relative flex flex-col items-stretch gap-4 px-6 pb-6 sm:flex-row md:px-12 md:pb-8 ${dropdownOpen ? 'z-30' : 'z-10'}`}>
        <div className="relative max-w-[400px] flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 z-10 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted-foreground" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by session ID, visitor, location or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="relative w-full rounded-xl border border-border bg-card py-3.5 pl-12 pr-5 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="relative flex min-w-0 sm:min-w-[200px]" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-card py-3.5 pl-4 pr-10 text-left text-sm text-foreground transition-all duration-150 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 shrink-0 text-muted-foreground">
              <path d="M7 16V4m0 0L3 8m4-4l4 4m8 0V20m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span className="min-w-0 truncate">
              {sortOptions.find((o) => o.value === sortBy)?.label ?? 'Sort'}
            </span>
            <span className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted-foreground transition-transform duration-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${dropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-xl">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.value);
                    setDropdownOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    sortBy === opt.value
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="relative z-10 px-6 md:px-12">
          <div className="inset-shadow-2xs ring-background relative overflow-hidden rounded-2xl border border-border bg-card px-12 py-20 text-center shadow-lg shadow-zinc-950/15 ring-1">
            {sessions.length === 0 ? (
              <>
                <svg className="relative z-10 mx-auto mb-6 h-[72px] w-[72px] text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="relative z-10 mb-2.5 text-xl font-semibold text-foreground">No sessions recorded</h3>
                <p className="relative z-10 mx-auto mb-7 max-w-[320px] text-[15px] text-muted-foreground">
                  Install the recorder script on your website to start capturing user sessions.
                </p>
                <Link
                  to="/setup"
                  className="relative z-10 inline-flex items-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Get setup instructions
                </Link>
              </>
            ) : (
              <>
                <svg className="relative z-10 mx-auto mb-6 h-[72px] w-[72px] text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <h3 className="relative z-10 mb-2.5 text-xl font-semibold text-foreground">No matching sessions</h3>
                <p className="relative z-10 mx-auto mb-7 text-[15px] text-muted-foreground">Try adjusting your search or filters.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="relative z-10 inline-flex items-center rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
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
              className="inset-shadow-2xs ring-background group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-zinc-950/15 ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/20"
            >
              <div className="relative flex h-[180px] items-center justify-center overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9B99FE]/10 to-[#2BC8B7]/10" />
                <div className="relative z-10">
                  <svg className="h-16 w-16 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <code className="text-[11px]">{session.sessionId?.slice(-12) || 'N/A'}</code>
                  <span className="text-xs font-medium text-muted-foreground">
                    {session.eventsLength ?? session.eventCount ?? session.events?.length ?? 0} events
                  </span>
                </div>
                <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(session.createdAt)}</span>
                </div>

                {session.url && (
                  <div className="mb-4 flex items-start gap-2 text-[13px] text-foreground/60">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span className="truncate" title={session.url}>
                      {formatUrl(session.url)}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-foreground/70">
                    <svg className="h-4 w-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>
                      {session.visitor?.fingerprint?.slice(-8) ||
                        session.visitor?.fp?.slice(-8) ||
                        'Anonymous'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-foreground/70">
                    <svg className="h-4 w-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{formatLocation(session.visitor)}</span>
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
