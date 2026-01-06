export interface LLMInterface {
    /**
     * Sends a prompt to the brain and gets a text response.
     */
    chat(systemPrompt: string, userPrompt: string): Promise<string>;
}

export class MockLLM implements LLMInterface {
    public async chat(systemPrompt: string, userPrompt: string): Promise<string> {
        console.log(`[MockLLM] System: ${systemPrompt.slice(0, 50)}...`);
        console.log(`[MockLLM] User: ${userPrompt.slice(0, 50)}...`);
        return "// Mock Response: I see the code and I propose no changes yet.";
    }
}
