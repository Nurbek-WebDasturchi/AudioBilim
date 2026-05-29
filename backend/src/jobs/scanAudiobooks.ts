import { audioService } from '../services/audioService.js';

const result = await audioService.syncLocalAudiobooks();
console.log(JSON.stringify(result, null, 2));
