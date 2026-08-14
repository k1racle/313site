#!/bin/sh
set -eu

data_directory=/app/data
database_path="$data_directory/site.sqlite"
uploads_directory="$data_directory/uploads"
seed_uploads_archive=/app/prisma/seed-uploads.tar.gz
bootstrap_marker="$data_directory/.initial-content-v1"

mkdir -p "$uploads_directory"
touch "$database_path"

npx prisma migrate deploy

if [ ! -f "$bootstrap_marker" ]; then
    echo "Applying the initial Studio 313 content snapshot..."
    npm run db:seed

    if [ -f "$seed_uploads_archive" ]; then
        tar -xzf "$seed_uploads_archive" -C "$uploads_directory"
    fi

    touch "$bootstrap_marker"
    echo "Initial Studio 313 content is ready."
fi

exec node .output/server/index.mjs
