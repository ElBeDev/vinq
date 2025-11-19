#!/bin/bash

echo "🚀 Iniciando VinQ CRM..."
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar MongoDB
echo -e "${BLUE}Verificando MongoDB...${NC}"
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB no está ejecutándose. Por favor inicia MongoDB primero:"
    echo "   mongod"
    echo "   O usa Docker: docker run -d -p 27017:27017 --name mongodb mongo:7"
    exit 1
fi
echo -e "${GREEN}✅ MongoDB está ejecutándose${NC}"
echo ""

# Iniciar Backend
echo -e "${BLUE}Iniciando Backend...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend iniciado (PID: $BACKEND_PID)${NC}"
cd ..

# Esperar un poco
sleep 3

# Iniciar Frontend
echo -e "${BLUE}Iniciando Frontend...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend iniciado (PID: $FRONTEND_PID)${NC}"
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 VinQ CRM está ejecutándose!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Frontend: http://localhost:5173"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "Para detener los servicios, presiona Ctrl+C"
echo ""

# Esperar a que se presione Ctrl+C
trap "echo ''; echo '🛑 Deteniendo servicios...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
