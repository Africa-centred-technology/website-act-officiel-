#!/bin/bash
set -e

APP_NAME="website-act-officiel-"
CONTAINER="act-officiel-web"

echo "=== Déploiement $APP_NAME ==="

echo "[1/3] git pull..."
git pull origin main

echo "[2/3] Build de l'image Docker (Next.js standalone)..."
docker compose build

echo "[3/3] Redémarrage du service..."
docker compose up -d

echo ""
echo "=== Statut ==="
docker ps --filter "name=${CONTAINER}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== Déploiement $APP_NAME terminé ==="
