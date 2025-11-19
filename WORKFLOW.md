# VinQ CRM - Workflow del Proyecto

## 🎯 Objetivo
Crear un CRM completo tipo Zoho especializado en **bienes raíces**, con gestión de leads, ventas de propiedades, panel de administración y sistema de login robusto.

---

## 📋 Módulos Principales del Sistema

### 1. **Sistema de Autenticación y Autorización**
- Login/Registro de usuarios
- Autenticación JWT
- Roles y permisos (Admin, Vendedor, Manager, etc.)
- Recuperación de contraseña
- Sesiones y tokens de refresco

### 2. **Panel de Administración**
- Gestión de usuarios (CRUD)
- Asignación de roles y permisos
- Configuración del sistema
- Auditoría de acciones
- Estadísticas generales del sistema

### 3. **Módulo de Leads**
- Captura de leads (formularios web, importación)
- Información detallada del prospecto
- Estado del lead (nuevo, contactado, calificado, convertido, perdido)
- Asignación de leads a vendedores
- Seguimiento de actividades (llamadas, emails, reuniones)
- Notas y comentarios
- Historial de interacciones

### 4. **Módulo de Ventas (Bienes Raíces)**
- **Gestión de Propiedades:**
  - Catálogo de propiedades (casas, departamentos, terrenos, locales)
  - Información detallada (ubicación, precio, características, fotos)
  - Estado de la propiedad (disponible, reservada, vendida)
  - Documentos asociados
  
- **Gestión de Oportunidades:**
  - Pipeline de ventas (etapas personalizables)
  - Vincular propiedades con clientes interesados
  - Cotizaciones y propuestas
  - Seguimiento del proceso de cierre
  - Probabilidad de cierre y valor estimado
  
- **Contactos y Cuentas:**
  - Información de clientes potenciales y actuales
  - Empresas/desarrolladoras asociadas
  - Historial de transacciones

### 5. **Gestión de Actividades**
- Tareas pendientes
- Calendario de reuniones
- Recordatorios automáticos
- Registro de llamadas
- Envío de emails desde el sistema
- Notas y seguimiento

### 6. **Reportes y Analítica**
- Dashboard con KPIs principales
- Reportes de ventas (por vendedor, por periodo, por propiedad)
- Conversión de leads
- Análisis de embudo de ventas
- Reportes personalizados
- Exportación de datos (Excel, PDF)

### 7. **Automatización** (Preparado para implementar)
- Workflows automáticos
- Reglas de negocio
- Asignación automática de leads
- Notificaciones y alertas
- Recordatorios programados
- Emails automáticos

### 8. **Marketing** (Preparado para implementar)
- Campañas de email marketing
- Segmentación de contactos
- Landing pages para captura de leads
- Integración con redes sociales
- Tracking de conversiones

### 9. **Integraciones** (Preparado para implementar)
- WhatsApp Business API
- Email (Gmail, Outlook)
- Calendario (Google Calendar, Outlook)
- Portales inmobiliarios
- Sistemas de pago
- Webhooks personalizados

---

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico**

#### Frontend
- **Framework:** React 18+
- **Lenguaje:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Redux Toolkit / Zustand
- **UI Components:** Material-UI (MUI) / Ant Design / Tailwind CSS
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Auth:** JWT Storage + Context API

#### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** Mongoose (MongoDB) / Prisma (PostgreSQL)
- **Auth:** JWT + bcrypt
- **Validation:** Joi / Zod
- **File Upload:** Multer / Cloudinary
- **Email:** Nodemailer

#### Base de Datos
- **Principal:** MongoDB (flexibilidad para CRM)
- **Alternativa:** PostgreSQL (relacional)
- **Cache:** Redis (sesiones, tokens)

#### Infraestructura
- **Container:** Docker + Docker Compose
- **Environment:** dotenv
- **API Docs:** Swagger / OpenAPI
- **Testing:** Jest + Supertest (backend), Vitest + Testing Library (frontend)

---

## 📁 Estructura del Proyecto

```
VinQ/
├── backend/                    # API REST con Express + TypeScript
│   ├── src/
│   │   ├── config/            # Configuración (DB, JWT, etc.)
│   │   ├── controllers/       # Controladores por módulo
│   │   ├── models/            # Modelos de datos (Mongoose/Prisma)
│   │   ├── routes/            # Rutas de la API
│   │   ├── middlewares/       # Auth, validación, error handling
│   │   ├── services/          # Lógica de negocio
│   │   ├── utils/             # Helpers y utilidades
│   │   ├── types/             # Tipos TypeScript
│   │   └── server.ts          # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # Aplicación React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas/vistas por módulo
│   │   │   ├── Auth/          # Login, registro
│   │   │   ├── Dashboard/     # Panel principal
│   │   │   ├── Admin/         # Panel de administración
│   │   │   ├── Leads/         # Gestión de leads
│   │   │   ├── Sales/         # Módulo de ventas
│   │   │   ├── Properties/    # Catálogo de propiedades
│   │   │   └── Reports/       # Reportes
│   │   ├── layouts/           # Layouts (sidebar, navbar)
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Llamadas a la API
│   │   ├── store/             # Estado global (Redux/Zustand)
│   │   ├── utils/             # Helpers
│   │   ├── types/             # Tipos TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docker-compose.yml          # Orquestación de servicios
├── .gitignore
├── README.md
└── WORKFLOW.md                 # Este archivo
```

