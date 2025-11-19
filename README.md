# VinQ CRM - Sistema de Gestión de Bienes Raíces

🏠 **CRM completo especializado en bienes raíces**, similar a Zoho CRM, con módulos de ventas, leads, propiedades, oportunidades y administración.

## 🚀 Características Principales

### ✅ Implementado
- Sistema de autenticación JWT (login/registro)
- Gestión de usuarios con roles (admin, manager, agent, user)
- CRUD completo de Leads
- CRUD completo de Propiedades
- CRUD completo de Oportunidades de venta
- Panel de administración
- Dashboard con estadísticas
- API REST documentada
- Interfaz responsive con Material-UI

### 📋 Módulos del Sistema

1. **Autenticación y Autorización**
   - Login y registro
   - Roles y permisos
   - Tokens JWT con refresh

2. **Gestión de Leads**
   - Captura y seguimiento de prospectos
   - Estados del lead
   - Asignación a agentes
   - Registro de actividades
   - Conversión a oportunidad

3. **Catálogo de Propiedades**
   - Gestión de inmuebles (casas, departamentos, terrenos, locales)
   - Información detallada y multimedia
   - Estados (disponible, reservada, vendida)
   - Filtros de búsqueda

4. **Pipeline de Ventas**
   - Oportunidades de venta
   - Etapas personalizables
   - Probabilidad de cierre
   - Seguimiento de actividades

5. **Panel de Administración**
   - Gestión de usuarios
   - Configuración del sistema
   - Auditoría

## 🛠️ Stack Tecnológico

### Backend
- Node.js 20+
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt para contraseñas

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Router v6
- Zustand (state management)
- Axios
- React Hook Form + Zod

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 20 o superior
- MongoDB 7 o superior
- npm o yarn

### 1. Clonar el repositorio
\`\`\`bash
git clone <repository-url>
cd VinQ
\`\`\`

### 2. Configurar Backend

\`\`\`bash
cd backend
npm install
\`\`\`

Crear archivo \`.env\` basado en \`.env.example\`:

\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vinq-crm
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
\`\`\`

### 3. Configurar Frontend

\`\`\`bash
cd frontend
npm install
\`\`\`

Crear archivo \`.env\` basado en \`.env.example\`:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=VinQ CRM
\`\`\`

### 4. Iniciar MongoDB

Si tienes MongoDB instalado localmente:
\`\`\`bash
mongod
\`\`\`

O usa Docker:
\`\`\`bash
docker run -d -p 27017:27017 --name mongodb mongo:7
\`\`\`

### 5. Ejecutar la aplicación

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🐳 Docker (Alternativa)

Para ejecutar todo con Docker Compose:

\`\`\`bash
docker-compose up
\`\`\`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/refresh-token` - Refrescar token

### Usuarios
- `GET /api/users` - Listar usuarios (admin/manager)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Desactivar usuario (admin)

### Leads
- `GET /api/leads` - Listar leads
- `POST /api/leads` - Crear lead
- `GET /api/leads/:id` - Obtener lead
- `PUT /api/leads/:id` - Actualizar lead
- `DELETE /api/leads/:id` - Eliminar lead
- `POST /api/leads/:id/activities` - Agregar actividad
- `POST /api/leads/:id/convert` - Convertir a oportunidad

### Propiedades
- `GET /api/properties` - Listar propiedades
- `POST /api/properties` - Crear propiedad
- `GET /api/properties/:id` - Obtener propiedad
- `PUT /api/properties/:id` - Actualizar propiedad
- `DELETE /api/properties/:id` - Eliminar propiedad

### Oportunidades
- `GET /api/opportunities` - Listar oportunidades
- `POST /api/opportunities` - Crear oportunidad
- `GET /api/opportunities/:id` - Obtener oportunidad
- `PUT /api/opportunities/:id` - Actualizar oportunidad
- `DELETE /api/opportunities/:id` - Eliminar oportunidad
- `POST /api/opportunities/:id/activities` - Agregar actividad
- `PATCH /api/opportunities/:id/stage` - Cambiar etapa

## 👥 Roles y Permisos

- **Admin**: Acceso total al sistema
- **Manager**: Gestión de equipo y visualización amplia
- **Agent**: Gestión de sus propios leads y oportunidades
- **User**: Acceso limitado

## 📖 Workflow del Proyecto

Consulta el archivo `WORKFLOW.md` para ver el plan completo de desarrollo, arquitectura y roadmap del proyecto.

## 🔒 Seguridad

- Autenticación JWT
- Contraseñas hasheadas con bcrypt
- Rate limiting en API
- CORS configurado
- Validación de datos
- Roles y permisos

## 🚧 Próximas Funcionalidades

- [ ] Reportes y analítica avanzada
- [ ] Automatización de workflows
- [ ] Módulo de marketing
- [ ] Integraciones (WhatsApp, Email, etc.)
- [ ] Notificaciones en tiempo real
- [ ] Carga de archivos (Cloudinary)
- [ ] Sistema de tareas y calendario

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📝 Licencia

MIT

## 👨‍💻 Autor

VinQ Team - 2025
