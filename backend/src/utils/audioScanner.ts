import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const audiobookFolder = path.resolve(__dirname, '../../audiobooks');
const titleImageFolder = path.join(audiobookFolder, 'titleImg');

const supportedExtensions = new Set(['.mp3', '.wav']);
const supportedImageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const localMetadata: Record<string, { title: string; author: string; coverFileName?: string }> = {
  'Abdulla Qahhor.mp3': {
    title: 'Binafsha shulasi',
    author: 'Abdulla Qahhor',
    coverFileName: 'Binafsha shulasi.jpg'
  },
  'Alkimyogar.mp3': {
    title: 'Alkimyogar',
    author: 'Paulo Coelho',
    coverFileName: 'Alkimyogar.jpg'
  },
  'Hadiche-Bahor qaytmaydi.mp3': {
    title: 'Bahor qaytmaydi',
    author: "O'tkir Hoshimov",
    coverFileName: 'Bahor qaytmaydi.jpg'
  },
  'Isfandiyor-Qasoskor.mp3': {
    title: 'Qasoskorlar',
    author: 'Isfandiyor',
    coverFileName: 'Isfandiyor-Qasoskorlar.jpg'
  },
  "O'tkir Hoshimov.mp3": {
    title: 'Tushda kechgan umrlar',
    author: "O'tkir Hoshimov",
    coverFileName: 'Tushda kechgan umrlar.jpg'
  }
};

const normalize = (value: string) =>
  path
    .basename(value, path.extname(value))
    .toLowerCase()
    .replace(/['‘’`]/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function getCoverFileName(fileName: string, title: string, explicitCover?: string) {
  await fs.mkdir(titleImageFolder, { recursive: true });
  const images = await fs.readdir(titleImageFolder, { withFileTypes: true });
  const imageNames = images
    .filter((entry) => entry.isFile() && supportedImageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  if (explicitCover && imageNames.includes(explicitCover)) return explicitCover;

  const normalizedTitle = normalize(title);
  const normalizedFile = normalize(fileName);
  return (
    imageNames.find((imageName) => normalize(imageName) === normalizedTitle) ??
    imageNames.find((imageName) => normalize(imageName) === normalizedFile) ??
    null
  );
}

export async function scanAudiobookFolder() {
  await fs.mkdir(audiobookFolder, { recursive: true });
  const entries = await fs.readdir(audiobookFolder, { withFileTypes: true });

  const audioEntries = entries
    .filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  return Promise.all(
    audioEntries.map(async (fileName) => {
      const metadata = localMetadata[fileName];
      const fallbackTitle = path.basename(fileName, path.extname(fileName)).replace(/[-_]+/g, ' ');
      const title = metadata?.title ?? fallbackTitle;
      const author = metadata?.author ?? 'Unknown author';
      const coverFileName = await getCoverFileName(fileName, title, metadata?.coverFileName);

      return {
        fileName,
        title,
        author,
        coverFileName,
        absolutePath: path.join(audiobookFolder, fileName)
      };
    })
  );
}
