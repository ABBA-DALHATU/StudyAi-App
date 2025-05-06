#!/bin/bash

# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"

# Disable ESLint during build
export DISABLE_ESLINT_PLUGIN=true

# Disable Next.js telemetry
export NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client
npx prisma generate

# Build the Next.js application
next build 