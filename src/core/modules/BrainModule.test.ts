import { BrainModule } from './BrainModule';
import { LLMInterface } from '../../llm/Interface';

describe('BrainModule', () => {
    let brain: BrainModule;
    let mockLLM: jest.Mocked<LLMInterface>;

    beforeEach(() => {
        // Create a mock LLM implementation
        mockLLM = {
            chat: jest.fn().mockResolvedValue('{ "type": "think", "reasoning": "I am thinking" }')
        };
        brain = new BrainModule(mockLLM);
    });

    test('should construct prompt and call LLM', async () => {
        const context = "File count: 10";
        const version = 0.7;
        
        await brain.think(context, version);

        expect(mockLLM.chat).toHaveBeenCalledTimes(1);
        
        // Verify System Prompt contains identity
        const systemPrompt = mockLLM.chat.mock.calls[0][0];
        expect(systemPrompt).toContain('SiliconSeed v0.7');
        
        // Verify User Prompt contains context
        const userPrompt = mockLLM.chat.mock.calls[0][1];
        expect(userPrompt).toContain('File count: 10');
    });

    test('should return LLM response', async () => {
        mockLLM.chat.mockResolvedValue('Response from Brain');
        const response = await brain.think("ctx", 1.0);
        expect(response).toBe('Response from Brain');
    });
});
