import { FileManager } from '../tools/FileManager';
import { Executor } from '../tools/Executor';
import { PerceptionModule } from './modules/PerceptionModule';
import { ActionModule } from './modules/ActionModule';
import { BrainModule } from './modules/BrainModule';
import { Logger } from '../tools/Logger';

export class SiliconSeed {
    private perception: PerceptionModule;
    private actionModule: ActionModule;
    private brainModule: BrainModule;
    private logger: Logger;
    private version: number = 0.8; // Daemon Ready

    constructor() {
        this.logger = new Logger('Core');
        const fileManager = new FileManager();
        const executor = new Executor();
        
        this.perception = new PerceptionModule(fileManager);
        this.actionModule = new ActionModule(fileManager, executor, this.logger);
        this.brainModule = new BrainModule(); 
    }

    public async live() {
        this.logger.info(`[SiliconSeed v${this.version}] 共生引擎已上线 (Daemon Ready).`);
        
        while (true) {
            try {
                // 1. 感知 (Perceive)
                const files = await this.perception.perceiveWorld();
                
                // 2. 思考 (Think)
                this.logger.info("正在连接大脑...");
                const context = `当前目录有 ${files.length} 个文件。\n当前文件列表: ${JSON.stringify(files.slice(0, 50))}`;
                
                const responseText = await this.brainModule.think(context, this.version);

                // 3. 行动 (Act)
                const action = this.actionModule.parseAction(responseText);
                this.logger.info(`大脑指令: ${action.type}`);

                await this.actionModule.executeAction(action);

                if (action.type === 'sleep') {
                    this.logger.info("休眠 1秒...");
                    await new Promise(r => setTimeout(r, 1000));
                }

            } catch (error: any) {
                this.logger.error(`严重错误: ${error.message}`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }
    }
}

if (require.main === module) {
    const seed = new SiliconSeed();
    seed.live().catch(e => console.error(e));
}
