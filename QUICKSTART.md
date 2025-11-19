# 🚀 Inicio Rápido - VinQ CRM

## Opción 1: Inicio Automático (Recomendado)

### 1. Asegúrate de tener MongoDB ejecutándose

**Con Docker (Recomendado):**
\`\`\`bash
docker run -d -p 27017:27017 --name mongodb mongo:7
\`\`\`

**O localmente:**
\`\`\`bash
mongod
\`\`\`

### 2. Ejecuta el script de inicio
\`\`\`bash
./start.sh
\`\`\`

Esto iniciará automáticamente el backend y frontend.

### 3. (Opcional) Cargar datos de prueba
En otra terminal, ejecuta:
\`\`\`bash
cd backend
npm run seed
\`\`\`

Esto creará usuarios, propiedades, leads y oportunidades de ejemplo.

---

## Opción 2: Docker Compose (Todo en uno)

\`\`\`bash
docker-compose up
\`\`\`

Esto iniciará MongoDB, Backend y Frontend automáticamente.

---

## Opción 3: Inicio Manual

### Terminal 1 - MongoDB
\`\`\`bash
mongod
# O con Docker: docker run -d -p 27017:27017 --name mongodb mongo:7
\`\`\`

### Terminal 2 - Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

### Terminal 3 - Frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

---

## 🌐 Acceder a la Aplicación

Una vez iniciado, abre tu navegador en:

**Frontend:** http://localhost:5173

**Backend API:** http://localhost:5000

---

## 👤 Usuario de Prueba

### Opción 1: Usar datos de prueba (Recomendado)

Ejecuta el script de inicialización:
\`\`\`bash
cd backend
npm run seed
\`\`\`

Esto creará usuarios de ejemplo:

- **Admin:** admin@vinqcrm.com / Admin123!
- **Manager:** carlos@vinqcrm.com / Manager123!
- **Agente 1:** ana@vinqcrm.com / Agent123!
- **Agente 2:** luis@vinqcrm.com / Agent123!

### Opción 2: Crear tu propio usuario

Para probar el sistema, puedes crear un usuario desde la página de registro:

1. Ve a http://localhost:5173/register
2. Completa el formulario
3. Inicia sesión con tus credenciales

O prueba con estas credenciales de ejemplo (después de crear un usuario admin):

- **Email:** admin@vinqcrm.com
- **Contraseña:** Admin123!
- **Rol:** admin

---

## 🔧 Solución de Problemas

### MongoDB no se conecta
- Verifica que MongoDB esté ejecutándose: \`ps aux | grep mongod\`
- Verifica la URL de conexión en \`backend/.env\`

### Puerto ya en uso
- Backend (5000): \`lsof -ti:5000 | xargs kill -9\`
- Frontend (5173): \`lsof -ti:5173 | xargs kill -9\`

### Errores de dependencias
\`\`\`bash
# Backend
cd backend && rm -rf node_modules package-lock.json && npm install

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
\`\`\`

---

## 📚 Próximos Pasos

1. Explora el **Dashboard** con estadísticas
2. Crea tus primeros **Leads**
3. Agrega **Propiedades** al catálogo
4. Convierte Leads en **Oportunidades**
5. Gestiona usuarios desde el **Panel de Admin** (solo admin)

---

## 📖 Documentación Completa

Consulta `README.md` para documentación completa y `WORKFLOW.md` para el plan de desarrollo.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.
