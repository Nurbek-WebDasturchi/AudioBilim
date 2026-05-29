import { Router } from 'express';
import { z } from 'zod';
import { addPlaylistItem, createPlaylist, listPlaylists } from '../controllers/playlistController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.get('/playlists', requireAuth, listPlaylists);
router.post(
  '/playlists',
  requireAuth,
  validateBody(
    z.object({
      title: z.string().min(2).max(80),
      description: z.string().max(240).optional()
    })
  ),
  createPlaylist
);
router.post(
  '/playlists/:playlistId/items',
  requireAuth,
  validateBody(z.object({ audioItemId: z.string().min(1) })),
  addPlaylistItem
);

export default router;
