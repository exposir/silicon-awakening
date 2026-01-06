import * as fs from 'fs';
import * as path from 'path';
import { LLMInterface } from './Interface';

export class FileLLM implements LLMInterface {
    private requestPath: string;
    private responsePath: string;

    constructor() {
        this.requestPath = path.resolve(process.cwd(), 'brain_request.md');
        this.responsePath = path.resolve(process.cwd(), 'brain_response.md');
    }

    public async chat(systemPrompt: string, userPrompt: string): Promise<string> {
        console.log(`[FileLLM] 正在写入请求到 ${this.requestPath}...`);
        
        const content = `# 大脑请求 (Brain Request)
**System**:
${systemPrompt}

**User**:
${userPrompt}

---
*等待 Agent 将响应写入 'brain_response.md'...*
`;
        await fs.promises.writeFile(this.requestPath, content, 'utf-8');

        // Wait loop
        console.log("[FileLLM] 等待大脑响应...");
        while (true) {
            if (fs.existsSync(this.responsePath)) {
                console.log("[FileLLM] 检测到响应!");
                const response = await fs.promises.readFile(this.responsePath, 'utf-8');
                
                // Cleanup
                await fs.promises.unlink(this.responsePath);
                await fs.promises.unlink(this.requestPath);
                
                return response;
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep 1s
        }
    }
}
