import type { RequestHandler } from 'express';
import { favoriteService } from '../services/favoriteService.js';

export const listFavorites: RequestHandler = async (req, res) => {
  const favorites = await favoriteService.list(req.user!.id);
  res.json({ favorites });
};

export const addFavorite: RequestHandler = async (req, res) => {
  const favorite = await favoriteService.add(req.user!.id, req.params.audioItemId);
  res.status(201).json({ favorite });
};

export const removeFavorite: RequestHandler = async (req, res) => {
  await favoriteService.remove(req.user!.id, req.params.audioItemId);
  res.status(204).send();
};
