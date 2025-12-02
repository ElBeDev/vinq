# 🚀 Guía de Despliegue en Vercel con Neon PostgreSQL

## 📋 Pre-requisitos

1. **Cuenta en Vercel** - [vercel.com](https://vercel.com)
2. **Cuenta en Neon** - PostgreSQL Serverless gratuito [neon.tech](https://neon.tech)
3. **Repositorio en GitHub** - https://github.com/ElBeDev/vinq.git

---

## 🔧 Configuración Inicial

### 1. Crear Base de Datos en Neon (5 minutos) 🆓

Neon es PostgreSQL serverless **100% GRATUITO** y perfectamente compatible con Vercel.

1. Ve a [neon.tech](https://neon.tech)
2. **Sign up** con tu cuenta de GitHub (1 click)
3. **Create a project:**
   - Project name: `vinq-crm`
   - Region: Elige la más cercana (ej: `US East (Ohio)` o `EU West (Frankfurt)`)
   - Postgres version: 16 (default)
   - Click **"Create project"**
4. **Copiar Connection String:**
   - En el dashboard verás "Connection Details"
   - Copia el **"Connection string"** completo
   - Formato: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`
   - **💾 Guarda este string** - lo necesitarás en Vercel

**Ejemplo de connection string:**
```
postgresql://vinq_user:AbC123XyZ@ep-cool-smoke-123456.us-east-2.aws.neon.tech/vinq_crm?sslmode=require
```

**✅ Ventajas de Neon:**
- ✨ Gratis forever (hasta 0.5GB)
- ⚡ Serverless (auto-suspend cuando no se usa)
- 🚀 Compatible con Vercel
- 💻 Funciona también en local
- 🔄 Backups automáticos
- 🌐 Edge computing ready

### 2. Generar JWT Secrets (1 minuto)

Ejecuta estos comandos en tu terminal para generar secrets seguros:

```bash
# JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# JWT Refresh Secret
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

**💾 Guarda ambos valores**, los necesitarás en el siguiente paso.

---

## 🚀 Deploy en Vercel (10 minutos)

### Opción A: Dashboard de Vercel (Recomendado)

#### Paso 1: Importar Proyecto

1. Ve a [vercel.com](https://vercel.com) y **Log in** con GitHub
2. Click en **"Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Busca `ElBeDev/vinq` en la lista
   - Click **"Import"**

#### Paso 2: Configurar Build

4. **Framework Preset:** Vite
5. **Root Directory:** `./` (dejar como está)
6. **Build Command:** (dejar vacío, usa vercel.json)
7. **Output Directory:** (dejar vacío, usa vercel.json)
8. **Install Command:** `npm install`

#### Paso 3: Variables de Entorno (IMPORTANTE ⚠️)

**Antes de hacer deploy**, click en **"Environment Variables"** y agrega:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://usuario:password@ep-xxx.region.aws.neon.tech/vinq_crm?sslmode=require

# JWT Secrets (usa los que generaste)
JWT_SECRET=tu_jwt_secret_de_64_caracteres_generado_arriba
JWT_REFRESH_SECRET=tu_jwt_refresh_secret_de_64_caracteres_generado_arriba
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Node
NODE_ENV=production
PORT=5000

# URLs (actualizar después del primer deploy)
CLIENT_URL=https://tu-proyecto.vercel.app
VITE_API_URL=https://tu-proyecto.vercel.app/api/v1
```

**📝 Nota:** Para `CLIENT_URL` y `VITE_API_URL`, por ahora deja placeholders. Los actualizarás después del primer deploy.

#### Paso 4: Deploy Inicial

9. Click en **"Deploy"**
10. Espera 2-3 minutos ⏳
11. Una vez completado, **copia tu URL** (ej: `https://vinq-abc123.vercel.app`)

#### Paso 5: Actualizar URLs

12. Ve a **Settings → Environment Variables**
13. **Edita** estas dos variables con tu URL real:
    - `CLIENT_URL` = `https://vinq-abc123.vercel.app`
    - `VITE_API_URL` = `https://vinq-abc123.vercel.app/api/v1`
14. **Redeploy:**
    - Ve a **Deployments**
    - Click en el deployment más reciente
    - Click en **⋯** (tres puntos) → **"Redeploy"**
    - ✅ Usa "Use existing Build Cache"

#### Paso 6: Ejecutar Migraciones de Prisma

15. En tu terminal local:
```bash
# Establecer la DATABASE_URL de Neon
export DATABASE_URL="postgresql://usuario:password@ep-xxx.aws.neon.tech/vinq_crm?sslmode=require"

# Ejecutar migraciones
cd backend
npx prisma migrate deploy
```

O desde Vercel Dashboard:
- Ve a tu proyecto → **Settings** → **Functions**
- Agrega un **Build Command** personalizado:
  ```bash
  cd backend && npx prisma migrate deploy && cd ../frontend && npm run build
  ```

---

### Opción B: CLI de Vercel (Para usuarios avanzados)

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy desde la raíz del proyecto
cd /Users/bener/GitHub/VinQ

# Deployment inicial
vercel

# Agregar variables de entorno
vercel env add DATABASE_URL production
# Pegar: postgresql://usuario:password@ep-xxx.aws.neon.tech/vinq_crm?sslmode=require

vercel env add JWT_SECRET production
# Pegar tu JWT secret generado

vercel env add JWT_REFRESH_SECRET production
# Pegar tu JWT refresh secret

vercel env add CLIENT_URL production
vercel env add VITE_API_URL production

# Deploy a producción
vercel --prod

# Ejecutar migraciones
npx prisma migrate deploy
```

---

## ✅ Verificar el Deployment

### 1. Backend API
```bash
curl https://tu-proyecto.vercel.app/api/health
```

✅ Respuesta esperada:
```json
{
  "success": true,
  "message": "VinQ CRM API is running",
  "timestamp": "2024-...",
  "environment": "production"
}
```

### 2. Frontend
Abre en el navegador: `https://tu-proyecto.vercel.app`

Deberías ver la página de **Login** del CRM.

### 3. Revisar Logs
- Vercel Dashboard → Tu Proyecto → **Logs**
- Verifica que no haya errores de conexión a la base de datos

---

## 👤 Crear Usuario Admin Inicial

Usa curl, Postman, o Thunder Client:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vinq.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "VinQ",
    "role": "ADMIN"
  }'
```

✅ Respuesta exitosa:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": { ... },
    "token": "...",
    "refreshToken": "..."
  }
}
```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- ✅ Verifica que el connection string de Neon sea correcto
- ✅ Asegúrate de incluir `?sslmode=require` al final
- ✅ Verifica que la base de datos esté activa en Neon dashboard
- ✅ Prueba la conexión desde local: `npx prisma db pull`

### Error: "Prisma Client not generated"
```bash
# Regenerar cliente de Prisma
cd backend
npx prisma generate

# Redeploy en Vercel
vercel --prod
```

### Error: "CORS policy blocked"
- ✅ Verifica que `CLIENT_URL` coincida con tu dominio de Vercel
- ✅ Redeploy después de cambiar variables

### Error: "Environment variables not defined"
- ✅ Verifica todas las variables en Vercel Settings
- ✅ Redeploy el proyecto

### Frontend no carga
- ✅ Hard refresh: `Cmd+Shift+R` (Mac) o `Ctrl+Shift+R` (Windows)
- ✅ Revisa los logs: Vercel Dashboard → Functions
- ✅ Verifica `VITE_API_URL` esté correcto

### Database en "Sleep Mode" (Neon)
Neon suspende la DB después de 5 minutos de inactividad (plan gratuito).
- Primera request tomará ~1-2 segundos (auto-resume)
- Esto es **normal** en el plan gratuito
- Para evitarlo: upgrade a plan Pro o usa un cron job para ping

---

## 💻 Desarrollo Local con Neon

Puedes usar la **misma base de datos de Neon** en local:

```bash
# backend/.env
DATABASE_URL=postgresql://usuario:password@ep-xxx.aws.neon.tech/vinq_crm?sslmode=require

# Ejecutar migraciones
cd backend
npx prisma migrate dev

# Generar cliente
npx prisma generate

# Iniciar backend
npm run dev
```

O crear una **branch separada en Neon** para desarrollo:
1. Neon Dashboard → Tu proyecto → **Branches**
2. Click **"Create branch"**
3. Branch name: `development`
4. Copy el nuevo connection string
5. Úsalo en tu `.env` local

---

## 🌐 Dominio Personalizado (Opcional)

1. Vercel Dashboard → Settings → **Domains**
2. Click **"Add"**
3. Ingresa: `crm.tuempresa.com`
4. Configura DNS en tu proveedor:
   - **CNAME**: `cname.vercel-dns.com`
5. Espera 5-10 minutos
6. Actualiza variables:
   - `CLIENT_URL=https://crm.tuempresa.com`
   - `VITE_API_URL=https://crm.tuempresa.com/api/v1`
7. Redeploy

---

## 📊 Monitoreo

### Neon Dashboard
- **Storage**: Ve el espacio usado (max 0.5GB gratis)
- **Connections**: Monitorea conexiones activas
- **Query**: Analiza queries lentas
- **Logs**: Ve logs de PostgreSQL

### Vercel Dashboard
- **Analytics**: Tráfico y performance
- **Logs**: Errores y requests
- **Functions**: Duración y invocaciones

---

## 🎉 ¡Listo!

Tu CRM VinQ está en producción con:
- ✅ PostgreSQL Serverless (Neon)
- ✅ Frontend en Vercel Edge Network
- ✅ Backend Serverless Functions
- ✅ SSL/HTTPS automático
- ✅ Gratis forever

**URLs importantes:**
- 🌐 **CRM**: https://tu-proyecto.vercel.app
- 💚 **Health Check**: https://tu-proyecto.vercel.app/api/health
- 📡 **API**: https://tu-proyecto.vercel.app/api/v1
- 🔗 **GitHub**: https://github.com/ElBeDev/vinq
- 🚀 **Vercel**: https://vercel.com/dashboard
- 🐘 **Neon**: https://console.neon.tech

---

## 📞 Recursos

- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel + Prisma Guide](https://vercel.com/guides/prisma)

¡Disfruta tu CRM! 🎊
