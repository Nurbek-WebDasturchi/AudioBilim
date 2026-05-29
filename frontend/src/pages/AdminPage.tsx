import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { RefreshCw, UploadCloud } from 'lucide-react';
import { libraryApi } from '../lib/api';
import { Button } from '../components/ui/Button';

export default function AdminPage() {
  const queryClient = useQueryClient();
  const genres = useQuery({ queryKey: ['genres'], queryFn: libraryApi.getGenres });
  const [form, setForm] = useState({
    type: 'audiobook' as 'audiobook' | 'podcast',
    title: '',
    author: '',
    description: '',
    coverUrl: '',
    audioUrl: '',
    genreId: '',
    durationSeconds: 0,
    isFeatured: false
  });

  const createMutation = useMutation({
    mutationFn: libraryApi.createAudio,
    onSuccess: () => {
      toast.success('Audio item added');
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
    onError: () => toast.error('Could not add audio item')
  });

  const syncMutation = useMutation({
    mutationFn: libraryApi.syncLocal,
    onSuccess: (result) => {
      toast.success(`${result.inserted} new local files imported`);
      queryClient.invalidateQueries({ queryKey: ['home'] });
    },
    onError: () => toast.error('Local scan failed')
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    createMutation.mutate({
      ...form,
      genreId: form.genreId || null,
      durationSeconds: Number(form.durationSeconds)
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-line bg-panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Admin</p>
        <h1 className="mt-2 text-4xl font-bold">Upload studio</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
            <RefreshCw className="h-4 w-4" />
            Scan local audiobooks
          </Button>
        </div>
      </section>

      <form onSubmit={submit} className="grid gap-5 rounded-lg border border-line bg-panel p-6 lg:grid-cols-2">
        <label className="text-sm font-medium text-white/70">
          Type
          <select className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as 'audiobook' | 'podcast' })}>
            <option value="audiobook">Audiobook</option>
            <option value="podcast">Podcast</option>
          </select>
        </label>
        <label className="text-sm font-medium text-white/70">
          Genre
          <select className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.genreId} onChange={(event) => setForm({ ...form, genreId: event.target.value })}>
            <option value="">No genre</option>
            {genres.data?.map((genre) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-white/70">
          Title
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </label>
        <label className="text-sm font-medium text-white/70">
          Author
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required />
        </label>
        <label className="text-sm font-medium text-white/70 lg:col-span-2">
          Description
          <textarea className="focus-ring mt-2 min-h-32 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
        </label>
        <label className="text-sm font-medium text-white/70">
          Cover URL
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.coverUrl} onChange={(event) => setForm({ ...form, coverUrl: event.target.value })} placeholder="https://..." type="url" required />
        </label>
        <label className="text-sm font-medium text-white/70">
          Audio URL
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.audioUrl} onChange={(event) => setForm({ ...form, audioUrl: event.target.value })} placeholder="https://..." type="url" required />
        </label>
        <label className="text-sm font-medium text-white/70">
          Duration seconds
          <input className="focus-ring mt-2 w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white" value={form.durationSeconds} onChange={(event) => setForm({ ...form, durationSeconds: Number(event.target.value) })} type="number" min={0} required />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-white/70">
          <input type="checkbox" checked={form.isFeatured} onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })} className="h-4 w-4 accent-brand" />
          Featured
        </label>
        <div className="lg:col-span-2">
          <Button disabled={createMutation.isPending}>
            <UploadCloud className="h-4 w-4" />
            {createMutation.isPending ? 'Saving...' : 'Add audio'}
          </Button>
        </div>
      </form>
    </div>
  );
}
