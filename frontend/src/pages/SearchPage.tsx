import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { libraryApi } from '../lib/api';
import { AudioCard } from '../components/cards/AudioCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { useSettingsStore } from '../store/settingsStore';
import { getGenreText, getTranslator } from '../lib/i18n';

export default function SearchPage() {
  const [params] = useSearchParams();
  const initialGenre = params.get('genre') ?? '';
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(initialGenre);
  const debouncedQuery = useMemo(() => query.trim(), [query]);
  const language = useSettingsStore((state) => state.language);
  const t = getTranslator(language);

  const genres = useQuery({ queryKey: ['genres'], queryFn: libraryApi.getGenres });
  const results = useQuery({
    queryKey: ['search', debouncedQuery, genre],
    queryFn: () => libraryApi.search(debouncedQuery, genre || undefined)
  });

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">{t('search')}</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{t('findListen')}</h1>
        <div className="mt-6 grid gap-3 rounded-lg border border-line bg-panel p-4 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('searchPlaceholder')}
              className="focus-ring w-full rounded-lg border border-line bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-white/35"
            />
          </label>
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="focus-ring rounded-lg border border-line bg-white/5 px-4 py-3 text-white"
          >
            <option value="">{t('allGenres')}</option>
            {genres.data?.map((item) => (
              <option key={item.id} value={item.slug}>
                {getGenreText(item.slug, language, item.name).name}
              </option>
            ))}
          </select>
        </div>
      </section>
      {results.isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4]" />
          ))}
        </div>
      ) : results.data && results.data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {results.data.map((item) => (
            <AudioCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title={t('noMatch')} description={t('tryDifferent')} />
      )}
    </div>
  );
}
