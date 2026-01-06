import { FileManager } from '../tools/FileManager';
import { Executor } from '../tools/Executor';
import { LLMInterface } from '../llm/Interface';
import { FileLLM } from '../llm/FileLLM';
import { PerceptionModule } from './modules/PerceptionModule';
import { ActionModule } from './modules/ActionModule';

export class SiliconSeed {
    private fileManager: FileManager;
    private executor: Executor;
    private brain: LLMInterface;
    private perception: PerceptionModule;
    private actionModule: ActionModule;
    private version: number = 0.6; // Refactored Action Module

    constructor() {
        this.fileManager = new FileManager();
        this.executor = new Executor();
        this.brain = new FileLLM();
        this.perception = new PerceptionModule(this.fileManager);
        this.actionModule = new ActionModule(this.fileManager, this.executor);
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

                // 3. 变异 (Mutate - 解析与执行)
                const action = this.actionModule.parseAction(responseText);
                console.log(`[Core] 大脑指令: ${action.type}`);

                await this.actionModule.executeAction(action);

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
}

if (require.main === module) {
    const seed = new SiliconSeed();
    seed.live().catch(console.error);
}
