import { PerceptionModule } from './PerceptionModule';
import { FileManager } from '../../tools/FileManager';

// Mock FileManager
jest.mock('../../tools/FileManager');

describe('PerceptionModule', () => {
    let perception: PerceptionModule;
    let mockFileManager: jest.Mocked<FileManager>;

    beforeEach(() => {
        mockFileManager = new FileManager() as jest.Mocked<FileManager>;
        perception = new PerceptionModule(mockFileManager);
    });

    test('should filter out noise files (lock files)', async () => {
        // Setup mock return
        mockFileManager.listFiles.mockResolvedValue([
            'src/index.ts',
            'package-lock.json',
            'yarn.lock'
        ]);

        const view = await perception.perceiveWorld();
        
        expect(view).toContain('src/index.ts');
        expect(view).not.toContain('package-lock.json');
        expect(view).not.toContain('yarn.lock');
    });

    test('should return empty list if FileManager returns empty', async () => {
        mockFileManager.listFiles.mockResolvedValue([]);
        const view = await perception.perceiveWorld();
        expect(view).toHaveLength(0);
    });
});
