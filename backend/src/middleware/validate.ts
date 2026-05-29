import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';
import { HttpError } from '../utils/httpError.js';

export const validateBody = (schema: ZodSchema): RequestHandler => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new HttpError(422, 'Validation failed', result.error.flatten());
  }

  req.body = result.data;
  next();
};
