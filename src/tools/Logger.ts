import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

export class Logger {
    private logFile: string;
    private context: string;

    constructor(context: string, logFile: string = 'silicon_seed.log') {
        this.context = context;
        // Ensure log is in root
        this.logFile = path.resolve(process.cwd(), logFile);
    }

    private formatMessage(level: LogLevel, message: string): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${this.context}] ${message}`;
    }

    public async log(level: LogLevel, message: string): Promise<void> {
        const formatted = this.formatMessage(level, message);
        
        // 1. Print to console
        switch (level) {
            case LogLevel.ERROR:
                console.error(formatted);
                break;
            case LogLevel.WARN:
                console.warn(formatted);
                break;
            default:
                console.log(formatted);
        }

        // 2. Append to file
        try {
            await fs.promises.appendFile(this.logFile, formatted + '\n', 'utf8');
        } catch (error) {
            console.error(`[Logger] Failed to write to log file: ${error}`);
        }
    }

    public info(message: string) { this.log(LogLevel.INFO, message); }
    public warn(message: string) { this.log(LogLevel.WARN, message); }
    public error(message: string) { this.log(LogLevel.ERROR, message); }
    public debug(message: string) { this.log(LogLevel.DEBUG, message); }
}
