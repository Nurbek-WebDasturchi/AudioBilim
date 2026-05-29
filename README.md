# Audio Library

Audio Library is a modern fullstack audio streaming platform for audiobooks and podcasts. It includes a premium dark UI, browser audio playback, search, genre browsing, authentication, protected admin tools, Supabase-backed data, and local backend audio streaming from `backend/audiobooks`.

## Features

- React, TypeScript, Vite, TailwindCSS, Framer Motion frontend
- Node.js, Express, TypeScript backend with clean controller/service/route structure
- JWT auth with password hashing, protected routes, admin-only dashboard
- Audiobook and podcast catalog, detail pages, search, genres, featured/trending/recent shelves
- Modern floating audio player with play/pause, seek, volume, next, previous, current time, total duration
- Supabase schema for users, audio items, genres, listening history, favorites, playlists
- Local MP3/WAV folder scanning from `backend/audiobooks`
- Helmet, CORS, rate limiting, environment variables
- Vercel-ready frontend and Render-ready backend

## Tech Stack

Frontend: React, TypeScript, Vite, TailwindCSS, Framer Motion, React Router, Zustand, Axios, TanStack Query.

Backend: Node.js, Express.js, TypeScript, Supabase, JWT, bcrypt, Helmet, CORS, rate limiting.

Database: Supabase PostgreSQL.

## Folder Structure

```txt
audio-library/
  backend/
    audiobooks/
    public/covers/
    src/
      config/
      controllers/
      jobs/
      middleware/
      routes/
      services/
      types/
      utils/
    supabase/schema.sql
    render.yaml
  frontend/
    src/
      components/
      lib/
      pages/
      store/
      types/
    vercel.json
```

## Installation

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill the environment variables before running the apps.

## Environment Variables

Backend `backend/.env`:

```bash
PORT=8080
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PUBLIC_API_URL=http://localhost:8080
```

Frontend `frontend/.env`:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `backend/supabase/schema.sql`.
4. Copy the project URL into `SUPABASE_URL`.
5. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
6. Create an admin user by registering normally, then update the row:

```sql
update public.users set role = 'admin' where email = 'you@example.com';
```

## Local Development

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:8080`.

Run only one side:

```bash
npm run dev:frontend
npm run dev:backend
```

## Local Audiobook Storage

Place audio files in:

```txt
backend/audiobooks/
```

Supported formats:

- `.mp3`
- `.wav`

The backend scans this folder on startup. Admins can also trigger a scan from the admin dashboard or with:

```bash
npm --workspace backend run scan
```

New local files are inserted into Supabase with default metadata and served from:

```txt
http://localhost:8080/audiobooks/file-name.mp3
```

## Scripts

```bash
npm run dev        # frontend and backend together
npm run build      # build backend and frontend
npm run lint       # lint both apps
npm run typecheck  # type-check both apps
```

Backend workspace scripts:

```bash
npm --workspace backend run dev
npm --workspace backend run build
npm --workspace backend run start
npm --workspace backend run scan
```

Frontend workspace scripts:

```bash
npm --workspace frontend run dev
npm --workspace frontend run build
npm --workspace frontend run preview
```

## Render Deployment

1. Push the repository to GitHub.
2. In Render, create a new Web Service.
3. Set root directory to `backend`.
4. Build command: `npm install --include=dev && npm run build`.
5. Start command: `npm start`.
6. Add all backend environment variables.
7. Set `PUBLIC_API_URL` to the Render service URL.
8. Set `CLIENT_ORIGIN` to the Vercel frontend URL.

`backend/render.yaml` is included for blueprint-based deployment.

## Vercel Deployment

1. Import the repository into Vercel.
2. Set root directory to `frontend`.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add `VITE_API_URL=https://your-render-api.onrender.com/api`.

`frontend/vercel.json` includes SPA rewrites for React Router.

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/audiobooks`
- `GET /api/podcasts`
- `GET /api/search?q=term&genre=technology`
- `GET /api/audio/:id`
- `POST /api/audio`
- `POST /api/audio/sync-local`
- `GET /api/genres`
- `GET /api/favorites`
- `POST /api/favorites/:audioItemId`
- `DELETE /api/favorites/:audioItemId`
- `GET /api/playlists`
- `POST /api/playlists`
- `POST /api/playlists/:playlistId/items`

## Production Notes

- Keep `JWT_SECRET` long and private.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.
- Use Supabase RLS policies if you later access Supabase directly from the browser.
- Render disk storage can be ephemeral unless a persistent disk is configured. For durable production uploads, add persistent disk storage or migrate audio storage to object storage later.
