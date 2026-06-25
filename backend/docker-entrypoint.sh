#!/bin/sh
set -e

echo "Running database migrations..."
until npm run migrate; do
  echo "DB not ready, retrying in 3s..."
  sleep 3
done

echo "Seeding database..."
npm run seed

echo "Starting server..."
exec node src/server.js
