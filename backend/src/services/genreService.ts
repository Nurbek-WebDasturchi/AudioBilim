import { supabase } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';

export const genreService = {
  async list() {
    const { data, error } = await supabase.from('genres').select('*').order('name');
    if (error) throw new HttpError(500, 'Unable to load genres', error.message);
    return data;
  }
};
