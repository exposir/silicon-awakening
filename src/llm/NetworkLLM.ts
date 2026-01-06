import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import { LLMInterface } from './Interface';

dotenv.config();

export class NetworkLLM implements LLMInterface {
    private client: OpenAI;
    private model: string;

    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.warn("[NetworkLLM] Warning: OPENAI_API_KEY not found in .env. Brain will not function.");
        }
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
            baseURL: process.env.OPENAI_BASE_URL // Optional: Support for local LLMs or proxies
        });
        this.model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';
    }

    public async chat(systemPrompt: string, userPrompt: string): Promise<string> {
        try {
            console.log(`[NetworkLLM] Sending Query to ${this.model}...`);
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
            });
            return response.choices[0]?.message?.content || "// Error: Empty response";
        } catch (error: any) {
            console.error(`[NetworkLLM] Error: ${error.message}`);
            return `// Error: Brain Connectivity Failed - ${error.message}`;
        }
    }
}
