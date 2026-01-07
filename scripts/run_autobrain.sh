#!/bin/bash
# run_autobrain.sh - Launch the AutoBrain in background

# Redirect stdout and stderr to autobrain.log
nohup npx ts-node src/tools/AutoBrain.ts > autobrain.log 2>&1 &

echo "AutoBrain launched! PID: $!"
