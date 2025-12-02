#!/bin/bash
set -e

echo "🔧 Installing backend dependencies..."
cd backend
npm install

echo "🔨 Generating Prisma client..."
npx prisma generate

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🏗️ Building frontend..."
npm run build

echo "✅ Build complete!"
