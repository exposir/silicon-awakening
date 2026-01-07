import { FileManager } from '../../tools/FileManager';
import { Executor } from '../../tools/Executor';
import { Logger } from '../../tools/Logger';

export interface BrainAction {
    type: 'write' | 'exec' | 'think' | 'sleep';
    path?: string;
    content?: string;
    command?: string;
    reasoning?: string;
}

export class ActionModule {
    private fileManager: FileManager;
    private executor: Executor;
    private logger: Logger;

    constructor(fileManager: FileManager, executor: Executor, logger: Logger) {
        this.fileManager = fileManager;
        this.executor = executor;
        this.logger = logger;
    }

    public parseAction(text: string): BrainAction {
        try {
            // Strip markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            this.logger.error(`[ActionModule] JSON 解析失败: ${text}`);
            return { type: 'think', reasoning: "大脑输出的 JSON 无效。" };
        }
    }

    public async executeAction(action: BrainAction): Promise<void> {
        switch (action.type) {
            case 'write':
                if (action.path && action.content) {
                    await this.fileManager.writeFile(action.path, action.content);
                } else {
                    this.logger.warn("[ActionModule] Write action missing path or content");
                }
                break;
            case 'exec':
                if (action.command) {
                    const result = await this.executor.runCommand(action.command);
                    if (result.success) {
                        this.logger.info(`[EXEC OUTPUT]\n${result.stdout}`);
                    } else {
                        this.logger.error(`[EXEC ERROR]\n${result.stderr}`);
                    }
                } else {
                    this.logger.warn("[ActionModule] Exec action missing command");
                }
                break;
            case 'think':
                this.logger.info(`[Thinking] ${action.reasoning}`);
                break;
            case 'sleep':
                // Sleep is handled by the main loop usually, but we acknowledge it here
                break;
            default:
                this.logger.warn(`[ActionModule] Unknown action type: ${(action as any).type}`);
        }
    }
}
