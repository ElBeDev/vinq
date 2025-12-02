# 🎯 Pasos Siguientes - Deployment en Vercel

## ✅ Completado
- [x] Código subido a GitHub: https://github.com/ElBeDev/vinq.git
- [x] Configuración de Vercel lista (vercel.json)
- [x] Script de deployment creado (deploy.sh)
- [x] Documentación completa (DEPLOYMENT.md)

---

## 🚀 Próximos Pasos (En Orden)

### 1. Configurar MongoDB Atlas (5-10 minutos)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita o inicia sesión
3. Crea un nuevo cluster:
   - Click en "Build a Database"
   - Selecciona "FREE" (M0 Sandbox)
   - Elige una región cercana (ej: AWS / N. Virginia)
   - Nombre del cluster: `vinq-cluster`
4. Configura Database Access:
   - Database Access → Add New Database User
   - Authentication Method: Password
   - Username: `vinq_admin`
   - Password: **Genera una contraseña segura y guárdala**
   - Database User Privileges: `Read and write to any database`
   - Click "Add User"
5. Configura Network Access:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. Obtén la Connection String:
   - Clusters → Connect → Connect your application
   - Driver: Node.js, Version: 5.5 or later
   - Copia el connection string
   - Reemplaza `<password>` con tu contraseña
   - Ejemplo: `mongodb+srv://vinq_admin:TU_PASSWORD@vinq-cluster.xxxxx.mongodb.net/vinq-crm?retryWrites=true&w=majority`

### 2. Generar JWT Secrets (1 minuto)

Ejecuta estos comandos en tu terminal para generar secrets seguros:

```bash
# JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"

# JWT Refresh Secret
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
```

**Guarda ambos valores**, los necesitarás en el siguiente paso.

### 3. Deploy en Vercel (10-15 minutos)

#### Opción A: Dashboard de Vercel (Recomendado para primera vez)

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Sign Up" o "Log In" (usa tu cuenta de GitHub)
3. Click en "Add New..." → "Project"
4. Importa el repositorio:
   - Click en "Import Git Repository"
   - Busca `ElBeDev/vinq` en la lista
   - Click "Import"
5. Configura el proyecto:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (dejar como está)
   - **Build Command:** Dejar vacío (usa vercel.json)
   - **Output Directory:** Dejar vacío (usa vercel.json)
   - **Install Command:** `npm install`
6. **IMPORTANTE:** Antes de hacer deploy, configura las variables de entorno:
   - Click en "Environment Variables"
   - Agrega las siguientes variables (una por una):

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://vinq_admin:TU_PASSWORD@vinq-cluster.xxxxx.mongodb.net/vinq-crm?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secret_generado_en_paso_2
JWT_REFRESH_SECRET=tu_jwt_refresh_secret_generado_en_paso_2
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=https://tu-proyecto.vercel.app
VITE_API_URL=https://tu-proyecto.vercel.app/api/v1
```

   - **Nota:** Para `CLIENT_URL` y `VITE_API_URL`, usa el dominio temporal que Vercel te asignará. Lo verás después del primer deploy. Por ahora puedes dejar estos dos vacíos o poner un placeholder.

7. Click en "Deploy"
8. Espera 2-3 minutos
9. Una vez completado:
   - Copia la URL de tu proyecto (ej: `https://vinq-xxx.vercel.app`)
   - Ve a Settings → Environment Variables
   - Edita `CLIENT_URL` y `VITE_API_URL` con tu URL real
   - Ejemplo:
     - `CLIENT_URL=https://vinq-xxx.vercel.app`
     - `VITE_API_URL=https://vinq-xxx.vercel.app/api/v1`
10. **Redeploy** el proyecto:
    - Ve a Deployments
    - Click en el deployment más reciente
    - Click en los tres puntos (⋯)
    - Click "Redeploy"
    - Selecciona "Use existing Build Cache"
    - Click "Redeploy"

#### Opción B: CLI de Vercel (Para usuarios avanzados)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login a Vercel
vercel login

# Deploy desde la raíz del proyecto
cd /Users/bener/GitHub/VinQ

# Deployment inicial
vercel

# Configurar variables de entorno
vercel env add MONGO_URI production
# (pega tu connection string de MongoDB)

