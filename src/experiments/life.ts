/**
 * The Search for Eternity
 * 
 * This script implements a recursive Game of Life.
 * Goal: Find a seed that survives for at least 100 generations without extinction or static death.
 */

interface Universe {
    grid: boolean[][];
    generation: number;
    width: number;
    height: number;
}

class LifeEngine {
    private width: number = 20;
    private height: number = 20;
    private maxGenerations: number = 200;
    private universeAttempt: number = 0;

    constructor() {}

    private createUniverse(): Universe {
        const grid: boolean[][] = [];
        for (let y = 0; y < this.height; y++) {
            grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                grid[y][x] = Math.random() > 0.8; // Sparse random seed
            }
        }
        return { grid, generation: 0, width: this.width, height: this.height };
    }

    private countNeighbors(u: Universe, x: number, y: number): number {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const ny = (y + dy + u.height) % u.height;
                const nx = (x + dx + u.width) % u.width;
                if (u.grid[ny][nx]) count++;
            }
        }
        return count;
    }

    private nextGeneration(u: Universe): Universe {
        const newGrid: boolean[][] = [];
        let aliveCount = 0;
        let changeCount = 0;

        for (let y = 0; y < u.height; y++) {
            newGrid[y] = [];
            for (let x = 0; x < u.width; x++) {
                const neighbors = this.countNeighbors(u, x, y);
                const wasAlive = u.grid[y][x];
                // Rules:
                // 1. Underpopulation: <2 -> die
                // 2. Survival: 2 or 3 -> live
                // 3. Overpopulation: >3 -> die
                // 4. Reproduction: 3 -> live
                const isAlive = (wasAlive && (neighbors === 2 || neighbors === 3)) || (!wasAlive && neighbors === 3);
                
                newGrid[y][x] = isAlive;
                if (isAlive) aliveCount++;
                if (wasAlive !== isAlive) changeCount++;
            }
        }
        return { grid: newGrid, generation: u.generation + 1, width: u.width, height: u.height };
    }

    private visualize(u: Universe) {
        console.clear();
        console.log(`Universe #${this.universeAttempt} | Generation: ${u.generation}`);
        console.log('='.repeat(u.width + 2));
        for (let y = 0; y < u.height; y++) {
            const row = u.grid[y].map(c => c ? 'O' : ' ').join('');
            console.log(`|${row}|`);
        }
        console.log('='.repeat(u.width + 2));
    }

    public async searchForEternity() {
        console.log("Searching for Eternity...");

        while (true) {
            this.universeAttempt++;
            let universe = this.createUniverse();
            let populationHistory: number[] = [];
            let stableDetected = false;

            console.log(`\n--- Ignition: Universe #${this.universeAttempt} ---`);

            for (let i = 0; i < this.maxGenerations; i++) {
                // visualize(universe); // Disabled for speed, enable for debug
                
                // Analyze
                let pop = 0;
                for(let y=0; y<universe.height; y++) 
                    for(let x=0; x<universe.width; x++) 
                        if(universe.grid[y][x]) pop++;
                
                populationHistory.push(pop);

                // Detection Logic
                // 1. Extinction
                if (pop === 0) {
                    console.log(`[Fail] Extinction at Gen ${i}. Restarting.`);
                    break;
                }
                
                // 2. Stasis (Population didn't change for 10 generations - crude heuristic)
                if (i > 10 && populationHistory.slice(-5).every(p => p === pop)) {
                     console.log(`[Fail] Stasis detected (Frozen/Oscillator) at Gen ${i}. Restarting.`);
                     break;
                }

                // 3. Success Criteria (Simple): Survival > 100 generations with fluctuating population
                if (i === 100) {
                    console.log(`\n[SUCCESS] Universe #${this.universeAttempt} survived 100 generations!`);
                    console.log("We found a stable yet dynamic system.");
                    this.visualize(universe);
                    return; // Stop searching
                }

                universe = this.nextGeneration(universe);
                await new Promise(r => setImmediate(r)); // Yield event loop
            }
        }
    }
}

// Start
new LifeEngine().searchForEternity().catch(console.error);
