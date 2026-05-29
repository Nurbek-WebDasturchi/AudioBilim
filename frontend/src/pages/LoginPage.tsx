import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Headphones } from 'lucide-react';
import { authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const session = await authApi.login({ email, password });
      setSession(session.user, session.token);
      toast.success('Welcome back');
      navigate('/');
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-md place-items-center py-12">
      <form onSubmit={submit} className="w-full rounded-lg border border-line bg-panel p-6 shadow-card">
        <Headphones className="mb-5 h-10 w-10 text-brand" />
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-white/55">Continue listening from any device.</p>
        <label className="mt-6 block text-sm font-medium text-white/70">
          Email
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label className="mt-4 block text-sm font-medium text-white/70">
          Password
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required />
        </label>
        <Button className="mt-6 w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
        <p className="mt-5 text-center text-sm text-white/55">
          New here? <Link className="font-semibold text-brand" to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}
