create table if not exists public.users (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.genres (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  accent text,
  created_at timestamptz not null default now()
);

create table if not exists public.audio_items (
  id text primary key,
  type text not null check (type in ('audiobook', 'podcast')),
  title text not null,
  author text not null,
  description text not null,
  cover_url text not null,
  audio_url text not null,
  local_file_name text unique,
  genre_id text references public.genres(id) on delete set null,
  duration_seconds integer not null default 0,
  plays_count integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.listening_history (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  audio_item_id text not null references public.audio_items(id) on delete cascade,
  progress_seconds integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, audio_item_id)
);

create table if not exists public.favorites (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  audio_item_id text not null references public.audio_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, audio_item_id)
);

create table if not exists public.playlists (
  id text primary key,
  user_id text not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_items (
  id text primary key,
  playlist_id text not null references public.playlists(id) on delete cascade,
  audio_item_id text not null references public.audio_items(id) on delete cascade,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (playlist_id, audio_item_id)
);

create index if not exists audio_items_type_idx on public.audio_items(type);
create index if not exists audio_items_genre_idx on public.audio_items(genre_id);
create index if not exists audio_items_search_idx on public.audio_items using gin (
  to_tsvector('english', title || ' ' || author || ' ' || description)
);

alter table public.users enable row level security;
alter table public.genres enable row level security;
alter table public.audio_items enable row level security;
alter table public.listening_history enable row level security;
alter table public.favorites enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_items enable row level security;

insert into public.genres (id, name, slug, description, accent)
values
  ('genre_technology', 'Technology', 'technology', 'Engineering, startups, AI, and software culture.', '#7dd3fc'),
  ('genre_fiction', 'Fiction', 'fiction', 'Novels, short stories, and immersive audio drama.', '#fb7185'),
  ('genre_education', 'Education', 'education', 'Structured lessons, explainers, and learning series.', '#34d399'),
  ('genre_history', 'History', 'history', 'People, places, and events that shaped the world.', '#a78bfa'),
  ('genre_motivation', 'Motivation', 'motivation', 'Focus, discipline, and personal growth.', '#f97316')
on conflict (slug) do nothing;
