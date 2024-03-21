import { GenerativeModel } from '../lib/google/vertex';

export const AiResponder = async (text: string): Promise<string> => {
    
    let completeResponse = '';

    const responseStream = await GenerativeModel.generateContentStream({
        contents: [{
            role: "user",
            parts: [{ text }]
        }]
    })
    // Transmit the response stream to the user...
    for await (const chunks of responseStream.stream) {
        // Emit the response to the user if socket id is found...
        if (chunks.candidates[0].finishReason === 'SAFETY') {
            completeResponse = 'SAFETY';
        } else {
            completeResponse += chunks.candidates[0].content.parts[0].text;
        }
    }

    return completeResponse;

}