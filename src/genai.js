// src/genai.js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const config = {
  responseMimeType: 'text/plain',
};

const model = 'gemini-2.0-flash';

async function generateResponse(prompt, onStreamUpdate) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: prompt }],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    for await (const chunk of response) {
      onStreamUpdate(chunk.text);
    }
  } catch (error) {
    console.error('Error generating content:', error);
    onStreamUpdate('Error generating response.');
  }
}

export default generateResponse;
