import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navBase =
    'flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-white/40 font-medium text-sm transition-all duration-150 relative';
  const navActive =
    'bg-[rgba(16,185,129,0.1)] text-emerald-400 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-6 before:bg-emerald-400 before:rounded-r before:shadow-[0_0_10px_rgba(16,185,129,0.4)]';

  return (
    <div className="flex min-h-screen">
      <aside
        className="fixed inset-y-0 left-0 z-[100] hidden w-[280px] flex-col border-r border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] bg-[length:16px_16px] bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] backdrop-blur-[40px] md:flex"
        style={{ WebkitBackdropFilter: 'blur(40px)' }}
      >
        <div className="border-b border-dashed border-white/10 px-6 py-7">
          <div className="flex items-center gap-3.5 text-xl font-bold tracking-tight text-white">
            <div className='bg-[#0DAF7B] p-2 rounded-xl shadow-[0_0_25px_rgba(13,175,123,0.8),0_0_50px_rgba(13,175,123,0.4)]'>
              <img
                className="h-6 w-6 object-contain brightness-0 invert"
                src="/logo2.svg"
                alt=""
                />
            </div>
            <span>
              Session<span className="text-[#0DAF7B]">Story</span>
            </span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-4 py-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [navBase, isActive ? navActive : 'hover:bg-white/[0.06] hover:text-white/70 hover:[&_svg]:opacity-100'].join(' ')
            }
          >
            <svg className="h-5 w-5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/sessions"
            className={({ isActive }) =>
              [navBase, isActive ? navActive : 'hover:bg-white/[0.06] hover:text-white/70 hover:[&_svg]:opacity-100'].join(' ')
            }
          >
            <svg className="h-5 w-5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sessions</span>
          </NavLink>

          <NavLink
            to="/setup"
            className={({ isActive }) =>
              [navBase, isActive ? navActive : 'hover:bg-white/[0.06] hover:text-white/70 hover:[&_svg]:opacity-100'].join(' ')
            }
          >
            <svg className="h-5 w-5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Setup</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3.5 border-t border-dashed border-white/10 p-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-base font-semibold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-white">
                {user?.name || 'User'}
              </span>
              <span className="truncate text-xs text-white/40">{user?.email || ''}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] text-white/40 transition-all duration-150 hover:border-red-500/30 hover:bg-red-500/10 hover:border-solid hover:text-red-300"
            title="Sign out"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="relative min-h-screen flex-1 pl-0 md:pl-[280px]">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-[300px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(16,185,129,0.4) 0%, transparent 70%)',
          }}
        />
        <Outlet />
      </main>
    </div>
  );
}
