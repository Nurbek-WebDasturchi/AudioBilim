import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Heart, Play, Plus, Radio } from 'lucide-react';
import { libraryApi } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { usePlayerStore } from '../store/playerStore';
import { formatDuration } from '../lib/format';
import { useSettingsStore } from '../store/settingsStore';
import { getGenreText, getTranslator } from '../lib/i18n';

export default function DetailsPage() {
  const { id } = useParams();
  const play = usePlayerStore((state) => state.play);
  const { data: item, isLoading } = useQuery({
    queryKey: ['audio', id],
    queryFn: () => libraryApi.getAudio(id!),
    enabled: Boolean(id)
  });
  const language = useSettingsStore((state) => state.language);
  const t = getTranslator(language);

  if (isLoading) return <Skeleton className="h-[560px] w-full" />;
  if (!item) return <div className="text-white">{t('notFound')}</div>;

  const genre = getGenreText(item.genres?.slug, language, item.genres?.name);

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <img src={item.cover_url} alt={item.title} className="aspect-square w-full rounded-lg object-cover shadow-card" />
      </div>
      <section className="py-2">
        <Link to={`/search?genre=${item.genres?.slug ?? ''}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <Radio className="h-4 w-4" />
          {genre.name || item.type}
        </Link>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">{item.title}</h1>
        <p className="mt-3 text-lg text-white/62">{item.author}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/55">
          <span>{formatDuration(item.duration_seconds)}</span>
          <span>{item.plays_count.toLocaleString()} {t('plays')}</span>
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => play(item)}>
            <Play className="h-4 w-4 fill-current" />
            {t('playNow')}
          </Button>
          <Button variant="secondary">
            <Heart className="h-4 w-4" />
            {t('favorite')}
          </Button>
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            {t('playlist')}
          </Button>
        </div>
        <div className="mt-10 rounded-lg border border-line bg-panel p-6">
          <h2 className="text-xl font-bold">{t('aboutAudio')}</h2>
          <p className="mt-4 leading-8 text-white/68">{item.description}</p>
        </div>
      </section>
    </div>
  );
}