---

## 🚀 Fases de Desarrollo

### **Fase 1: Setup Inicial** ✅
- [x] Crear estructura de carpetas
- [x] Configurar backend (Express + TypeScript)
- [x] Configurar frontend (React + Vite + TypeScript)
- [x] Configurar Docker y Docker Compose
- [x] Conectar a MongoDB
- [x] Setup básico de variables de entorno
- [x] Instalación de dependencias (backend: 651 paquetes, frontend: 420 paquetes)
- [x] Configuración de scripts de desarrollo y build
- [x] Compilación exitosa de TypeScript en ambos proyectos

### **Fase 2: Autenticación y Autorización** ✅
- [x] Modelo de Usuario con roles (admin, manager, agent, user)
- [x] Registro e inicio de sesión (JWT)
- [x] Middleware de autenticación (protect)
- [x] Middleware de autorización (authorize)
- [x] Protección de rutas en frontend
- [x] Sistema de permisos por rol
- [x] Refresh tokens implementados
- [x] Zustand store para estado de autenticación
- [x] Interceptores de Axios para manejo automático de tokens

### **Fase 3: Panel de Administración** ✅
- [x] CRUD de usuarios
- [x] Gestión de roles y permisos
- [x] Panel de configuración básico
- [x] UI del panel de administración con tabs
- [ ] Logs de auditoría (pendiente implementar)

### **Fase 4: Módulo de Leads** ✅
- [x] Modelo y CRUD de leads
- [x] Formulario de captura de leads
- [x] Estados y pipeline de leads (new, contacted, qualified, converted, lost)
- [x] Asignación de leads a vendedores
- [x] Seguimiento y actividades (array de actividades con tipos)
- [x] Conversión de lead a oportunidad
- [x] UI completa para gestión de leads
- [x] Filtros por estado y vendedor asignado

### **Fase 5: Módulo de Ventas (Bienes Raíces)** ✅
- [x] Modelo de Propiedades (CRUD completo)
- [x] Catálogo de propiedades con filtros (tipo, estado, rango de precio)
- [x] Modelo de Oportunidades
- [x] Pipeline de ventas personalizable (6 etapas: prospecting → closed-won/lost)
- [x] Sistema de probabilidad por etapa
- [x] UI para gestión de propiedades
- [x] UI para gestión de oportunidades
- [x] Vinculación de propiedades con clientes
- [ ] Cotizaciones y propuestas (pendiente)
- [ ] Proceso de cierre formal (pendiente)

### **Fase 6: Gestión de Actividades** ✅
- [x] Tareas y recordatorios (estructura completa)
- [x] Calendario de eventos (modelo preparado)
- [x] Registro de llamadas
- [x] Sistema de notas
- [x] Emails (estructura para tracking)
- [x] 5 tipos de actividades implementados
- [x] Sistema de prioridades y estados
- [x] Vinculación con entidades
- [x] Vista "Hoy" y "Pendientes"

### **Fase 7: Reportes y Analítica** 📊
- [ ] Dashboard con KPIs
- [ ] Reportes de ventas
- [ ] Análisis de conversión
- [ ] Gráficas y visualizaciones
- [ ] Exportación de datos

### **Fase 8: Automatización** (Futuro)
- [ ] Workflows automáticos
- [ ] Reglas de asignación
- [ ] Emails automáticos
- [ ] Notificaciones push

### **Fase 9: Marketing** (Futuro)
- [ ] Campañas de email
- [ ] Landing pages
- [ ] Segmentación avanzada

### **Fase 10: Integraciones** (Futuro)
- [ ] WhatsApp Business
- [ ] Integraciones de email
- [ ] Portales inmobiliarios
- [ ] APIs externas

---

## 🔑 Funcionalidades Clave por Rol

### **Administrador**
- Acceso total al sistema
- Gestión de usuarios y roles
- Configuración del sistema
- Ver todos los módulos y reportes
- Auditoría completa

### **Manager/Gerente**
- Ver y gestionar su equipo
- Asignar leads y propiedades
- Acceso a reportes de su equipo
- Aprobar cotizaciones
- Configurar workflows

