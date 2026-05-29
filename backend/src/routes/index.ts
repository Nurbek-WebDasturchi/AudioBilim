import { Router } from 'express';
import authRoutes from './authRoutes.js';
import audioRoutes from './audioRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import genreRoutes from './genreRoutes.js';
import playlistRoutes from './playlistRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'audio-library-api' });
});

router.use('/auth', authRoutes);
router.use(audioRoutes);
router.use(genreRoutes);
router.use(favoriteRoutes);
router.use(playlistRoutes);

export default router;
