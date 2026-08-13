#!/bin/sh
set -eu

mkdir -p /app/data/uploads
touch /app/data/site.sqlite

npx prisma migrate deploy

exec node .output/server/index.mjs
