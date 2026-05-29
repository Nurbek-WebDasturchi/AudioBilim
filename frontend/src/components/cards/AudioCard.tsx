import { motion } from 'framer-motion';
import { Play, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AudioItem } from '../../types/audio';
import { formatDuration } from '../../lib/format';
import { getGenreText } from '../../lib/i18n';
import { usePlayerStore } from '../../store/playerStore';
import { useSettingsStore } from '../../store/settingsStore';

export function AudioCard({ item, compact = false }: { item: AudioItem; compact?: boolean }) {
  const play = usePlayerStore((state) => state.play);
  const language = useSettingsStore((state) => state.language);
  const genre = getGenreText(item.genres?.slug, language, item.genres?.name);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-lg border border-line bg-panelSoft shadow-card"
    >
      <Link to={`/audio/${item.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-white/5">
          <img src={item.cover_url} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          <button
            type="button"
            aria-label={`Play ${item.title}`}
            onClick={(event) => {
              event.preventDefault();
              play(item);
            }}
            className="focus-ring absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-glow transition hover:bg-brand"
          >
            <Play className="h-5 w-5 fill-current" />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-white/50">
          <span>{genre.name || item.type}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {formatDuration(item.duration_seconds)}
          </span>
        </div>
        <Link to={`/audio/${item.id}`} className="line-clamp-2 font-semibold text-white hover:text-brand">
          {item.title}
        </Link>
        {!compact && <p className="mt-1 line-clamp-1 text-sm text-white/55">{item.author}</p>}
      </div>
    </motion.article>
  );
}
