import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { formatDuration } from '../../lib/format';

export function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { current, isOpen, close, next, previous } = usePlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);

  useEffect(() => {
    if (!audioRef.current || !current) return;
    audioRef.current.volume = volume;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [current, volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <AnimatePresence>
      {current && isOpen && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/92 px-4 py-3 backdrop-blur-2xl"
        >
          <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-[minmax(0,1fr)_minmax(260px,520px)_minmax(0,1fr)] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <img src={current.cover_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{current.title}</p>
                <p className="truncate text-xs text-white/50">{current.author}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-3">
                <button className="focus-ring grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/8 hover:text-white" onClick={previous} aria-label="Previous">
                  <SkipBack className="h-4 w-4" />
                </button>
                <button className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white text-ink hover:bg-brand" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
                </button>
                <button className="focus-ring grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/8 hover:text-white" onClick={next} aria-label="Next">
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 grid grid-cols-[44px_1fr_44px] items-center gap-2 text-xs text-white/45">
                <span>{formatDuration(currentTime)}</span>
                <input
                  aria-label="Seek"
                  type="range"
                  min={0}
                  max={duration || current.duration_seconds || 0}
                  value={currentTime}
                  onChange={(event) => {
                    const nextTime = Number(event.target.value);
                    setCurrentTime(nextTime);
                    if (audioRef.current) audioRef.current.currentTime = nextTime;
                  }}
                  className="h-1 accent-brand"
                />
                <span className="text-right">{formatDuration(duration || current.duration_seconds)}</span>
              </div>
            </div>
            <div className="hidden items-center justify-end gap-3 md:flex">
              <Volume2 className="h-4 w-4 text-white/55" />
              <input
                aria-label="Volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value);
                  setVolume(nextVolume);
                  if (audioRef.current) audioRef.current.volume = nextVolume;
                }}
                className="w-24 accent-brand"
              />
              <button className="focus-ring grid h-9 w-9 place-items-center rounded-full text-white/55 hover:bg-white/8 hover:text-white" onClick={close} aria-label="Close player">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <audio
            ref={audioRef}
            src={current.audio_url}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onEnded={next}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
