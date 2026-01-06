import { FileManager } from './FileManager';
import * as path from 'path';
import * as fs from 'fs';

describe('FileManager System Test', () => {
    const testDir = path.resolve(__dirname, '../../test_sandbox');
    const fileManager = new FileManager(testDir);

    beforeAll(async () => {
        if (!fs.existsSync(testDir)) {
            await fs.promises.mkdir(testDir, { recursive: true });
        }
    });

    afterAll(async () => {
        // Cleaning up sandbox
        await fs.promises.rm(testDir, { recursive: true, force: true });
    });

    test('should write and read a file securely', async () => {
        const filename = 'hello_world.txt';
        const content = 'Hello Silicon Intelligence';
        
        // 1. Write
        await fileManager.writeFile(filename, content);
        
        // 2. Read
        const readContent = await fileManager.readFile(filename);
        expect(readContent).toBe(content);
    });

    test('should prevent accessing files outside sandbox', async () => {
        await expect(fileManager.readFile('../secret.txt'))
            .rejects
            .toThrow("访问拒绝");
    });
});
