import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createApp = () => {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()),
      credentials: true
    })
  );
  app.use(apiLimiter);
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.use('/audiobooks', express.static(path.resolve(__dirname, '../audiobooks'), {
    acceptRanges: true,
    immutable: false,
    maxAge: '1h'
  }));
  app.use('/covers', express.static(path.resolve(__dirname, '../public/covers'), {
    immutable: true,
    maxAge: '30d'
  }));

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};
