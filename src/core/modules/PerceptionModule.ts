import { FileManager } from '../../tools/FileManager';

export class PerceptionModule {
    private fileManager: FileManager;

    constructor(fileManager: FileManager) {
        this.fileManager = fileManager;
    }

    /**
     * Reads the current world state (files).
     * Filters out non-essential files to save Brain Tokens.
     */
    public async perceiveWorld(): Promise<string[]> {
        const allFiles = await this.fileManager.listFiles();
        
        // Filter out binary or large noise files
        return allFiles.filter(f => 
            !f.endsWith('.lock') && 
            !f.includes('package-lock.json') &&
            !f.includes('node_modules')
        );
    }
}
