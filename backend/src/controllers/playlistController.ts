import type { RequestHandler } from 'express';
import { playlistService } from '../services/playlistService.js';

export const listPlaylists: RequestHandler = async (req, res) => {
  const playlists = await playlistService.list(req.user!.id);
  res.json({ playlists });
};

export const createPlaylist: RequestHandler = async (req, res) => {
  const playlist = await playlistService.create(req.user!.id, req.body);
  res.status(201).json({ playlist });
};

export const addPlaylistItem: RequestHandler = async (req, res) => {
  const item = await playlistService.addItem(req.params.playlistId, req.body.audioItemId);
  res.status(201).json({ item });
};
