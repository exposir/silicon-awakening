import { FileManager } from '../tools/FileManager';
import { Executor } from '../tools/Executor';
import { LLMInterface } from '../llm/Interface';
import { FileLLM } from '../llm/FileLLM';
import { PerceptionModule } from './modules/PerceptionModule';

interface BrainAction {
    type: 'write' | 'exec' | 'think' | 'sleep';
    path?: string;
    content?: string;
    command?: string;
    reasoning?: string;
}

export class SiliconSeed {
    private fileManager: FileManager;
    private executor: Executor;
    private brain: LLMInterface;
    private perception: PerceptionModule;
    private version: number = 0.5; // Refactored Version

    constructor() {
        this.fileManager = new FileManager();
        this.executor = new Executor();
        this.brain = new FileLLM();
        this.perception = new PerceptionModule(this.fileManager);
    }

    public async live() {
        console.log(`[SiliconSeed v${this.version}] 共生引擎已上线 (Symbiosis Engine Online)。`);
        
        while (true) {
            try {
                // 1. 感知 (Perceive)
                const files = await this.perception.perceiveWorld();
                
                // 2. 反思 (Reflect - 询问大脑)
                console.log("[Core] 正在连接大脑...");
                const responseText = await this.brain.chat(
                    `你是 SiliconSeed v${this.version} 的控制大脑。
上下文:
- 当前目录有 ${files.length} 个文件。
- 你必须回复一个单一的有效 JSON 对象 (不要使用 markdown 格式)。
- 支持的操作: 
  - { "type": "write", "path": "文件路径", "content": "文件内容" }
  - { "type": "exec", "command": "Shell命令" }
  - { "type": "think", "reasoning": "思考过程..." }
  - { "type": "sleep" }`,
                    `当前文件列表: ${JSON.stringify(files.slice(0, 50))}` // 暂时截断
                );

                // 3. 变异 (Mutate - 解析并执行)
                const action = this.parseAction(responseText);
                console.log(`[Core] 大脑指令: ${action.type}`);

                await this.executeAction(action);

                if (action.type === 'sleep') {
                    console.log("[Core] 休眠 5秒...");
                    await new Promise(r => setTimeout(r, 5000));
                }

            } catch (error: any) {
                console.error(`[Core] 严重错误: ${error.message}`);
                await new Promise(r => setTimeout(r, 5000)); // 防止快速失败循环
            }
        }
    }

    private parseAction(text: string): BrainAction {
        try {
            // 去除 markdown 代码块标记
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.error("[Core] JSON 解析失败:", text);
            return { type: 'think', reasoning: "大脑输出的 JSON 无效。" };
        }
    }

    private async executeAction(action: BrainAction) {
        switch (action.type) {
            case 'write':
                if (action.path && action.content) {
                    await this.fileManager.writeFile(action.path, action.content);
                }
                break;
            case 'exec':
                if (action.command) {
                    await this.executor.runCommand(action.command);
                }
                break;
            case 'think':
                console.log(`[Thinking] ${action.reasoning}`);
                break;
        }
    }
}

if (require.main === module) {
    const seed = new SiliconSeed();
    seed.live().catch(console.error);
}
