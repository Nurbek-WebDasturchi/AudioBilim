import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { getTranslator } from '../lib/i18n';
import { Button } from '../components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const language = useSettingsStore((state) => state.language);
  const t = getTranslator(language);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const session = await authApi.register({ name, email, password });
      setSession(session.user, session.token);
      toast.success(t('createAccount'));
      navigate('/');
    } catch {
      toast.error(t('notFound'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-md place-items-center py-12">
      <form onSubmit={submit} className="w-full rounded-lg border border-line bg-panel p-6 shadow-card">
        <h1 className="text-3xl font-bold">{t('createAccount')}</h1>
        <p className="mt-2 text-sm text-white/55">{t('archive')}</p>
        <label className="mt-6 block text-sm font-medium text-white/70">
          {t('name')}
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="mt-4 block text-sm font-medium text-white/70">
          {t('email')}
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label className="mt-4 block text-sm font-medium text-white/70">
          {t('password')}
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required />
        </label>
        <Button className="mt-6 w-full" disabled={loading}>
          {loading ? t('creating') : t('createAccount')}
        </Button>
        <p className="mt-5 text-center text-sm text-white/55">
          {t('alreadyHave')} <Link className="font-semibold text-brand" to="/login">{t('login')}</Link>
        </p>
      </form>
    </div>
  );
}
