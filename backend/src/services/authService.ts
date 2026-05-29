import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import type { Profile } from '../types/database.js';

type PublicProfile = Pick<Profile, 'id' | 'email' | 'name' | 'role'>;

const toPublicProfile = (profile: Profile): PublicProfile => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  role: profile.role
});

const createToken = (profile: PublicProfile) =>
  jwt.sign(
    {
      email: profile.email,
      name: profile.name,
      role: profile.role
    },
    env.JWT_SECRET,
    {
      subject: profile.id,
      expiresIn: '7d'
    }
  );

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const normalizedEmail = input.email.toLowerCase();
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existing) {
      throw new HttpError(409, 'Email is already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: nanoid(),
        email: normalizedEmail,
        name: input.name,
        password_hash: passwordHash,
        role: 'user'
      })
      .select()
      .single();

    if (error) {
      throw new HttpError(500, 'Unable to create user', error.message);
    }

    const user = toPublicProfile(data);
    return { user, token: createToken(user) };
  },

  async login(input: { email: string; password: string }) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', input.email.toLowerCase())
      .maybeSingle();

    if (error || !data) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(input.password, data.password_hash);
    if (!isMatch) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const user = toPublicProfile(data);
    return { user, token: createToken(user) };
  }
};
