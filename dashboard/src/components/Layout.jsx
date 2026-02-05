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
    'flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-muted-foreground font-medium text-sm transition-all duration-150 relative';
  const navActive =
    'bg-secondary text-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-6 before:bg-foreground before:rounded-r';

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="fixed inset-y-0 left-0 z-[100] hidden w-[280px] flex-col border-r border-border bg-card backdrop-blur-xl md:flex"
      >
        <div className="border-b border-border px-6 py-7">
          <div className="flex items-center gap-3.5 text-xl font-bold tracking-tight text-foreground">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7]">
              <img
                className="h-6 w-6 object-contain brightness-0 invert"
                src="/logo2.svg"
                alt=""
              />
            </div>
            <span>SessionStory</span>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-4 py-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [navBase, isActive ? navActive : 'hover:bg-secondary hover:text-foreground hover:[&_svg]:opacity-100'].join(' ')
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
              [navBase, isActive ? navActive : 'hover:bg-secondary hover:text-foreground hover:[&_svg]:opacity-100'].join(' ')
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
              [navBase, isActive ? navActive : 'hover:bg-secondary hover:text-foreground hover:[&_svg]:opacity-100'].join(' ')
            }
          >
            <svg className="h-5 w-5 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span>Setup</span>
          </NavLink>
        </nav>

        <div className="flex items-center gap-3.5 border-t border-border p-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7] text-base font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">
                {user?.name || 'User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">{user?.email || ''}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-all duration-150 hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
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
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
