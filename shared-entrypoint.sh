#!/bin/bash

rm -f /shared/terminate

# Function to handle termination signal
terminate() {
    echo "Stopping services..."
    # Add any cleanup or shutdown commands here
    kill -TERM "$child" 2>/dev/null
    exit 0
}

# Trap termination signals
trap terminate SIGTERM SIGINT

# Start the main process
"$@" &

# Store the PID of the main process
child=$!

# Monitor for the termination file
while true; do
    if [ -f /shared/terminate ]; then
        terminate
        break
    fi
    sleep 1
done

wait "$child"