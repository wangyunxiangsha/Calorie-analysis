#!/bin/sh
# Zeabur / 生产容器内执行种子（无 devDependencies、无类型包）
set -e
export TS_NODE_COMPILER_OPTIONS='{"module":"commonjs","moduleResolution":"node"}'
exec npx ts-node --transpile-only --project tsconfig.seed.json prisma/seed.ts
