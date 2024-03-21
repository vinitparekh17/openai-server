import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '../../config';

export const pollyClient = new PollyClient({
    apiVersion: "2010-12-01",
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
});

export const pollyCommand = (text: string) => new SynthesizeSpeechCommand({
    Engine: "neural",
    LanguageCode: "en-GB",
    OutputFormat: "mp3",
    SampleRate: "8000",
    Text: text,
    VoiceId: "Arthur"    
})