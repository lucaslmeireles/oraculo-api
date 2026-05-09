import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ModerationService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async evaluate(content: string): Promise<boolean> {
    const response = await this.client.responses.create({
      model: 'llama-3.1-8b-instant',
      input: content,
      instructions: `
        You are a safe content classifier for a mystical oracle chat app.
        Analyze the message and return ONLY the word "true" if the message is safe and appropriate, or ONLY the word "false" if it contains harmful content, bad words, threats, or inappropriate language.
        Do not return anything else besides "true" or "false".
        `,
    });

    return response.output_text.trim().toLowerCase() === 'true';
  }
}
