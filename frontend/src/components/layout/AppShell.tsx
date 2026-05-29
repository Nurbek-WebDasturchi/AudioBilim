import { useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Headphones, Languages, LogOut, Moon, Search, Shield, Sun } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore, type Language } from '../../store/settingsStore';
import { getTranslator } from '../../lib/i18n';
import { MiniPlayer } from '../player/MiniPlayer';
import { Button } from '../ui/Button';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white text-ink' : 'text-white/65 hover:bg-white/8 hover:text-white'}`;

const languages: Array<{ value: Language; label: string }> = [
  { value: 'uz', label: 'UZ' },
  { value: 'ru', label: 'RU' },
  { value: 'en', label: 'EN' }
];

export function AppShell() {
  const { user, logout } = useAuthStore();
  const { language, setLanguage, theme, toggleTheme } = useSettingsStore();
  const t = getTranslator(language);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="min-h-screen pb-32 text-white">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/72 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-ink">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight">AudioBilim</p>
              <p className="text-xs text-white/45">{t('archive')}</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navClass}>
              {t('home')}
            </NavLink>
            <NavLink to="/search" className={navClass}>
              {t('search')}
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navClass}>
                {t('admin')}
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
              title={theme === 'dark' ? t('themeLight') : t('themeDark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <div className="hidden items-center gap-1 rounded-lg border border-line bg-white/5 p-1 text-sm text-white/75 md:flex" aria-label="Language">
              <Languages className="h-4 w-4" />
              {languages.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setLanguage(item.value)}
                  className={`focus-ring h-8 rounded-md px-2 text-xs font-bold transition ${
                    language === item.value
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-white/65 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Link to="/search" className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-white/5 md:hidden" aria-label="Search">
              <Search className="h-4 w-4" />
            </Link>
            {user ? (
              <>
                <span className="hidden max-w-36 truncate text-sm text-white/70 sm:block">{user.name}</span>
                {user.role === 'admin' && <Shield className="hidden h-4 w-4 text-gold sm:block" />}
                <Button variant="ghost" onClick={logout} aria-label={t('logout')}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary">{t('login')}</Button>
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
