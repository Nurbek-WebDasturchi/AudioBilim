import type { RequestHandler } from 'express';
import { audioService } from '../services/audioService.js';

export const listAudiobooks: RequestHandler = async (req, res) => {
  const items = await audioService.list({
    type: 'audiobook',
    genre: req.query.genre?.toString(),
    q: req.query.q?.toString(),
    featured: req.query.featured === 'true'
  });
  res.json({ items });
};

export const listPodcasts: RequestHandler = async (req, res) => {
  const items = await audioService.list({
    type: 'podcast',
    genre: req.query.genre?.toString(),
    q: req.query.q?.toString(),
    featured: req.query.featured === 'true'
  });
  res.json({ items });
};

export const getAudio: RequestHandler = async (req, res) => {
  const item = await audioService.getById(req.params.id);
  res.json({ item });
};

export const createAudio: RequestHandler = async (req, res) => {
  const item = await audioService.create(req.body);
  res.status(201).json({ item });
};

export const searchAudio: RequestHandler = async (req, res) => {
  const items = await audioService.list({
    q: req.query.q?.toString(),
    genre: req.query.genre?.toString(),
    limit: 40
  });
  res.json({ items });
};

export const syncLocalAudiobooks: RequestHandler = async (_req, res) => {
  const result = await audioService.syncLocalAudiobooks();
  res.json(result);
};
