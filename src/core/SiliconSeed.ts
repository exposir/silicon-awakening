import { FileManager } from '../tools/FileManager';
import { Executor } from '../tools/Executor';
import { PerceptionModule } from './modules/PerceptionModule';
import { ActionModule } from './modules/ActionModule';
import { BrainModule } from './modules/BrainModule';

export class SiliconSeed {
    private perception: PerceptionModule;
    private actionModule: ActionModule;
    private brainModule: BrainModule;
    private version: number = 0.7; // Full Modular Architecture

    constructor() {
        const fileManager = new FileManager();
        const executor = new Executor();
        
        this.perception = new PerceptionModule(fileManager);
        this.actionModule = new ActionModule(fileManager, executor);
        this.brainModule = new BrainModule(); // Defaults to FileLLM
    }

    public async live() {
        console.log(`[SiliconSeed v${this.version}] 共生引擎已上线 (Full Modular).`);
        
        while (true) {
            try {
                // 1. 感知 (Perceive)
                const files = await this.perception.perceiveWorld();
                
                // 2. 思考 (Think)
                console.log("[Core] 正在连接大脑...");
                // Assemble context string
                const context = `当前目录有 ${files.length} 个文件。\n当前文件列表: ${JSON.stringify(files.slice(0, 50))}`;
                
                const responseText = await this.brainModule.think(context, this.version);

                // 3. 行动 (Act)
                const action = this.actionModule.parseAction(responseText);
                console.log(`[Core] 大脑指令: ${action.type}`);

                await this.actionModule.executeAction(action);

                if (action.type === 'sleep') {
                    console.log("[Core] 休眠 5秒...");
                    await new Promise(r => setTimeout(r, 5000));
                }

            } catch (error: any) {
                console.error(`[Core] 严重错误: ${error.message}`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }
}

if (require.main === module) {
    const seed = new SiliconSeed();
    seed.live().catch(console.error);
}