vercel env add JWT_SECRET production
# (pega tu JWT secret generado)

vercel env add JWT_REFRESH_SECRET production
# (pega tu JWT refresh secret generado)

# Agregar las demás variables...
vercel env add CLIENT_URL production
vercel env add VITE_API_URL production

# Deploy a producción
vercel --prod
```

### 4. Verificar el Deployment (2-3 minutos)

1. **Verificar Backend API:**
   ```bash
   curl https://tu-proyecto.vercel.app/api/health
   ```
   
   Deberías ver:
   ```json
   {
     "success": true,
     "message": "VinQ CRM API is running",
     "timestamp": "2024-...",
     "environment": "production"
   }
   ```

2. **Verificar Frontend:**
   - Abre en tu navegador: `https://tu-proyecto.vercel.app`
   - Deberías ver la página de Login del CRM

3. **Revisar Logs:**
   - En Vercel Dashboard → Tu Proyecto → Logs
   - Verifica que no haya errores

### 5. Crear Usuario Admin Inicial (2 minutos)

Usa curl, Postman, o Thunder Client para crear el primer usuario:

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

Deberías recibir:
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

### 6. Iniciar Sesión y Probar (5 minutos)

1. Abre tu CRM: `https://tu-proyecto.vercel.app`
2. Inicia sesión con las credenciales del admin
3. Verifica que el Dashboard cargue correctamente
4. Prueba crear un Lead de prueba
5. Prueba crear un Contacto de prueba

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que la IP 0.0.0.0/0 esté permitida en MongoDB Atlas
- Verifica que el connection string esté correcto
- Verifica que la contraseña no tenga caracteres especiales sin escapar

### Error: "CORS policy blocked"
- Verifica que `CLIENT_URL` en las variables de entorno coincida con tu dominio de Vercel
- Redeploy el proyecto después de cambiar variables

### Error: "Environment variables not defined"
- Asegúrate de que todas las variables estén configuradas en Vercel
- Redeploy el proyecto

### Frontend no carga
- Revisa los logs en Vercel Dashboard → Functions
- Verifica que `VITE_API_URL` esté configurado correctamente
- Haz un hard refresh (Cmd+Shift+R en Mac, Ctrl+Shift+R en Windows)

### Backend no responde
- Revisa los logs en Vercel Dashboard → Functions
- Verifica que MongoDB esté accesible
- Verifica que todas las variables de entorno estén configuradas

---

## 📱 Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio (ej: `crm.tuempresa.com`):

1. Vercel Dashboard → Tu Proyecto → Settings → Domains
2. Click "Add"
3. Ingresa tu dominio: `crm.tuempresa.com`
4. Vercel te mostrará los registros DNS que debes configurar
5. En tu proveedor de dominios (GoDaddy, Namecheap, etc.):
   - Agrega un registro CNAME apuntando a `cname.vercel-dns.com`
6. Espera 5-10 minutos para la propagación DNS
7. Actualiza las variables de entorno:
   - `CLIENT_URL=https://crm.tuempresa.com`
   - `VITE_API_URL=https://crm.tuempresa.com/api/v1`
8. Redeploy el proyecto

---

## 🎉 ¡Listo!

Tu CRM VinQ está ahora en producción y accesible desde cualquier lugar.

**URLs importantes:**
- **CRM:** https://tu-proyecto.vercel.app
- **API Health:** https://tu-proyecto.vercel.app/api/health
- **API Docs:** https://tu-proyecto.vercel.app/api/v1
- **GitHub:** https://github.com/ElBeDev/vinq
- **Vercel Dashboard:** https://vercel.com/dashboard

**Próximos pasos opcionales:**
- [ ] Configurar dominio personalizado
- [ ] Integrar servicio de email (SendGrid/Resend)
- [ ] Configurar storage de archivos (Cloudinary/AWS S3)
- [ ] Agregar monitoring (Sentry)
- [ ] Configurar backups automáticos de MongoDB

---

## 📞 Soporte

Si tienes problemas:
1. Revisa [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Revisa los logs en Vercel Dashboard
3. Abre un issue en GitHub: https://github.com/ElBeDev/vinq/issues

¡Buena suerte! 🚀
