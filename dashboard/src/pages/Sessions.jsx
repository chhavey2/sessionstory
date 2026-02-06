import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import BentoGrid from '../components/BentoGrid';
import Loader from '../components/Loader';

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
    return <Loader message="Loading sessions..." />;
  }

  const sessionItems = filteredSessions.map((s) => {
    const sessionId = s.sessionId?.slice(-12) || 'N/A';
    const events = s.eventsLength ?? s.eventCount ?? s.events?.length ?? 0;
    const createdAt = s.createdAt ? new Date(s.createdAt) : null;
    const meta = createdAt
      ? createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    const city = s.visitor?.city || s.visitor?.region;
    const country = s.visitor?.country;
    const location = city && country ? `${city}, ${country}` : city || country || 'Unknown';

    const urlText = s.url ? formatUrl(s.url) : '—';

    const visitor =
      s.visitor?.fingerprint?.slice(-8) || s.visitor?.fp?.slice(-8) || 'Anonymous';

    const tags = [];
    tags.push(`${events} events`);
    if (country) tags.push(country);
    if (city) tags.push(city);

    return {
      id: s._id || s.sessionId,
      title: `Session • ${sessionId}`,
      meta,
      content: (
        <div className="flex flex-col gap-2 text-sm text-foreground/70">
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
            <span className="truncate">{urlText}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span>{visitor}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            <span>{events} events</span>
          </div>
        </div>
      ),
      icon: (
        <svg className="h-4 w-4 text-foreground/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      status: 'Watch',
      tags: tags.slice(0, 3),
      cta: 'Watch →',
      href: `${PLAYER_URL}/${s.sessionId}`,
    };
  });

  return (
    <div className="pb-24">
      <div className="relative z-10 w-full lg:w-[78%] mx-auto px-6">
        <PageHeader
          kicker="Replays"
          title="Sessions"
          description="Search, sort, and open any recording. Use this view to reproduce bugs and understand user journeys."
        />

        <div className={`relative flex flex-col items-stretch gap-3 pb-5 sm:flex-row ${dropdownOpen ? 'z-30' : 'z-10'}`}>
          <div className="relative flex-1">
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
            className="relative w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground transition-all duration-150 placeholder:text-muted-foreground/50 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="relative flex min-w-0 sm:min-w-[200px]" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex w-full items-center gap-2 rounded-xl border border-border bg-card py-3 pl-4 pr-10 text-left text-sm text-foreground transition-all duration-150 hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/20"
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
          <div className="mx-auto w-[30%] min-w-[220px] max-w-[280px] rounded-xl border border-border bg-card/55 px-4 py-5 text-center shadow-lg shadow-zinc-950/10 backdrop-blur-xl">
            {sessions.length === 0 ? (
              <>
                <svg className="mx-auto mb-3 h-9 w-9 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">No sessions recorded</h3>
                <p className="mb-3 text-[12px] leading-snug text-muted-foreground">
                  Install the recorder to start capturing.
                </p>
                <Link
                  to="/setup"
                  className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get setup
                </Link>
              </>
            ) : (
              <>
                <svg className="mx-auto mb-3 h-9 w-9 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">No matching sessions</h3>
                <p className="mb-3 text-[12px] text-muted-foreground">Adjust search or filters.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Clear search
                </button>
              </>
            )}
          </div>
        ) : (
          <BentoGrid items={sessionItems} className="mt-2 md:grid-cols-2 gap-4" />
        )}
      </div>
    </div>
  );
}
