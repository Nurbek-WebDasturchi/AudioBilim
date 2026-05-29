import type { Profile } from './database.js';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<Profile, 'id' | 'email' | 'name' | 'role'>;
    }
  }
}

export {};
