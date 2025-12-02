#!/bin/bash

# Script de deployment para VinQ CRM en Vercel

echo "🚀 VinQ CRM - Deployment Script"
echo "================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en la raíz del proyecto
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ Error: Este script debe ejecutarse desde la raíz del proyecto${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Verificando dependencias...${NC}"

# Verificar que Vercel CLI esté instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado. Instalando...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI instalado${NC}"
echo ""

# Login a Vercel
echo -e "${YELLOW}🔐 Autenticando con Vercel...${NC}"
vercel login

echo ""
echo -e "${YELLOW}🏗️  Preparando el proyecto...${NC}"

# Verificar variables de entorno
echo -e "${YELLOW}📋 Checklist de variables de entorno:${NC}"
echo "   ⬜ MONGO_URI"
echo "   ⬜ JWT_SECRET"
echo "   ⬜ JWT_REFRESH_SECRET"
echo "   ⬜ CLIENT_URL"
echo "   ⬜ VITE_API_URL"
echo ""

read -p "¿Ya configuraste todas las variables de entorno en Vercel? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Configura las variables de entorno antes de continuar:${NC}"
    echo "   1. Ve a tu proyecto en Vercel Dashboard"
    echo "   2. Settings → Environment Variables"
    echo "   3. Agrega las variables listadas arriba"
    echo ""
    echo "   O usa el CLI:"
    echo "   vercel env add MONGO_URI production"
    echo "   vercel env add JWT_SECRET production"
    echo "   etc..."
    exit 1
fi

echo ""
echo -e "${YELLOW}🚀 Iniciando deployment...${NC}"

# Hacer deployment
vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment completado!${NC}"
echo ""
echo -e "${GREEN}🎉 Tu CRM está en producción${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. Abre tu proyecto en el navegador"
echo "  2. Verifica el endpoint: /api/health"
echo "  3. Crea el primer usuario admin"
echo ""
echo "Ver logs:"
echo "  vercel logs --follow"
echo ""
