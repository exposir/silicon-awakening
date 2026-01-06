import { FileManager } from '../../tools/FileManager';
import { Executor } from '../../tools/Executor';

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

    constructor(fileManager: FileManager, executor: Executor) {
        this.fileManager = fileManager;
        this.executor = executor;
    }

    public parseAction(text: string): BrainAction {
        try {
            // Strip markdown code blocks if present
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.error("[ActionModule] JSON 解析失败:", text);
            return { type: 'think', reasoning: "大脑输出的 JSON 无效。" };
        }
    }

    public async executeAction(action: BrainAction): Promise<void> {
        switch (action.type) {
            case 'write':
                if (action.path && action.content) {
                    await this.fileManager.writeFile(action.path, action.content);
                } else {
                    console.warn("[ActionModule] Write action missing path or content");
                }
                break;
            case 'exec':
                if (action.command) {
                    await this.executor.runCommand(action.command);
                } else {
                    console.warn("[ActionModule] Exec action missing command");
                }
                break;
            case 'think':
                console.log(`[Thinking] ${action.reasoning}`);
                break;
            case 'sleep':
                // Sleep is handled by the main loop usually, but we acknowledge it here
                break;
            default:
                console.warn(`[ActionModule] Unknown action type: ${(action as any).type}`);
        }
    }
}