### **Vendedor/Agente**
- Gestionar sus leads asignados
- Ver catálogo de propiedades
- Crear oportunidades
- Registrar actividades
- Generar cotizaciones
- Actualizar estado de ventas

### **Usuario Básico**
- Ver información limitada
- Registrar actividades básicas

---

## 🎨 Características de UX/UI

1. **Dashboard Personalizado por Rol**
   - KPIs relevantes según el usuario
   - Acceso rápido a tareas pendientes
   - Notificaciones en tiempo real

2. **Navegación Intuitiva**
   - Sidebar con módulos principales
   - Breadcrumbs para ubicación
   - Búsqueda global

3. **Responsive Design**
   - Adaptable a móviles y tablets
   - Modo oscuro/claro

4. **Interactividad**
   - Drag & drop para pipeline
   - Filtros avanzados
   - Búsqueda y autocompletado

---

## 🔐 Seguridad

- Autenticación JWT con tokens de refresco
- Encriptación de contraseñas con bcrypt
- Validación de datos en backend y frontend
- Protección contra SQL Injection / NoSQL Injection
- Rate limiting en la API
- CORS configurado correctamente
- Variables de entorno para secretos
- Logs de auditoría

---

## 📝 Notas Importantes

1. **Escalabilidad:** El diseño modular permite agregar nuevos módulos fácilmente
2. **Personalización:** Campos y vistas configurables por el admin
3. **Multi-tenant:** Preparado para soportar múltiples empresas en el futuro
4. **API First:** Backend diseñado como API REST para futuras integraciones

---

## 🎯 Próximos Pasos Inmediatos

1. Completar setup del proyecto
2. Implementar sistema de autenticación
3. Crear panel de admin básico
4. Desarrollar módulo de leads
5. Implementar módulo de ventas con propiedades

---

## 📊 Estado Actual del Proyecto

### ✅ Completado (Noviembre 19, 2025)

**Backend:**
- ✅ 27 endpoints REST implementados
- ✅ 5 controladores (auth, user, lead, property, opportunity)
- ✅ 4 modelos de datos con Mongoose
- ✅ Middleware de autenticación JWT con refresh tokens
- ✅ Middleware de autorización por roles
- ✅ Error handling centralizado
- ✅ Rate limiting y seguridad (helmet, CORS)
- ✅ Script de seed con datos de prueba
- ✅ Compilación de TypeScript sin errores
- ✅ Servidor corriendo en puerto 5000

**Frontend:**
- ✅ 7 páginas implementadas (Login, Register, Dashboard, Leads, Properties, Opportunities, Admin)
- ✅ Layout principal con sidebar y navegación
- ✅ Zustand store con persistencia
- ✅ Axios client con interceptores
- ✅ Material-UI como sistema de diseño
- ✅ Protección de rutas por autenticación
- ✅ Compilación de TypeScript sin errores
- ✅ Servidor de desarrollo corriendo en puerto 5173

**Base de Datos:**
- ✅ MongoDB conectado y operativo
- ✅ 4 usuarios de prueba (1 admin, 1 manager, 2 agentes)
- ✅ 3 propiedades de ejemplo
- ✅ 3 leads de prueba
- ✅ 2 oportunidades activas

### 🎯 Próximas Funcionalidades a Implementar

**Prioridad Alta:**
1. **Sistema de Actividades Completo**
   - Calendario integrado
   - Tareas y recordatorios
   - Registro de llamadas desde UI
   - Envío de emails desde el sistema

2. **Mejoras en Oportunidades**
   - Generación de cotizaciones
   - Templates de propuestas
   - Proceso de cierre con documentación
   - Firma electrónica

3. **Dashboard Mejorado**
   - Gráficas de ventas
   - Métricas en tiempo real
   - Filtros por periodo
   - Comparativas

**Prioridad Media:**
4. **Gestión de Documentos**
   - Upload de archivos (fotos de propiedades, documentos legales)
   - Cloudinary o S3 integration
   - Galería de imágenes

5. **Notificaciones**
   - Sistema de notificaciones en tiempo real
   - Alertas por email
   - Notificaciones push

6. **Búsqueda Avanzada**
   - Búsqueda global en el sistema
   - Filtros avanzados por múltiples criterios
   - Guardado de búsquedas favoritas

**Prioridad Baja:**
7. **Logs de Auditoría**
   - Registro de todas las acciones
   - Historial de cambios
   - Reportes de auditoría

8. **Reportes Avanzados**
   - Reportes personalizables
   - Exportación a Excel/PDF
   - Programación de reportes automáticos

---

**Fecha de inicio:** Noviembre 19, 2025  
**Última actualización:** Noviembre 19, 2025  
**Proyecto:** VinQ CRM  
**Tipo:** Sistema CRM para Bienes Raíces  
**Estado:** 🟢 Sistema base operativo - Listo para expansión de funcionalidades
