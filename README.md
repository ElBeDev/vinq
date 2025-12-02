# VinQ CRM - Sistema de Gestión para Bienes Raíces

<div align="center">
  <h1>🏢 VinQ CRM</h1>
  <p><strong>Sistema CRM completo estilo Zoho especializado en Bienes Raíces</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-18.2-blue?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js" alt="Node.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-5.0-green?logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Ant_Design-5.12-blue?logo=ant-design" alt="Ant Design" />
  </p>
</div>

---

## 📋 Descripción

VinQ CRM es un sistema completo de gestión de relaciones con clientes (CRM) diseñado específicamente para el sector inmobiliario. Replica el diseño y funcionalidades de Zoho CRM, adaptado para la gestión de propiedades, leads, contactos, cuentas, oportunidades de venta y más.

## ✨ Características Principales

### 🎯 Módulos del Sistema
- **Dashboard** - Vista personalizada con KPIs y gráficas
- **Leads** - Gestión de prospectos con conversión automatizada
- **Contactos** - Gestión de personas individuales
- **Cuentas** - Gestión de empresas y organizaciones
- **Deals** - Pipeline de ventas visual con drag & drop
- **Productos** - Catálogo de propiedades inmobiliarias
- **Cotizaciones** - Generación de cotizaciones con PDF
- **Actividades** - Tareas, eventos, llamadas, emails
- **Reportes** - Reportes predefinidos y personalizables
- **Automatización** - Workflows y reglas automáticas

### 🎨 Diseño Visual
- Interfaz inspirada en Zoho CRM
- Paleta de colores profesional (#1C4BDE)
- Componentes Ant Design personalizados
- Responsive y mobile-friendly
- Sidebar colapsable
- Top navbar con búsqueda global

### 🔐 Seguridad
- Autenticación JWT con refresh tokens
- Roles y permisos granulares (Admin, Manager, Agente, Usuario)
- Rate limiting
- Protección CORS y Helmet
- Validación con Zod
- Logs de auditoría

## 🏗️ Arquitectura

### Backend (Node.js + Express + TypeScript)
```
backend/
├── src/
│   ├── config/         # Configuraciones
│   ├── controllers/    # Controladores
│   ├── middlewares/    # Middlewares
│   ├── models/         # Modelos MongoDB
│   ├── routes/         # Rutas API
│   ├── services/       # Lógica de negocio
│   ├── utils/          # Utilidades
│   └── server.ts       # Punto de entrada
```

### Frontend (React + Vite + TypeScript)
```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas por módulo
│   ├── layouts/        # Layouts
│   ├── services/       # API services
│   ├── store/          # Zustand stores
│   ├── styles/         # Tema y estilos
│   └── types/          # Tipos TypeScript
```

## 🚀 Instalación y Deployment

### 🌐 Deployment en Vercel (Producción)

**Deploy en 1 click:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ElBeDev/vinq)

