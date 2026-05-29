import type { AudioItem } from '../../types/audio';
import { AudioCard } from '../cards/AudioCard';
import { EmptyState } from '../ui/EmptyState';

export function AudioShelf({ title, eyebrow, items }: { title: string; eyebrow?: string; items: AudioItem[] }) {
  return (
    <section className="py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{eyebrow}</p>}
          <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
        </div>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {items.slice(0, 10).map((item) => (
            <AudioCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="No audio yet" description="Add audio from the admin dashboard or drop MP3/WAV files into backend/audiobooks." />
      )}
    </section>
  );
}
