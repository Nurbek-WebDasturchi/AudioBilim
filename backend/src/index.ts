import { createApp } from './app.js';
import { env } from './config/env.js';
import { audioService } from './services/audioService.js';

const app = createApp();

app.listen(env.PORT, async () => {
  console.log(`Audio Library API listening on port ${env.PORT}`);

  try {
    const result = await audioService.syncLocalAudiobooks();
    console.log(`Local audiobook scan complete: ${result.scanned} scanned, ${result.inserted} inserted`);
  } catch (error) {
    console.warn('Local audiobook scan skipped:', error instanceof Error ? error.message : error);
  }
});
