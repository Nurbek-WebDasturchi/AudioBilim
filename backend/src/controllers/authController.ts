import type { RequestHandler } from 'express';
import { authService } from '../services/authService.js';

export const register: RequestHandler = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
};

export const login: RequestHandler = async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
};

export const me: RequestHandler = async (req, res) => {
  res.json({ user: req.user });
};
