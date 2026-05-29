import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const audiobookFolder = path.resolve(__dirname, '../../audiobooks');

const supportedExtensions = new Set(['.mp3', '.wav']);

export async function scanAudiobookFolder() {
  await fs.mkdir(audiobookFolder, { recursive: true });
  const entries = await fs.readdir(audiobookFolder, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => ({
      fileName: entry.name,
      absolutePath: path.join(audiobookFolder, entry.name)
    }));
}