O sigue la guía completa: [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# Deployment rápido con script
./deploy.sh

# O manualmente
vercel --prod
```

**Pre-requisitos para producción:**
- Cuenta en [Vercel](https://vercel.com)
- MongoDB Atlas (gratis hasta 512MB)
- Variables de entorno configuradas

### 💻 Desarrollo Local
### Prerequisitos
- Node.js 20+
- PostgreSQL 16+ (o cuenta gratuita en [Neon](https://neon.tech))
- npm o yarn
- npm o yarn

#### 1. Clonar el repositorio
```bash
git clone https://github.com/ElBeDev/vinq.git
cd vinq
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env y agrega tu DATABASE_URL de Neon

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Iniciar servidor
npm run dev
```
#### 4. Usando Docker Compose (Recomendado para desarrollo)
```bash
# En la raíz del proyecto
docker-compose up -d postgres redis

# Ejecutar migraciones
cd backend
npx prisma migrate dev
```

**Servicios disponibles:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **PostgreSQL:** localhost:5432
- **Redis:** localhost:6379

**📘 Guías de Setup:**
- **Desarrollo Local**: [SETUP.md](./SETUP.md)
- **Deploy en Vercel**: [DEPLOYMENT_NEON.md](./DEPLOYMENT_NEON.md)se (Recomendado para desarrollo)
```bash
# En la raíz del proyecto
docker-compose up -d
```

**Servicios disponibles:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

## 📖 Documentación

### Backend API
- **Health Check:** `GET /health`
- **API Info:** `GET /api/v1`

#### Endpoints de Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh-token` - Refrescar token
- `POST /api/v1/auth/forgot-password` - Solicitar reset de contraseña
- `POST /api/v1/auth/reset-password/:token` - Resetear contraseña
- `GET /api/v1/auth/me` - Obtener usuario actual

#### Endpoints del Dashboard
- `GET /api/v1/dashboard/stats` - Estadísticas generales
- `GET /api/v1/dashboard/kpis` - KPIs por rol
- `GET /api/v1/dashboard/recent-activity` - Actividad reciente
- `GET /api/v1/dashboard/charts` - Datos para gráficas
- `GET /api/v1/dashboard/upcoming` - Próximas tareas/eventos

#### Endpoints de Leads
- `GET /api/v1/leads` - Obtener leads con filtros y paginación
- `POST /api/v1/leads` - Crear nuevo lead
- `GET /api/v1/leads/stats` - Estadísticas de leads
- `GET /api/v1/leads/:id` - Obtener lead por ID
- `PUT /api/v1/leads/:id` - Actualizar lead
- `DELETE /api/v1/leads/:id` - Eliminar lead
#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://usuario:password@host:5432/vinq_crm?sslmode=require
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CLIENT_URL=http://localhost:5173
```GET /api/v1/contacts/:id` - Obtener contacto por ID
- `PATCH /api/v1/contacts/:id` - Actualizar contacto
- `DELETE /api/v1/contacts/:id` - Eliminar contacto (Admin/Manager)
- `DELETE /api/v1/contacts/bulk` - Eliminar múltiples contactos (Admin/Manager)
- `PATCH /api/v1/contacts/:id/assign` - Asignar contacto a usuario (Admin/Manager)
- `PATCH /api/v1/contacts/:id/link-account` - Vincular contacto con Account
- `POST /api/v1/contacts/merge` - Merge de contactos duplicados (Admin/Manager)

### Variables de Entorno

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/vinq-crm
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🛣️ Roadmap

### ✅ Fase 1: Setup Inicial (Completado)
- [x] Estructura de proyecto
- [x] Backend con Express + TypeScript
- [x] Frontend con React + Vite + Ant Design
- [x] Docker Compose
- [x] Tema de colores Zoho
- [x] TopNavbar y Sidebar colapsable
- [x] Layouts y navegación

### ✅ Fase 2: Sistema de Autenticación (Completado)
- [x] Modelo de Usuario con roles
- [x] Login/Register con JWT
- [x] Refresh tokens (15min + 7 días)
- [x] Forgot/Reset Password
- [x] Middlewares requireAuth y requireRole
- [x] Protected routes en frontend
- [x] Token refresh automático
- [x] Validación con Zod

### ✅ Fase 3: Dashboard y Home (Completado)
- [x] Dashboard con KPIs dinámicos
- [x] Gráficas con Recharts
- [x] Activity Feed con timeline
- [x] Filtros de periodo
- [x] 5 endpoints de estadísticas
- [x] Loading states y manejo de errores

### ✅ Fase 4: Módulo de Leads (Completado)
- [x] Lead Model con 25+ campos
- [x] Enums: Status, Source, Rating
- [x] 9 endpoints (CRUD + bulk + assign + convert + stats)
- [x] LeadList con filtros avanzados
- [x] LeadForm create/edit con React Hook Form
- [x] LeadDetail con 4 tabs
- [x] Búsqueda en tiempo real
- [x] Acciones masivas
- [x] Validación frontend y backend

### ✅ Fase 5: Módulo de Contactos (Completado)
- [x] Contact Model con 30+ campos
- [x] Direcciones duales (mailing y other)
- [x] Vinculación con Accounts (ref)
- [x] Flag isPrimary para contacto principal
- [x] 10 endpoints (CRUD + bulk + assign + link + merge + stats)
- [x] ContactList con tabla de 9 columnas
- [x] ContactForm con 6 secciones
- [x] ContactDetail con 5 tabs
- [x] Redes sociales integradas (LinkedIn, Twitter, Facebook)
- [x] Merge de contactos duplicados
- [x] 12 métodos de API en contactService

### 🚧 Próximas Fases
- [ ] **Fase 6:** Módulo de Cuentas (Accounts)
- [ ] **Fase 6:** Módulo de Cuentas
- [ ] **Fase 7:** Módulo de Deals
- [ ] **Fase 8:** Módulo de Productos (Propiedades)
- [ ] **Fase 9:** Módulo de Cotizaciones
- [ ] **Fase 10:** Módulo de Actividades

Ver [WORKFLOW.md](./WORKFLOW.md) para el plan completo.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👥 Equipo

**VinQ Team** - [GitHub](https://github.com/tu-usuario)

## 📧 Contacto

Para preguntas o sugerencias, por favor abre un issue en GitHub.

---

<div align="center">
  <p>Hecho con ❤️ para el sector inmobiliario</p>
  <p>Inspirado en Zoho CRM</p>
</div>
