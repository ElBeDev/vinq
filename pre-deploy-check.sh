#!/bin/bash
# Script de verificación pre-deployment para Vercel
# Ejecutar antes de hacer deploy: ./pre-deploy-check.sh

echo "🔍 VinQ CRM - Verificación Pre-Deployment"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0
SUCCESS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $2 - MISSING"
        ((ERRORS++))
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((SUCCESS++))
    else
        echo -e "${RED}✗${NC} $2 - MISSING"
        ((ERRORS++))
    fi
}

# Function to check npm package
check_npm_package() {
    if [ -f "$1/package.json" ]; then
        echo -e "${GREEN}✓${NC} $2 package.json found"
        ((SUCCESS++))
        
        if [ -d "$1/node_modules" ]; then
            echo -e "${GREEN}✓${NC} $2 node_modules installed"
            ((SUCCESS++))
        else
            echo -e "${YELLOW}⚠${NC} $2 node_modules not installed (run npm install)"
            ((WARNINGS++))
        fi
    else
        echo -e "${RED}✗${NC} $2 package.json MISSING"
        ((ERRORS++))
    fi
}

echo "📁 1. Verificando estructura de archivos..."
echo "--------------------------------------------"
check_file "vercel.json" "vercel.json"
check_file "package.json" "package.json (raíz)"
check_file ".gitignore" ".gitignore"
check_file ".env.example" ".env.example"
check_file "api/index.js" "api/index.js (serverless function)"

echo ""
echo "🔧 2. Verificando Backend..."
echo "--------------------------------------------"
check_dir "backend" "backend/ directory"
check_file "backend/package.json" "backend/package.json"
check_file "backend/tsconfig.json" "backend/tsconfig.json"
check_file "backend/src/app.ts" "backend/src/app.ts"
check_file "backend/src/server.ts" "backend/src/server.ts"
check_file "backend/prisma/schema.prisma" "backend/prisma/schema.prisma"

if [ -d "backend/dist" ]; then
    echo -e "${GREEN}✓${NC} backend/dist/ (TypeScript compilado)"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} backend/dist/ no existe (se generará en build)"
    ((WARNINGS++))
fi

echo ""
echo "🎨 3. Verificando Frontend..."
echo "--------------------------------------------"
check_dir "frontend" "frontend/ directory"
check_file "frontend/package.json" "frontend/package.json"
check_file "frontend/tsconfig.json" "frontend/tsconfig.json"
check_file "frontend/vite.config.ts" "frontend/vite.config.ts"
check_file "frontend/index.html" "frontend/index.html"
check_file "frontend/src/main.tsx" "frontend/src/main.tsx"
check_file "frontend/src/services/api.ts" "frontend/src/services/api.ts"

if [ -d "frontend/dist" ]; then
    echo -e "${GREEN}✓${NC} frontend/dist/ (Vite build)"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} frontend/dist/ no existe (se generará en build)"
    ((WARNINGS++))
fi

echo ""
echo "📦 4. Verificando dependencias..."
echo "--------------------------------------------"
check_npm_package "." "Root"
check_npm_package "backend" "Backend"
check_npm_package "frontend" "Frontend"

echo ""
echo "🗄️ 5. Verificando Prisma..."
echo "--------------------------------------------"
if [ -d "backend/node_modules/.prisma/client" ]; then
    echo -e "${GREEN}✓${NC} Prisma Client generado"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} Prisma Client no generado (run: cd backend && npx prisma generate)"
    ((WARNINGS++))
fi

if [ -d "backend/prisma/migrations" ]; then
    echo -e "${GREEN}✓${NC} Prisma migrations existen"
    ((SUCCESS++))
    
    migration_count=$(find backend/prisma/migrations -mindepth 1 -maxdepth 1 -type d | wc -l)
    echo -e "    ${GREEN}→${NC} $migration_count migration(s) encontrada(s)"
else
    echo -e "${RED}✗${NC} Prisma migrations MISSING"
    ((ERRORS++))
fi

echo ""
echo "📝 6. Verificando scripts de build..."
echo "--------------------------------------------"
if grep -q "vercel-build" package.json; then
    echo -e "${GREEN}✓${NC} Script 'vercel-build' configurado"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} Script 'vercel-build' MISSING"
    ((ERRORS++))
fi

if grep -q "postinstall" package.json; then
    echo -e "${GREEN}✓${NC} Script 'postinstall' configurado"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} Script 'postinstall' no encontrado"
    ((WARNINGS++))
fi

echo ""
echo "🔐 7. Verificando .gitignore..."
echo "--------------------------------------------"
if grep -q "node_modules" .gitignore; then
    echo -e "${GREEN}✓${NC} node_modules/ ignorado"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} node_modules/ NO ignorado"
    ((ERRORS++))
fi

if grep -q ".env" .gitignore; then
    echo -e "${GREEN}✓${NC} .env ignorado"
    ((SUCCESS++))
else
    echo -e "${RED}✗${NC} .env NO ignorado"
    ((ERRORS++))
fi

if grep -q "dist" .gitignore; then
    echo -e "${GREEN}✓${NC} dist/ ignorado"
    ((SUCCESS++))
else
    echo -e "${YELLOW}⚠${NC} dist/ no ignorado"
    ((WARNINGS++))
fi

echo ""
echo "📚 8. Verificando documentación..."
echo "--------------------------------------------"
check_file "README.md" "README.md"
check_file "DEPLOYMENT_GUIDE.md" "DEPLOYMENT_GUIDE.md"
check_file "VERCEL_CHECKLIST.md" "VERCEL_CHECKLIST.md"
check_file "WORKFLOW.md" "WORKFLOW.md"

echo ""
echo "=========================================="
echo "📊 RESUMEN"
echo "=========================================="
echo -e "${GREEN}✓ Exitosos:${NC} $SUCCESS"
echo -e "${YELLOW}⚠ Advertencias:${NC} $WARNINGS"
echo -e "${RED}✗ Errores:${NC} $ERRORS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡TODO PERFECTO! Listo para deployment.${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Crear base de datos en Neon (neon.tech)"
    echo "2. Configurar variables de entorno en Vercel"
    echo "3. git push origin main"
    echo ""
    echo "Ver guía completa: DEPLOYMENT_GUIDE.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️ Hay advertencias, pero puedes continuar.${NC}"
    echo "Revisa los warnings arriba antes de deployar."
    exit 0
else
    echo -e "${RED}❌ Hay errores que deben corregirse antes del deployment.${NC}"
    echo "Revisa los errores marcados con ✗ arriba."
    exit 1
fi
