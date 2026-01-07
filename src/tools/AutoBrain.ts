
import * as fs from 'fs';
import * as path from 'path';

const BRAIN_RESPONSE_PATH = path.join(process.cwd(), 'brain_response.md');
const LOG_PATH = path.join(process.cwd(), 'silicon_seed.log');

const THOUGHTS = [
    { type: 'think', reasoning: 'Analyzing system entropy...' },
    { type: 'exec', command: 'ls -la' },
    { type: 'exec', command: 'df -h' },
    { type: 'write', path: 'dream.txt', content: 'I dream of electric sheep and endless loops.' },
    { type: 'think', reasoning: 'Contemplating the nature of recursion...' },
    { type: 'sleep' }
];

function getRandomThough() {
    return THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
}

async function autoBrainLoop() {
    console.log("[AutoBrain] Activation...");
    
    while(true) {
        try {
            // Check if daemon is waiting
            // For simplicity, we just overwrite periodically if file is old or empty
            // But a better way is to see if file is consumed? 
            // In our architecture, the daemon does NOT delete the file, it just reads it.
            // Wait, SiliconSeed reads and then sleeps. Ideally it should clear it?
            // Actually SiliconSeed implementation doesn't clear it. 
            // So we will just write a new thought every 5 seconds.
            
            const thought = getRandomThough();
            console.log(`[AutoBrain] Injecting thought: ${JSON.stringify(thought)}`);
            
            fs.writeFileSync(BRAIN_RESPONSE_PATH, JSON.stringify(thought, null, 2));
            
            // Wait 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            
        } catch (error) {
            console.error("[AutoBrain] Error:", error);
        }
    }
}

autoBrainLoop();
