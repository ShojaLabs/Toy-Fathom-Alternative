#!/usr/bin/env sh
set -eou pipefail

node /app/migration-store/run.mjs & PID=$!
wait $PID

HOSTNAME="0.0.0.0" node server.js
