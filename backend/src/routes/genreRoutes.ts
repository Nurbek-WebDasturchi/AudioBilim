import { Router } from 'express';
import { listGenres } from '../controllers/genreController.js';

const router = Router();

router.get('/genres', listGenres);

export default router;
