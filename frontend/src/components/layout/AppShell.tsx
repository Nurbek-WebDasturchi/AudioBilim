import { Link, NavLink, Outlet } from 'react-router-dom';
import { Headphones, LogOut, Search, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { MiniPlayer } from '../player/MiniPlayer';
import { Button } from '../ui/Button';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white text-ink' : 'text-white/65 hover:bg-white/8 hover:text-white'}`;

export function AppShell() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen pb-32 text-white">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight">Audio Library</p>
              <p className="text-xs text-white/45">Streaming archive</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
            <NavLink to="/search" className={navClass}>
              Search
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navClass}>
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/search" className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-white/5 md:hidden" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
            {user ? (
              <>
                <span className="hidden max-w-36 truncate text-sm text-white/70 sm:block">{user.name}</span>
                {user.role === 'admin' && <Shield className="hidden h-4 w-4 text-gold sm:block" />}
                <Button variant="ghost" onClick={logout} aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <MiniPlayer />
    </div>
  );
}
