# 🚀 Guía de Despliegue Completa en Vercel - VinQ CRM

**Fecha:** Diciembre 3, 2025  
**Stack:** React + Vite + Express + Prisma + Neon PostgreSQL

---

## ✅ Pre-requisitos Completados

Tu proyecto ya está configurado con:
- ✅ `vercel.json` con rewrites y headers CORS
- ✅ `api/index.js` como serverless function
- ✅ Scripts de build optimizados para Vercel
- ✅ Frontend con detección automática de entorno
- ✅ `.env.example` con todas las variables necesarias
- ✅ Prisma configurado con Neon adapter

---

## 📋 Paso 1: Crear Base de Datos en Neon (5 minutos)

### 1.1 Registrarse en Neon

1. Ve a **[neon.tech](https://neon.tech)**
2. Click en **"Sign up"** (puedes usar tu cuenta de GitHub)
3. Confirma tu email

### 1.2 Crear Proyecto

1. En el dashboard, click **"Create a project"**
2. Configuración:
   - **Project name:** `vinq-crm`
   - **Region:** Selecciona la más cercana (ej: `US East (Ohio)` o `EU West (Frankfurt)`)
   - **Postgres version:** 16 (default)
   - **Compute size:** 0.25 CU (gratis)
3. Click **"Create project"**

### 1.3 Copiar Connection String

1. Una vez creado, verás **"Connection Details"**
2. Copia el **"Connection string"** completo
3. Formato: `postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require`

**Ejemplo:**
```
postgresql://vinq_user:AbC123XyZ@ep-cool-smoke-123456.us-east-2.aws.neon.tech/vinq_crm?sslmode=require
```

**💾 GUARDA ESTE STRING** - lo necesitarás en el siguiente paso.

---

## 🔑 Paso 2: Generar JWT Secrets (2 minutos)

Abre tu terminal y ejecuta estos comandos:

```bash
# Generar JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generar JWT Refresh Secret (ejecuta de nuevo)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**💾 COPIA AMBOS VALORES** - los usarás en Vercel.

Ejemplo de output:
```
a1b2c3d4e5f6....(128 caracteres hexadecimales)
```

---

## 🚀 Paso 3: Desplegar en Vercel (10 minutos)

### 3.1 Importar Proyecto

1. Ve a **[vercel.com](https://vercel.com)** y haz login con GitHub
2. Click en **"Add New..."** → **"Project"**
3. Busca el repositorio **`ElBeDev/vinq`**
4. Click **"Import"**

### 3.2 Configurar Build

En la pantalla de configuración:

- **Framework Preset:** `Vite`
- **Root Directory:** `./` (dejar como está)
- **Build Command:** (dejar vacío - usa `vercel.json`)
- **Output Directory:** (dejar vacío - usa `vercel.json`)
- **Install Command:** `npm install`

### 3.3 Configurar Variables de Entorno (IMPORTANTE ⚠️)

**Antes de hacer deploy**, expande la sección **"Environment Variables"**.

Agrega las siguientes variables **UNA POR UNA**:

#### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://usuario:password@ep-xxx.region.aws.neon.tech/vinq_crm?sslmode=require
```
(Pega tu connection string de Neon del Paso 1.3)

#### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: [pega el primer hash del Paso 2]
```

#### Variable 3: JWT_REFRESH_SECRET
```
Name: JWT_REFRESH_SECRET
Value: [pega el segundo hash del Paso 2]
```

#### Variable 4: JWT_EXPIRE
```
Name: JWT_EXPIRE
Value: 24h
```

#### Variable 5: JWT_REFRESH_EXPIRE
```
Name: JWT_REFRESH_EXPIRE
Value: 7d
```

#### Variable 6: NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### Variable 7: PORT
```
Name: PORT
Value: 5000
```

#### Variable 8: CLIENT_URL (placeholder por ahora)
```
Name: CLIENT_URL
Value: https://placeholder.vercel.app
```

#### Variable 9: VITE_API_URL (placeholder por ahora)
```
Name: VITE_API_URL
Value: https://placeholder.vercel.app/api/v1
```

**Nota:** Actualizaremos CLIENT_URL y VITE_API_URL después del primer deploy.

Para **cada variable**, asegúrate de marcar:
- ☑️ **Production**
- ☑️ **Preview**
- ☑️ **Development**

### 3.4 Deploy Inicial

1. Click en **"Deploy"**
2. Espera 3-5 minutos mientras Vercel:
   - Instala dependencias del backend
   - Genera Prisma Client
   - Compila TypeScript
   - Instala dependencias del frontend
   - Construye el frontend con Vite
3. **No cierres la ventana** mientras se despliega

### 3.5 Copiar URL de Deployment

Una vez completado el deploy:
1. Verás un mensaje de éxito con confetti 🎉
2. **Copia tu URL** (ejemplo: `https://vinq-abc123xyz.vercel.app`)

---

## 🔄 Paso 4: Actualizar Variables de Entorno (2 minutos)

Ahora que tienes tu URL real:

1. Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
2. Busca la variable **`CLIENT_URL`**
3. Click en los **tres puntos (⋯)** → **"Edit"**
4. Cambia el valor a tu URL real: `https://vinq-abc123xyz.vercel.app`
5. Click **"Save"**
6. Repite para **`VITE_API_URL`**:
   - Valor: `https://vinq-abc123xyz.vercel.app/api/v1`

### 4.1 Redeploy

1. Ve a **Deployments** (en el menú superior)
2. Click en el deployment más reciente (el primero de la lista)
3. Click en los **tres puntos (⋯)** → **"Redeploy"**
4. ✅ Marca **"Use existing Build Cache"**
5. Click **"Redeploy"**
6. Espera 1-2 minutos

---

## 🗄️ Paso 5: Ejecutar Migraciones de Prisma (3 minutos)

Ahora conectaremos a Neon y crearemos las tablas.

### 5.1 En tu terminal local:

```bash
# Navega a la carpeta del proyecto
cd /Users/bener/GitHub/VinQ

# Establece la DATABASE_URL (reemplaza con tu string de Neon)
export DATABASE_URL="postgresql://usuario:password@ep-xxx.aws.neon.tech/vinq_crm?sslmode=require"

# Navega a la carpeta backend
cd backend

# Ejecuta las migraciones
npx prisma migrate deploy
```

**Salida esperada:**
```
✅ The migration has been applied successfully
```

### 5.2 Verificar Tablas Creadas

```bash
# Ver el schema de la base de datos
npx prisma db pull
```

Deberías ver las tablas: `users`, `leads`, `contacts`, `accounts`

---

## ✅ Paso 6: Verificar el Despliegue (5 minutos)

### 6.1 Backend API Health Check

Abre en tu navegador o usa curl:

```bash
curl https://tu-proyecto.vercel.app/api/health
```

**Respuesta esperada (200 OK):**
```json
{
  "success": true,
  "message": "VinQ CRM API is running",
  "timestamp": "2024-12-03T..."
}
```

❌ Si recibes error 500, revisa:
- Vercel Dashboard → Tu Proyecto → **Functions** → Ver logs
- Verifica que todas las variables de entorno estén configuradas

### 6.2 Frontend

1. Abre en el navegador: `https://tu-proyecto.vercel.app`
2. Deberías ver la **página de Login** del CRM

❌ Si aparece "Failed to fetch" o error de CORS:
- Verifica que `CLIENT_URL` y `VITE_API_URL` estén correctos
- Redeploy el proyecto

### 6.3 Verificar Variables de Entorno

```bash
# Listar todas las variables
vercel env ls
```

Deberías ver 9 variables configuradas.

---

## 👤 Paso 7: Crear Usuario Administrador (2 minutos)

### Opción A: Con curl (Terminal)

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

### Opción B: Con Postman o Thunder Client

1. **Method:** `POST`
2. **URL:** `https://tu-proyecto.vercel.app/api/v1/auth/register`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (JSON):**
```json
{
  "email": "admin@vinq.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "VinQ",
  "role": "ADMIN"
}
```
5. Click **"Send"**

### Respuesta Exitosa (201 Created):
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@vinq.com",
      "firstName": "Admin",
      "lastName": "VinQ",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

---

## 🎉 Paso 8: Iniciar Sesión

1. Ve a `https://tu-proyecto.vercel.app`
2. Ingresa:
   - **Email:** `admin@vinq.com`
   - **Password:** `Admin123!`
3. Click **"Iniciar Sesión"**
4. **¡Listo!** Deberías ver el Dashboard de VinQ CRM 🎊

---

## 📊 Monitoreo y Logs

### Vercel Dashboard

1. **Functions:** Ver logs de las serverless functions
   - Ve a tu proyecto → **Functions**
   - Click en `/api/index` para ver logs del backend
   
2. **Deployments:** Ver historial de deploys
   - Ve a **Deployments**
   - Click en cualquier deploy para ver detalles

3. **Analytics:** Ver tráfico y performance (si está habilitado)

### Neon Dashboard

1. Ve a [console.neon.tech](https://console.neon.tech)
2. Selecciona tu proyecto `vinq-crm`
3. **Monitoring:**
   - Ver queries ejecutadas
   - Storage usado (max 0.5GB gratis)
   - Conexiones activas
4. **SQL Editor:** Ejecutar queries SQL directamente

---

## 🐛 Troubleshooting

### ❌ Error: "Cannot connect to database"

**Solución:**
1. Verifica que el `DATABASE_URL` sea correcto
2. Debe incluir `?sslmode=require` al final
3. Verifica que la base de datos esté activa en Neon
4. Prueba la conexión local:
   ```bash
   cd backend
   export DATABASE_URL="tu_connection_string"
   npx prisma db pull
   ```

### ❌ Error: "Prisma Client not generated"

**Solución:**
```bash
# En Vercel Dashboard
# Settings → General → Build & Development Settings
# Asegúrate de que el Build Command esté vacío (usa vercel.json)

# Si persiste, fuerza un rebuild
vercel --prod --force
```

### ❌ Error: "CORS policy blocked"

**Solución:**
1. Verifica que `CLIENT_URL` coincida con tu dominio de Vercel
2. Redeploy después de cambiar la variable
3. Limpia caché del navegador (Cmd+Shift+R en Mac)

### ❌ Error 500 en `/api/health`

**Solución:**
1. Ve a Vercel Dashboard → Functions → Ver logs
2. Busca el error específico
3. Verifica que todas las variables de entorno estén configuradas
4. Verifica que el backend esté compilado:
   ```bash
   cd backend
   npm run build
   # Verifica que exista la carpeta dist/
   ```

### ❌ Frontend carga pero API falla

**Solución:**
1. Abre DevTools (F12) → Console
2. Busca errores de red
3. Verifica que `VITE_API_URL` esté correcto
4. Redeploy si cambiaste variables de entorno

### ⚠️ Database en "Sleep Mode" (Neon)

En el plan gratuito de Neon, la DB se suspende después de 5 minutos de inactividad.
- **Primera request:** ~1-2 segundos (auto-resume)
- **Siguientes requests:** Instantáneas
- Esto es **normal** en el plan gratuito

---

## 🔒 Checklist de Seguridad

Antes de usar en producción:

- [ ] JWT secrets con 64+ caracteres aleatorios
- [ ] Database password fuerte
- [ ] `CLIENT_URL` configurado correctamente
- [ ] Variables de entorno **NO** en el código (solo en Vercel Dashboard)
- [ ] `.env` y `.env.local` en `.gitignore`
- [ ] HTTPS habilitado (automático en Vercel)
- [ ] Cambiar password del usuario admin después del primer login

---

## 🌐 Dominio Personalizado (Opcional)

Si tienes un dominio propio (ej: `crm.tuempresa.com`):

1. Vercel Dashboard → Tu Proyecto → **Settings** → **Domains**
2. Click **"Add"**
3. Ingresa tu dominio: `crm.tuempresa.com`
4. Configura DNS en tu proveedor:
   - **Type:** CNAME
   - **Name:** `crm` (o el subdominio que uses)
   - **Value:** `cname.vercel-dns.com`
5. Espera 5-30 minutos (propagación DNS)
6. Actualiza variables de entorno:
   - `CLIENT_URL=https://crm.tuempresa.com`
   - `VITE_API_URL=https://crm.tuempresa.com/api/v1`
7. Redeploy el proyecto

---

## 🔄 Actualizar el Proyecto

Para hacer cambios en el código:

```bash
# En tu computadora local
cd /Users/bener/GitHub/VinQ

# Hacer cambios en el código...

# Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Vercel **detectará automáticamente** el push y desplegará la nueva versión en 2-3 minutos.

---

## 📞 Recursos Útiles

- **Neon Console:** [console.neon.tech](https://console.neon.tech)
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **GitHub Repo:** [github.com/ElBeDev/vinq](https://github.com/ElBeDev/vinq)
- **Prisma Docs:** [prisma.io/docs](https://www.prisma.io/docs)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs:** [neon.tech/docs](https://neon.tech/docs)

---

## 🎯 Comandos Rápidos (Vercel CLI)

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Ver info del proyecto
vercel info

# Ver logs en tiempo real
vercel logs --follow

# Ver variables de entorno
vercel env ls

# Agregar variable
vercel env add NOMBRE_VARIABLE production

# Redeploy
vercel --prod

# Rollback a deploy anterior
vercel rollback
```

---

## ✅ Resumen de URLs

Después del deployment, guarda estas URLs:

- **🌐 Frontend (CRM):** `https://tu-proyecto.vercel.app`
- **💚 Health Check:** `https://tu-proyecto.vercel.app/api/health`
- **📡 API Base:** `https://tu-proyecto.vercel.app/api/v1`
- **📊 Vercel Dashboard:** `https://vercel.com/tu-usuario/tu-proyecto`
- **🐘 Neon Console:** `https://console.neon.tech/app/projects/tu-proyecto`
- **🔗 GitHub:** `https://github.com/ElBeDev/vinq`

---

## 🎊 ¡Felicidades!

Tu CRM VinQ está desplegado y funcionando en producción con:

- ✅ **Frontend:** React + Vite en Vercel Edge Network
- ✅ **Backend:** Express + TypeScript en Vercel Serverless
- ✅ **Database:** PostgreSQL en Neon (serverless)
- ✅ **ORM:** Prisma
- ✅ **SSL/HTTPS:** Automático
- ✅ **Deploys automáticos:** Git push → Auto deploy
- ✅ **100% Gratis:** Neon Free Tier + Vercel Hobby

**Próximos pasos:**
1. Explorar el CRM y probar funcionalidades
2. Crear más usuarios con diferentes roles
3. Agregar leads y contactos
4. Configurar integraciones (email, storage, etc.)
5. Personalizar el diseño según tu marca

**¡Disfruta tu CRM!** 🚀
