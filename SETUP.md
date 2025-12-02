# 🚀 Setup Rápido - VinQ CRM con Neon PostgreSQL

## ⚡ Inicio Rápido (5 minutos)

### 1. Clonar el repositorio
```bash
git clone https://github.com/ElBeDev/vinq.git
cd vinq
```

### 2. Crear base de datos en Neon (GRATIS)

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Crea un proyecto llamado `vinq-crm`
3. Copia el **Connection String**

### 3. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
echo 'DATABASE_URL=TU_CONNECTION_STRING_DE_NEON' > .env
echo 'JWT_SECRET=dev-secret-123456789' >> .env
echo 'JWT_REFRESH_SECRET=dev-refresh-secret-987654321' >> .env
echo 'CLIENT_URL=http://localhost:5173' >> .env
echo 'NODE_ENV=development' >> .env
echo 'PORT=5000' >> .env

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# O crear nueva migración si es primera vez
npx prisma migrate dev --name init

# Iniciar backend
npm run dev
```

### 4. Configurar Frontend (en otra terminal)

```bash
cd frontend
npm install

# Crear archivo .env
echo 'VITE_API_URL=http://localhost:5000/api/v1' > .env

# Iniciar frontend
npm run dev
```

### 5. Abrir en el navegador

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

---

## 📦 Scripts Útiles

```bash
# Desde la raíz del proyecto
npm run dev                    # Iniciar frontend + backend simultáneamente
npm run build                  # Build de producción
npm run prisma:generate        # Regenerar cliente de Prisma
npm run prisma:migrate         # Ejecutar migraciones

# Backend individual
cd backend
npm run dev                    # Desarrollo con hot-reload
npm run build                  # Compilar TypeScript
npm start                      # Iniciar producción
npx prisma studio              # Abrir Prisma Studio (GUI para la DB)

# Frontend individual
cd frontend
npm run dev                    # Desarrollo con hot-reload
npm run build                  # Build de producción
npm run preview                # Preview del build
```

---

## 🗄️ Gestión de Base de Datos

### Prisma Studio (GUI Visual)
```bash
cd backend
npx prisma studio
```
Abre en: http://localhost:5555

### Ver estructura de la DB
```bash
npx prisma db pull              # Sincronizar schema desde DB
npx prisma migrate status       # Ver estado de migraciones
```

### Crear nueva migración
```bash
# Después de modificar schema.prisma
npx prisma migrate dev --name nombre_de_la_migracion
```

### Reset de base de datos (⚠️ ELIMINA TODO)
```bash
npx prisma migrate reset
```

---

## 🐘 Alternativa: PostgreSQL Local (Docker)

Si prefieres no usar Neon, puedes usar PostgreSQL local:

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d postgres

# El DATABASE_URL sería:
DATABASE_URL=postgresql://vinq_user:vinq_password@localhost:5432/vinq_crm
```

---

## 🎯 Crear Usuario Admin

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vinq.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "VinQ",
    "role": "ADMIN"
  }'
```

---

## 📚 Documentación

- **Deployment en Vercel**: [DEPLOYMENT_NEON.md](./DEPLOYMENT_NEON.md)
- **Workflow del proyecto**: [WORKFLOW.md](./WORKFLOW.md)
- **API Endpoints**: [README.md](./README.md)
- **Prisma Schema**: [backend/prisma/schema.prisma](./backend/prisma/schema.prisma)

---

## 🆘 Problemas Comunes

### Error: "Prisma Client not generated"
```bash
cd backend
npx prisma generate
```

### Error: "Database connection failed"
- Verifica que el `DATABASE_URL` en `.env` sea correcto
- Asegúrate de incluir `?sslmode=require` para Neon
- Prueba la conexión: `npx prisma db pull`

### Error: "Port 5000 already in use"
```bash
# Cambiar puerto en backend/.env
PORT=5001
```

### Frontend no se conecta al backend
- Verifica que `VITE_API_URL` en `frontend/.env` apunte a `http://localhost:5000/api/v1`
- Reinicia el servidor de Vite

---

## 🎉 ¡Listo para desarrollar!

Ahora puedes:
- ✅ Registrar usuarios
- ✅ Crear Leads
- ✅ Gestionar Contactos
- ✅ Administrar Cuentas
- ✅ Ver el Dashboard

**Happy coding!** 🚀
