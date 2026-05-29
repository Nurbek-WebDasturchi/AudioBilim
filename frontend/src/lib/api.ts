import axios from 'axios';
import type { AudioItem, Genre, User } from '../types/audio';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const libraryApi = {
  async getHome() {
    const [featured, podcasts, recent, genres] = await Promise.all([
      api.get<{ items: AudioItem[] }>('/audiobooks?featured=true'),
      api.get<{ items: AudioItem[] }>('/podcasts'),
      api.get<{ items: AudioItem[] }>('/audiobooks'),
      api.get<{ genres: Genre[] }>('/genres')
    ]);

    return {
      featured: featured.data.items,
      podcasts: podcasts.data.items,
      recent: recent.data.items,
      genres: genres.data.genres
    };
  },
  async search(query: string, genre?: string) {
    const { data } = await api.get<{ items: AudioItem[] }>('/search', {
      params: { q: query, genre }
    });
    return data.items;
  },
  async getAudio(id: string) {
    const { data } = await api.get<{ item: AudioItem }>(`/audio/${id}`);
    return data.item;
  },
  async getGenres() {
    const { data } = await api.get<{ genres: Genre[] }>('/genres');
    return data.genres;
  },
  async createAudio(payload: {
    type: 'audiobook' | 'podcast';
    title: string;
    author: string;
    description: string;
    coverUrl: string;
    audioUrl: string;
    genreId?: string | null;
    durationSeconds: number;
    isFeatured?: boolean;
  }) {
    const { data } = await api.post<{ item: AudioItem }>('/audio', payload);
    return data.item;
  },
  async syncLocal() {
    const { data } = await api.post<{ scanned: number; inserted: number; updated: number }>('/audio/sync-local');
    return data;
  }
};

export const authApi = {
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post<{ user: User; token: string }>('/auth/login', payload);
    return data;
  },
  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await api.post<{ user: User; token: string }>('/auth/register', payload);
    return data;
  }
};
