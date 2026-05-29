import { Router } from 'express';
import { z } from 'zod';
import {
  createAudio,
  getAudio,
  listAudiobooks,
  listPodcasts,
  searchAudio,
  syncLocalAudiobooks
} from '../controllers/audioController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

const audioSchema = z.object({
  type: z.enum(['audiobook', 'podcast']),
  title: z.string().min(2),
  author: z.string().min(2),
  description: z.string().min(10),
  coverUrl: z.string().url(),
  audioUrl: z.string().url(),
  genreId: z.string().nullable().optional(),
  durationSeconds: z.number().int().min(0),
  isFeatured: z.boolean().optional()
});

router.get('/search', searchAudio);
router.get('/audiobooks', listAudiobooks);
router.get('/podcasts', listPodcasts);
router.get('/audio/:id', getAudio);
router.post('/audio', requireAuth, requireAdmin, validateBody(audioSchema), createAudio);
router.post('/audio/sync-local', requireAuth, requireAdmin, syncLocalAudiobooks);

export default router;
