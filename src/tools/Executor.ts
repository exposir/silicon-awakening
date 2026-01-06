import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class Executor {
    /**
     * Executes a command and returns stdout/stderr.
     * Enforces timeout to prevent infinite loops.
     */
    public async runCommand(command: string, timeoutMs: number = 5000): Promise<{ stdout: string; stderr: string; success: boolean }> {
        try {
            console.log(`[Executor] 执行命令: ${command}`);
            const { stdout, stderr } = await execAsync(command, { timeout: timeoutMs });
            return { stdout, stderr, success: true };
        } catch (error: any) {
            return {
                stdout: error.stdout || '',
                stderr: error.stderr || error.message,
                success: false
            };
        }
    }
}
