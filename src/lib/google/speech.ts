import { SpeechClient } from '@google-cloud/speech';
import { GOOGLE_PROJECT_ID } from '../../config';

export const speechClient = new SpeechClient({
    projectId: GOOGLE_PROJECT_ID
});