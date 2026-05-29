export type Genre = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  accent?: string | null;
};

export type AudioItem = {
  id: string;
  type: 'audiobook' | 'podcast';
  title: string;
  author: string;
  description: string;
  cover_url: string;
  audio_url: string;
  local_file_name?: string | null;
  genre_id?: string | null;
  duration_seconds: number;
  plays_count: number;
  is_featured: boolean;
  created_at: string;
  genres?: Genre | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
};
