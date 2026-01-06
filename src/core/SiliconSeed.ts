import { FileManager } from '../tools/FileManager';
import { Executor } from '../tools/Executor';
import { LLMInterface, MockLLM } from '../llm/Interface';

export class SiliconSeed {
    private fileManager: FileManager;
    private executor: Executor;
    private brain: LLMInterface;
    private version: number = 0.1;

    constructor() {
        this.fileManager = new FileManager();
        this.executor = new Executor();
        this.brain = new MockLLM(); // Future: Swappable with RealLLM
    }

    public async live() {
        console.log(`[SiliconSeed v${this.version}] Waking up...`);
        
        // 1. Perceive
        const files = await this.fileManager.listFiles();
        console.log(`[Perceive] I see ${files.length} files in my universe.`);

        // 2. Reflect (Mocked for now)
        const introspection = await this.brain.chat(
            "You are a recursive AI. Analyze this file list.",
            JSON.stringify(files)
        );
        console.log(`[Reflect] Brain thought: ${introspection}`);

        // 3. Mutate (No-Op for v0.1)
        console.log("[Mutate] Skipping mutation in v0.1 safety mode.");

        // 4. Sleep
        console.log("[SiliconSeed] Cycle complete. Sleeping...");
    }
}

// Entry point
if (require.main === module) {
    const seed = new SiliconSeed();
    seed.live().catch(console.error);
}
