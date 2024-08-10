#!/usr/bin/env sh
set -eou pipefail

echo "Creating Database..."
pnpm dbm:prod & PID=$!
wait $PID

HOSTNAME="0.0.0.0" node server.js