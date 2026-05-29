import path from 'node:path';
import { nanoid } from 'nanoid';
import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { scanAudiobookFolder } from '../utils/audioScanner.js';
import { HttpError } from '../utils/httpError.js';

export const audioService = {
  async list(options: {
    type?: 'audiobook' | 'podcast';
    genre?: string;
    q?: string;
    featured?: boolean;
    limit?: number;
  }) {
    let query = supabase
      .from('audio_items')
      .select('*, genres(*)')
      .order('created_at', { ascending: false })
      .limit(options.limit ?? 24);

    if (options.type) query = query.eq('type', options.type);
    if (options.featured) query = query.eq('is_featured', true);
    if (options.q) {
      query = query.or(
        `title.ilike.%${options.q}%,author.ilike.%${options.q}%,description.ilike.%${options.q}%`
      );
    }
    if (options.genre) {
      const { data: genre } = await supabase
        .from('genres')
        .select('id')
        .eq('slug', options.genre)
        .maybeSingle();
      if (!genre) return [];
      query = query.eq('genre_id', genre.id);
    }

    const { data, error } = await query;
    if (error) throw new HttpError(500, 'Unable to load audio library', error.message);
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('audio_items')
      .select('*, genres(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new HttpError(404, 'Audio item not found');
    return data;
  },

  async create(input: {
    type: 'audiobook' | 'podcast';
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    audioUrl: string;
    genreId?: string | null;
    durationSeconds: number;
    isFeatured?: boolean;
  }) {
    const { data, error } = await supabase
      .from('audio_items')
      .insert({
        id: nanoid(),
        type: input.type,
        title: input.title,
        author: input.author,
        description: input.description,
        cover_url: input.coverUrl,
        audio_url: input.audioUrl,
        local_file_name: null,
        genre_id: input.genreId ?? null,
        duration_seconds: input.durationSeconds,
        is_featured: input.isFeatured ?? false
      })
      .select('*, genres(*)')
      .single();

    if (error) throw new HttpError(500, 'Unable to create audio item', error.message);
    return data;
  },

  async syncLocalAudiobooks() {
    const files = await scanAudiobookFolder();
    const inserted = [];

    for (const file of files) {
      const { data: existing } = await supabase
        .from('audio_items')
        .select('id')
        .eq('local_file_name', file.fileName)
        .maybeSingle();

      if (existing) continue;

      const title = path.basename(file.fileName, path.extname(file.fileName)).replace(/[-_]+/g, ' ');
      const { data, error } = await supabase
        .from('audio_items')
        .insert({
          id: nanoid(),
          type: 'audiobook',
          title,
          author: 'Unknown author',
          description: 'Imported automatically from the local audiobook folder.',
          cover_url: `${env.PUBLIC_API_URL}/covers/default-cover.svg`,
          audio_url: `${env.PUBLIC_API_URL}/audiobooks/${encodeURIComponent(file.fileName)}`,
          local_file_name: file.fileName,
          genre_id: null,
          duration_seconds: 0,
          is_featured: false
        })
        .select()
        .single();

      if (error) throw new HttpError(500, 'Unable to sync local audiobook', error.message);
      inserted.push(data);
    }

    return { scanned: files.length, inserted: inserted.length };
  }
};
