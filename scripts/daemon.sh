#!/bin/bash
# Project Silicon Awakening - Daemon Launcher
# Usage: ./scripts/daemon.sh

# Ensure we are in project root
if [ ! -f "package.json" ]; then
    echo "Error: Please run from project root."
    exit 1
fi

echo "[Daemon] Awakening SiliconSeed..."
echo "[Daemon] Mode: Background Process (nohup)"

# Launch in background, detach from terminal
# Output is discarded because SiliconSeed now uses Logger to write to silicon_seed.log
nohup npx ts-node src/core/SiliconSeed.ts > /dev/null 2>&1 &

PID=$!
echo "[Daemon] SiliconSeed is alive. PID: $PID"
echo "[Daemon] Consciousness log: $(pwd)/silicon_seed.log"
echo "[Daemon] To kill: kill $PID"
