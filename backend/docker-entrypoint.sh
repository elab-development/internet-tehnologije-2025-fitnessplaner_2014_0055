#!/bin/sh
set -e

echo "NODE_ENV=${NODE_ENV:-development}"
echo "DB_HOST=${DB_HOST} DB_PORT=${DB_PORT} DB_NAME=${DB_NAME} DB_USER=${DB_USER}"

echo "Running database migrations..."
attempt=0
max_attempts=20
until npm run migrate; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Migrations failed after ${max_attempts} attempts. Check DB_* env vars and NODE_ENV. Aborting."
    exit 1
  fi
  echo "DB not ready or migration failed (attempt ${attempt}/${max_attempts}), retrying in 3s..."
  sleep 3
done

echo "Seeding database..."
npm run seed

echo "Starting server..."
exec node src/server.js
 