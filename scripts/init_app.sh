#!/usr/bin/env sh
set -eou pipefail

pnpm add drizzle-orm postgres & PID=$!
wait $PID

pnpm dbm:prod & PID=$!
wait $PID

HOSTNAME="0.0.0.0" node server.js