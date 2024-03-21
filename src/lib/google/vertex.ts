import {
    HarmBlockThreshold,
    HarmCategory,
    VertexAI,
} from '@google-cloud/vertexai';
import { GOOGLE_PROJECT_ID } from '../../config';

const vertexai = new VertexAI({
    project: GOOGLE_PROJECT_ID,
    location: 'us-central1',
});

export const GenerativeModel = vertexai.preview.getGenerativeModel({
    model: 'gemini-pro',
    generation_config: { max_output_tokens: 256 },
    safety_settings: [
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    ],
});
