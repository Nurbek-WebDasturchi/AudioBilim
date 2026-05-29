import { nanoid } from 'nanoid';
import { supabase } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';

export const playlistService = {
  async list(userId: string) {
    const { data, error } = await supabase
      .from('playlists')
      .select('*, playlist_items(*, audio_items(*, genres(*)))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new HttpError(500, 'Unable to load playlists', error.message);
    return data;
  },

  async create(userId: string, input: { title: string; description?: string }) {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        id: nanoid(),
        user_id: userId,
        title: input.title,
        description: input.description ?? null
      })
      .select()
      .single();

    if (error) throw new HttpError(500, 'Unable to create playlist', error.message);
    return data;
  },

  async addItem(playlistId: string, audioItemId: string) {
    const { data, error } = await supabase
      .from('playlist_items')
      .insert({
        id: nanoid(),
        playlist_id: playlistId,
        audio_item_id: audioItemId
      })
      .select()
      .single();

    if (error) throw new HttpError(500, 'Unable to add item to playlist', error.message);
    return data;
  }
};
