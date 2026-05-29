import type { RequestHandler } from 'express';
import { genreService } from '../services/genreService.js';

export const listGenres: RequestHandler = async (_req, res) => {
  const genres = await genreService.list();
  res.json({ genres });
};
