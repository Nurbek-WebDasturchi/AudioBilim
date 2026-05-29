import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { libraryApi } from '../lib/api';
import { AudioShelf } from '../components/sections/AudioShelf';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { usePlayerStore } from '../store/playerStore';
import { useSettingsStore } from '../store/settingsStore';
import { getGenreText, getTranslator } from '../lib/i18n';

export default function HomePage() {
  const { data, isLoading } = useQuery({ queryKey: ['home'], queryFn: libraryApi.getHome });
  const play = usePlayerStore((state) => state.play);
  const language = useSettingsStore((state) => state.language);
  const t = getTranslator(language);
  const heroItem = data?.featured[0] ?? data?.recent[0];
  const byGenre = (slug: string) => (data?.recent ?? []).filter((item) => item.genres?.slug === slug);
  const fiction = byGenre('fiction');
  const history = byGenre('history');
  const education = byGenre('education');
  const motivation = byGenre('motivation');

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[420px] w-full" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden rounded-lg border border-line bg-panel shadow-card">
        <div className="absolute inset-0">
          <img
            src={heroItem?.cover_url ?? 'http://localhost:8080/covers/default-cover.svg'}
            alt=""
            className="h-full w-full object-cover opacity-22"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/35" />
        </div>
        <div className="relative grid gap-8 p-6 md:grid-cols-[1.08fr_0.92fr] md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[360px] flex-col justify-center">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-white/8 px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              {t('curated')}
            </span>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 md:text-lg">
              {t('heroCopy')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {heroItem && (
                <Button onClick={() => play(heroItem)}>
                  <Play className="h-4 w-4 fill-current" />
                  {t('playFeatured')}
                </Button>
              )}
              <Link to="/search">
                <Button variant="secondary">
                  {t('browseCatalog')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <div className="grid content-end gap-4">
            {heroItem && (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-lg p-4">
                <img src={heroItem.cover_url} alt={heroItem.title} className="aspect-square w-full rounded-lg object-cover shadow-card" />
                <div className="mt-4">
                  <p className="text-sm text-brand">{getGenreText(heroItem.genres?.slug, language, heroItem.genres?.name).name}</p>
                  <h2 className="mt-1 text-2xl font-bold">{heroItem.title}</h2>
                  <p className="mt-1 text-sm text-white/55">{heroItem.author}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-8 md:grid-cols-4">
        {data?.genres.slice(0, 8).map((genre) => (
          <Link key={genre.id} to={`/search?genre=${genre.slug}`} className="rounded-lg border border-line bg-white/[0.04] p-5 transition hover:border-brand/50 hover:bg-white/[0.07]">
            <p className="text-lg font-semibold text-white">{getGenreText(genre.slug, language, genre.name).name}</p>
            <p className="mt-2 line-clamp-2 text-sm text-white/55">{getGenreText(genre.slug, language, genre.name, genre.description).description}</p>
          </Link>
        ))}
      </section>

      <AudioShelf title={t('fictionShelf')} eyebrow={t('fictionEyebrow')} items={fiction} />
      <AudioShelf title={t('historyShelf')} eyebrow={t('historyEyebrow')} items={history} />
      <AudioShelf title={t('educationShelf')} eyebrow={t('educationEyebrow')} items={education} />
      <AudioShelf title={t('motivationShelf')} eyebrow={t('motivationEyebrow')} items={motivation} />
      <AudioShelf title={t('recentShelf')} eyebrow={t('recentEyebrow')} items={data?.recent ?? []} />
    </div>
  );
}
