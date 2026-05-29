import { Router } from 'express';
import { addFavorite, listFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/favorites', requireAuth, listFavorites);
router.post('/favorites/:audioItemId', requireAuth, addFavorite);
router.delete('/favorites/:audioItemId', requireAuth, removeFavorite);

export default router;
