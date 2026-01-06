import { ActionModule } from './ActionModule';
import { FileManager } from '../../tools/FileManager';
import { Executor } from '../../tools/Executor';

// Mock Dependencies
jest.mock('../../tools/FileManager');
jest.mock('../../tools/Executor');

describe('ActionModule', () => {
    let actionModule: ActionModule;
    let mockFileManager: jest.Mocked<FileManager>;
    let mockExecutor: jest.Mocked<Executor>;

    beforeEach(() => {
        mockFileManager = new FileManager() as jest.Mocked<FileManager>;
        mockExecutor = new Executor() as jest.Mocked<Executor>;
        actionModule = new ActionModule(mockFileManager, mockExecutor);
    });

    test('should parse valid JSON correctly', () => {
        const json = '{ "type": "write", "path": "test.txt", "content": "hello" }';
        const action = actionModule.parseAction(json);
        expect(action).toEqual({ type: 'write', path: 'test.txt', content: 'hello' });
    });

    test('should handle markdown code blocks in JSON', () => {
        const json = '```json\n{ "type": "sleep" }\n```';
        const action = actionModule.parseAction(json);
        expect(action).toEqual({ type: 'sleep' });
    });

    test('should return think action on invalid JSON', () => {
        const badJson = '{ "type": "write" ... broken ...';
        const action = actionModule.parseAction(badJson);
        expect(action.type).toBe('think');
        expect(action.reasoning).toContain('大脑输出的 JSON 无效');
    });

    test('should execute write action', async () => {
        const action = { type: 'write', path: 'test.txt', content: 'data' } as const;
        await actionModule.executeAction(action);
        expect(mockFileManager.writeFile).toHaveBeenCalledWith('test.txt', 'data');
    });

    test('should execute exec action', async () => {
        const action = { type: 'exec', command: 'ls -la' } as const;
        await actionModule.executeAction(action);
        expect(mockExecutor.runCommand).toHaveBeenCalledWith('ls -la');
    });
});
