# 🚀 Guía de Despliegue en Vercel

## 📋 Pre-requisitos

1. **Cuenta en Vercel** - [vercel.com](https://vercel.com)
2. **MongoDB Atlas** - Base de datos en la nube (gratis hasta 512MB)
3. **Repositorio en GitHub** - https://github.com/ElBeDev/vinq.git

---

## 🔧 Configuración Inicial

### 1. Preparar MongoDB Atlas

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster (Free Tier M0)
3. Crear un usuario de base de datos:
   - Database Access → Add New Database User
   - Username: `vinq_admin`
   - Password: (genera una contraseña segura)
4. Permitir acceso desde cualquier IP:
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Obtener la URI de conexión:
   - Cluster → Connect → Connect your application
   - Copiar la connection string: `mongodb+srv://vinq_admin:<password>@cluster0.xxxxx.mongodb.net/vinq-crm?retryWrites=true&w=majority`

### 2. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

#### 🔐 Variables del Backend

```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://vinq_admin:<password>@cluster0.xxxxx.mongodb.net/vinq-crm?retryWrites=true&w=majority

# JWT Secrets (genera valores aleatorios seguros)
JWT_SECRET=tu-jwt-secret-super-seguro-64-caracteres-minimo-produccion
JWT_REFRESH_SECRET=tu-refresh-secret-super-seguro-64-caracteres-minimo-produccion
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Client URL (tu dominio de Vercel)
CLIENT_URL=https://tu-proyecto.vercel.app
```

#### 🎨 Variables del Frontend

```env
VITE_API_URL=https://tu-proyecto.vercel.app/api/v1
```

### 3. Generar JWT Secrets Seguros

Puedes usar Node.js para generar secrets aleatorios:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📦 Despliegue en Vercel

### Opción 1: Deploy desde el Dashboard de Vercel (Recomendado)

1. **Conectar Repositorio**
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Selecciona "Import Git Repository"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `ElBeDev/vinq`

2. **Configurar el Proyecto**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (raíz del proyecto)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install` (esto instalará dependencias de ambos proyectos)

3. **Variables de Entorno**
   - Agrega todas las variables mencionadas arriba
   - Asegúrate de seleccionar "Production", "Preview", y "Development"

4. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! 🎉

### Opción 2: Deploy desde CLI

1. **Instalar Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy desde la raíz del proyecto**
   ```bash
   cd /Users/bener/GitHub/VinQ
   vercel
   ```

4. **Configurar durante el deploy**
   - Setup and deploy? `Y`
   - Which scope? (selecciona tu cuenta)
   - Link to existing project? `N`
   - Project name? `vinq-crm`
   - In which directory is your code located? `./`
   - Want to override the settings? `Y`
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Development Command: `npm run dev`

5. **Configurar variables de entorno**
   ```bash
   vercel env add MONGO_URI production
   vercel env add JWT_SECRET production
   vercel env add JWT_REFRESH_SECRET production
   vercel env add CLIENT_URL production
   vercel env add VITE_API_URL production
   ```

6. **Deploy a producción**
   ```bash
   vercel --prod
   ```

---

## 🔄 Actualizaciones Automáticas

Vercel está configurado para **deploy automático** cuando hagas push a GitHub:

- **main/master branch** → Producción
- **otras branches** → Preview deployments

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

Vercel detectará el push y desplegará automáticamente.

---

## 🧪 Verificar el Despliegue

### 1. Backend API
```bash
curl https://tu-proyecto.vercel.app/api/v1/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "message": "VinQ CRM API is running"
}
```

### 2. Frontend
Abre en el navegador: `https://tu-proyecto.vercel.app`

Deberías ver la página de login del CRM.

### 3. Crear Usuario Admin Inicial

Usa Postman o curl para crear el primer usuario:

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

---

## 📊 Monitoreo y Logs

### Ver Logs en Vercel
1. Dashboard → Tu Proyecto → Deployments
2. Click en el deployment activo
3. Tab "Functions" → Ver logs del backend
4. Tab "Build Logs" → Ver logs de compilación

### Comandos CLI
```bash
# Ver logs en tiempo real
vercel logs

# Ver logs de una función específica
vercel logs --follow
```

---

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"
- Verifica que la IP 0.0.0.0/0 esté permitida en MongoDB Atlas
- Verifica que el usuario tenga permisos de lectura/escritura
- Verifica que la contraseña en MONGO_URI sea correcta (URL encoded)

### Error: "CORS policy"
- Verifica que CLIENT_URL en el backend coincida con tu dominio de Vercel
- El backend debe estar configurado para permitir requests desde el frontend

### Error: "Environment variables not found"
- Asegúrate de que todas las variables estén configuradas en Vercel
- Redeploy el proyecto después de agregar variables

### Frontend no carga el API
- Verifica que VITE_API_URL apunte a tu dominio de Vercel
- Recuerda que las variables VITE_ deben estar configuradas en Build Time

---

## 🔒 Seguridad en Producción

### ✅ Checklist de Seguridad

- [ ] JWT secrets con al menos 64 caracteres aleatorios
- [ ] MongoDB con usuario y contraseña fuertes
- [ ] Network Access configurado correctamente (o IP específica si es posible)
- [ ] CORS configurado solo para tu dominio
- [ ] Helmet.js activado (ya está en el código)
- [ ] Rate limiting activado (ya está en el código)
- [ ] HTTPS automático (Vercel lo maneja)
- [ ] Variables de entorno en Vercel (nunca en el código)
- [ ] .env y .env.local en .gitignore

---

## 🌐 Dominios Personalizados

### Agregar dominio propio

1. Vercel Dashboard → Tu Proyecto → Settings → Domains
2. Add Domain → Ingresa tu dominio (ej: `crm.tuempresa.com`)
3. Configurar DNS en tu proveedor:
   - **CNAME**: apunta a `cname.vercel-dns.com`
4. Esperar propagación DNS (5-10 minutos)
5. Actualizar `CLIENT_URL` y `VITE_API_URL` con tu nuevo dominio
6. Redeploy el proyecto

---

## 📈 Próximos Pasos

1. **Configurar Notificaciones por Email** - Integrar SendGrid o similar
2. **Storage de Archivos** - Usar Cloudinary o AWS S3 para avatares y documentos
3. **Analytics** - Integrar Google Analytics o Mixpanel
4. **Monitoring** - Configurar Sentry para error tracking
5. **Backups** - Configurar backups automáticos de MongoDB Atlas

---

## 📞 Recursos Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎯 Comandos Rápidos

```bash
# Ver información del proyecto
vercel info

# Ver dominios
vercel domains ls

# Ver variables de entorno
vercel env ls

# Rollback a deployment anterior
vercel rollback

# Remover proyecto
vercel remove vinq-crm
```

---

**¡Tu CRM VinQ está listo para producción!** 🚀
