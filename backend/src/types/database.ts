export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Profile = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: string;
};

export type Genre = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accent: string | null;
  created_at: string;
};

export type AudioItem = {
  id: string;
  type: 'audiobook' | 'podcast';
  title: string;
  author: string;
  description: string;
  cover_url: string;
  audio_url: string;
  local_file_name: string | null;
  genre_id: string | null;
  duration_seconds: number;
  plays_count: number;
  is_featured: boolean;
  created_at: string;
  genres?: Genre | null;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Profile>;
      };
      genres: {
        Row: Genre;
        Insert: Omit<Genre, 'created_at'> & { created_at?: string };
        Update: Partial<Genre>;
      };
      audio_items: {
        Row: AudioItem;
        Insert: Omit<AudioItem, 'created_at' | 'plays_count'> & {
          created_at?: string;
          plays_count?: number;
        };
        Update: Partial<AudioItem>;
      };
      listening_history: {
        Row: {
          id: string;
          user_id: string;
          audio_item_id: string;
          progress_seconds: number;
          completed: boolean;
          updated_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          audio_item_id: string;
          progress_seconds?: number;
          completed?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['listening_history']['Row']>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          audio_item_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          audio_item_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Row']>;
      };
      playlists: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['playlists']['Row']>;
      };
      playlist_items: {
        Row: {
          id: string;
          playlist_id: string;
          audio_item_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id: string;
          playlist_id: string;
          audio_item_id: string;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['playlist_items']['Row']>;
      };
    };
  };
};
