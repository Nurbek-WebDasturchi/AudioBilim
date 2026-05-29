import { nanoid } from 'nanoid';
import { supabase } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';

export const favoriteService = {
  async list(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*, audio_items(*, genres(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new HttpError(500, 'Unable to load favorites', error.message);
    return data;
  },

  async add(userId: string, audioItemId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .upsert({ id: nanoid(), user_id: userId, audio_item_id: audioItemId }, { onConflict: 'user_id,audio_item_id' })
      .select()
      .single();

    if (error) throw new HttpError(500, 'Unable to save favorite', error.message);
    return data;
  },

  async remove(userId: string, audioItemId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('audio_item_id', audioItemId);

    if (error) throw new HttpError(500, 'Unable to remove favorite', error.message);
  }
};
