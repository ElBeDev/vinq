# VinQ CRM - Workflow del Proyecto

## 🎯 Objetivo
Crear un CRM completo **idéntico a Zoho CRM** especializado en **bienes raíces**, replicando su diseño visual, funcionalidades y experiencia de usuario. Sistema empresarial con gestión de leads, contactos, cuentas, oportunidades, productos (propiedades), cotizaciones, actividades, reportes y automatización.

---

## 🎨 Diseño Visual - Inspiración Zoho CRM

### **Paleta de Colores (Zoho Style)**
- **Primario:** `#1C4BDE` (Azul Zoho)
- **Secundario:** `#5C6AC4` (Púrpura)
- **Éxito:** `#28A745` (Verde)
- **Advertencia:** `#FFC107` (Amarillo)
- **Peligro:** `#DC3545` (Rojo)
- **Gris claro:** `#F8F9FA` (Fondos)
- **Gris medio:** `#6C757D` (Texto secundario)
- **Bordes:** `#E0E0E0`

### **Componentes UI - Estilo Zoho**
1. **Top Navbar:**
   - Barra superior blanca con sombra sutil
   - Logo VinQ a la izquierda
   - Búsqueda global centrada (con icono de lupa)
   - Iconos de notificaciones, ayuda y perfil a la derecha
   - Altura: 60px

2. **Sidebar Izquierdo:**
   - Fondo blanco con iconos azules
   - Hover con fondo gris claro
   - Módulos con iconos (Home, Leads, Contactos, Cuentas, Deals, etc.)
   - Colapsable con toggle
   - Ancho: 240px (expandido), 60px (colapsado)

3. **Vista de Lista (Módulos):**
   - Toolbar superior con: botón "Crear", filtros, vistas, búsqueda, acciones masivas
   - Tabla con checkboxes, columnas personalizables
   - Paginación inferior
   - Botones de acción por fila (editar, eliminar, más)
   - Vistas guardadas en tabs

4. **Vista de Detalle:**
   - Encabezado con nombre de registro y breadcrumb
   - Tabs horizontales (Overview, Timeline, Notes, Related, etc.)
   - Sidebar derecha con información clave y acciones rápidas
   - Secciones colapsables
   - Botones flotantes para editar/eliminar

5. **Formularios:**
   - Layout de 2 columnas
   - Secciones agrupadas con títulos
   - Campos con labels arriba
   - Validación en tiempo real
   - Botones de acción en footer fijo

6. **Dashboard:**
   - Grid de widgets drag & drop
   - Gráficas con estilo Zoho (colores consistentes)
   - Filtros de periodo en top right
   - KPIs en cards con iconos
   - Tablas de resumen

---

## 📋 Módulos Principales del Sistema (Estilo Zoho)

### 1. **Home / Dashboard**
- Vista personalizada por rol
- Widgets configurables (KPIs, gráficas, feeds)
- Accesos rápidos a acciones comunes
- Feeds de actividad reciente
- Próximas tareas y eventos

### 2. **Leads (Prospectos)**
- Captura desde formularios web, importación CSV, API
- Campos estándar: nombre, empresa, email, teléfono, fuente, estado
- Campos personalizados configurables
- Estados: Nuevo → Contactado → Calificado → Convertido/Descalificado
- Conversión a: Contacto + Cuenta + Deal (oportunidad)
- Reglas de puntuación de leads (lead scoring)
- Asignación automática por reglas
- Vista de lista con filtros y vistas guardadas
- Vista Kanban por estado
- Importación/Exportación masiva

### 3. **Contactos (Contacts)**
- Personas individuales (clientes potenciales y actuales)
- Información personal y profesional
- Vinculación con Cuentas (empresas)
- Historial de actividades
- Deals asociados
- Campos personalizados
- Vista de lista y kanban
- Integración con redes sociales (LinkedIn, Twitter)
- Detección de duplicados

### 4. **Cuentas (Accounts)**
- Empresas/Organizaciones
- Información corporativa (industria, tamaño, ubicación)
- Contactos relacionados
- Deals relacionados
- Jerarquía de cuentas (matriz-sucursales)
- Territorios de ventas
- Campos personalizados

### 5. **Deals (Oportunidades de Venta)**
- Pipeline visual con etapas drag & drop
- Etapas personalizables: Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost
- Probabilidad de cierre por etapa
- Monto estimado y fecha de cierre
- Productos asociados (propiedades)
- Competidores
- Documentos y cotizaciones
- Vista de lista, kanban y pipeline chart
- Pronóstico de ventas

### 6. **Productos (Propiedades Inmobiliarias)**
- Catálogo de propiedades
- Tipos: Casa, Departamento, Terreno, Local Comercial, Oficina
- Información detallada:
  - Ubicación (dirección, colonia, ciudad, estado)
  - Precio de venta/renta
  - Características (m², habitaciones, baños, estacionamiento)
  - Estado: Disponible, Reservada, Vendida, Rentada
  - Galería de imágenes
  - Tour virtual (URL)
  - Documentos legales
- Código único de propiedad
- Propietario/Desarrolladora (vinculado a Cuenta)
- Agente asignado
- Historial de cambios de precio
- Campos personalizados

### 7. **Cotizaciones (Quotes)**
- Generación de cotizaciones formales
- Vinculadas a Deal y Contacto
- Productos (propiedades) con precios
- Términos y condiciones
- Fecha de validez
- Estados: Draft → Sent → Accepted → Rejected → Closed
- Generación de PDF personalizable
- Templates de cotizaciones
- Aprobaciones por gerente
- Conversión a venta

### 8. **Actividades**
- **Tareas:**
  - Asignación, prioridad, fecha límite
  - Checklist de subtareas
  - Estados: No iniciada, En progreso, Completada, Cancelada
  - Vinculadas a cualquier módulo
  
- **Eventos:**
  - Reuniones, presentaciones, visitas
  - Invitación de participantes
  - Sincronización con Google/Outlook Calendar
  - Recordatorios
  
- **Llamadas:**
  - Registro de llamadas
  - Duración, resultado, notas
  - Grabación (opcional)
  
- **Emails:**
  - Envío desde el CRM
  - Tracking de apertura/clics
  - Templates
  - Historial completo

### 9. **Reportes y Analytics**
- **Reportes Predefinidos:**
  - Ventas por periodo
  - Conversión de leads
  - Pipeline de deals
  - Actividades por usuario
  - Rendimiento de equipo
  - Propiedades más vendidas
  
- **Reportes Personalizados:**
  - Constructor de reportes drag & drop
  - Filtros avanzados
  - Agrupaciones y totales
  - Gráficas personalizadas
  
- **Dashboards:**
  - Múltiples dashboards por rol/equipo
  - Widgets configurables
  - Compartir dashboards
  - Programar envío por email

### 10. **Automatización (Workflows)**
- Reglas de workflow:
  - Crear tarea automática
  - Enviar email
  - Actualizar campo
  - Crear notificación
  - Asignar registro
  - Llamar webhook
  
- Triggers:
  - Al crear registro
  - Al actualizar campo específico
  - Fecha/hora programada
  - Condiciones personalizadas
  
- Reglas de asignación:
  - Round robin
  - Por territorio
  - Por carga de trabajo
  - Por criterios personalizados
  
- Lead scoring automático

### 11. **Administración y Configuración**
- **Usuarios y Roles:**
  - Perfiles: Admin, Manager, Agente, Usuario estándar
  - Permisos granulares por módulo
  - Jerarquía de roles
  - Grupos y equipos
  
- **Personalización:**
  - Campos personalizados
  - Layouts personalizados
  - Módulos personalizados
  - Pestañas relacionadas
  
- **Configuración del sistema:**
  - Información de la empresa
  - Configuración de email
  - Territorios de venta
  - Monedas y conversiones
  - Zonas horarias
  
- **Importación/Exportación:**
  - CSV, Excel
  - Mapeo de campos
  - Validación de datos
  - Historial de importaciones
  
- **Auditoría:**
  - Logs de actividad
  - Historial de cambios
  - Login history
  - Exportación de auditoría

### 12. **Integraciones**
- Email (Gmail, Outlook, IMAP)
- Calendario (Google, Outlook)
- WhatsApp Business
- Portales inmobiliarios
- Sistemas de pago
- Zapier/Make (webhooks)
- API REST completa
- SDK de JavaScript

---

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico**

#### Frontend
- **Framework:** React 18+ con TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **State Management:** Zustand (simple y eficiente)
- **UI Components:** 
  - **Ant Design** (más parecido a Zoho)
  - Alternativa: Material-UI con customización
- **Formularios:** React Hook Form + Zod
- **Drag & Drop:** @dnd-kit/core
- **Gráficas:** Recharts (estilo Zoho)
- **Tablas:** TanStack Table v8 (anteriormente React Table)
- **Calendario:** FullCalendar
- **Editor de Texto:** Quill o TinyMCE
- **HTTP Client:** Axios con interceptores
- **Date Library:** date-fns
- **File Upload:** react-dropzone
- **PDF Generation:** jsPDF (cliente) + puppeteer (servidor)

#### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js con TypeScript
- **ORM:** Mongoose para MongoDB
- **Validación:** Zod (mismo que frontend)
- **Auth:** JWT + refresh tokens
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer con templates (Handlebars)
- **Real-time:** Socket.IO
- **PDF Server:** Puppeteer
- **Jobs/Cron:** node-cron
- **Rate Limiting:** express-rate-limit

#### Base de Datos
- **Principal:** MongoDB (flexibilidad para campos custom)
- **Estructura:**
  - Colecciones separadas por módulo
  - Referencias pobladas (populate)
  - Índices para búsquedas rápidas
  - Campos dinámicos con schema flexible

#### Infraestructura
- **Containerización:** Docker + Docker Compose
- **Servicios:**
  - Backend API (Node.js)
  - Frontend (Nginx en producción)
  - MongoDB
  - Redis (cache y sesiones)
- **Variables de entorno:** dotenv
- **Logging:** Winston
- **Monitoreo:** PM2 (producción)

---

## 📁 Estructura del Proyecto (Reorganizada)

```
VinQ/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   ├── jwt.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── email.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Lead.ts
│   │   │   ├── Contact.ts
│   │   │   ├── Account.ts
│   │   │   ├── Deal.ts
│   │   │   ├── Product.ts (Propiedades)
│   │   │   ├── Quote.ts
│   │   │   ├── Activity.ts
│   │   │   ├── Task.ts
│   │   │   ├── Event.ts
│   │   │   ├── Call.ts
│   │   │   ├── Email.ts
│   │   │   ├── Note.ts
│   │   │   ├── Notification.ts
│   │   │   ├── CustomField.ts
│   │   │   ├── Workflow.ts
│   │   │   └── AuditLog.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── leadController.ts
│   │   │   ├── contactController.ts
│   │   │   ├── accountController.ts
│   │   │   ├── dealController.ts
│   │   │   ├── productController.ts
│   │   │   ├── quoteController.ts
│   │   │   ├── activityController.ts
│   │   │   ├── dashboardController.ts
│   │   │   ├── reportController.ts
│   │   │   ├── workflowController.ts
│   │   │   ├── adminController.ts
│   │   │   └── searchController.ts
│   │   ├── routes/
│   │   │   └── [un archivo por módulo]
│   │   ├── middlewares/
│   │   │   ├── auth.ts (protect, authorize)
│   │   │   ├── validation.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── upload.ts
│   │   │   └── rateLimit.ts
│   │   ├── services/
│   │   │   ├── emailService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── workflowService.ts
│   │   │   ├── leadScoringService.ts
│   │   │   └── pdfService.ts
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── helpers.ts
│   │   │   └── constants.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── TopNavbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── NotificationBell.tsx
│   │   │   │   └── UserMenu.tsx
│   │   │   ├── ui/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── KanbanBoard.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Drawer.tsx
│   │   │   │   └── Chart.tsx
│   │   │   ├── forms/
│   │   │   │   ├── FormBuilder.tsx
│   │   │   │   ├── CustomFields.tsx
│   │   │   │   └── DynamicForm.tsx
│   │   │   └── widgets/
│   │   │       ├── KPICard.tsx
│   │   │       ├── ActivityFeed.tsx
│   │   │       └── MiniChart.tsx
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   └── ForgotPassword.tsx
│   │   │   ├── Home/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── Leads/
│   │   │   │   ├── LeadList.tsx
│   │   │   │   ├── LeadDetail.tsx
│   │   │   │   ├── LeadForm.tsx
│   │   │   │   └── LeadKanban.tsx
│   │   │   ├── Contacts/
│   │   │   │   ├── ContactList.tsx
│   │   │   │   ├── ContactDetail.tsx
│   │   │   │   └── ContactForm.tsx
│   │   │   ├── Accounts/
│   │   │   │   ├── AccountList.tsx
│   │   │   │   ├── AccountDetail.tsx
│   │   │   │   └── AccountForm.tsx
│   │   │   ├── Deals/
│   │   │   │   ├── DealList.tsx
│   │   │   │   ├── DealDetail.tsx
│   │   │   │   ├── DealForm.tsx
│   │   │   │   ├── DealPipeline.tsx
│   │   │   │   └── DealKanban.tsx
│   │   │   ├── Products/
│   │   │   │   ├── ProductList.tsx
│   │   │   │   ├── ProductDetail.tsx
│   │   │   │   └── ProductForm.tsx
│   │   │   ├── Quotes/
│   │   │   │   ├── QuoteList.tsx
│   │   │   │   ├── QuoteDetail.tsx
│   │   │   │   ├── QuoteForm.tsx
│   │   │   │   └── QuotePDF.tsx
│   │   │   ├── Activities/
│   │   │   │   ├── ActivityList.tsx
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── EventForm.tsx
│   │   │   │   └── CallForm.tsx
│   │   │   ├── Reports/
│   │   │   │   ├── ReportList.tsx
│   │   │   │   ├── ReportBuilder.tsx
│   │   │   │   ├── ReportView.tsx
│   │   │   │   └── DashboardBuilder.tsx
│   │   │   ├── Automation/
│   │   │   │   ├── WorkflowList.tsx
│   │   │   │   ├── WorkflowBuilder.tsx
│   │   │   │   └── RulesList.tsx
│   │   │   └── Admin/
│   │   │       ├── Users.tsx
│   │   │       ├── Roles.tsx
│   │   │       ├── CustomFields.tsx
│   │   │       ├── Layouts.tsx
│   │   │       ├── Settings.tsx
│   │   │       └── Import.tsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DetailLayout.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── useRealtime.ts
│   │   ├── services/
│   │   │   ├── api.ts (axios config)
│   │   │   ├── authService.ts
│   │   │   ├── leadService.ts
│   │   │   ├── contactService.ts
│   │   │   └── [servicios por módulo]
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── notificationStore.ts
│   │   │   └── uiStore.ts
│   │   ├── utils/
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   ├── theme.ts (colores Zoho)
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── WORKFLOW.md
```

---

## 🚀 Fases de Desarrollo (Empezando desde Cero)

### **Fase 1: Setup Inicial y Diseño Base** ✅
**Objetivo:** Proyecto limpio con diseño visual idéntico a Zoho

#### Backend Setup
- [x] Crear estructura de carpetas limpia
- [x] Configurar Express + TypeScript
- [x] Conectar MongoDB
- [x] Configurar variables de entorno
- [x] Setup de Docker Compose (MongoDB + Redis)
- [x] Middleware básico (CORS, helmet, rate-limit)
- [x] Error handling centralizado
- [x] Logger con Winston

#### Frontend Setup
- [x] Crear proyecto React + Vite + TypeScript
- [x] Instalar Ant Design (más parecido a Zoho)
- [x] Configurar tema personalizado con colores Zoho
- [x] Configurar Zustand para state management
- [x] Setup de React Router
- [x] Configurar Axios con interceptores
- [x] Crear estructura de carpetas

#### Diseño UI Base
- [x] Crear TopNavbar estilo Zoho
- [x] Crear Sidebar colapsable con iconos
- [x] Crear MainLayout con navbar + sidebar
- [x] Implementar tema de colores Zoho
- [x] Responsive design básico
- [x] Breadcrumbs component
- [x] Loading states y skeletons

**Duración estimada:** 3-4 días
**Estado:** ✅ COMPLETADA

---

### **Fase 2: Sistema de Autenticación** 🔐 ✅
**Objetivo:** Login/registro seguro con JWT

#### Backend
- [x] Modelo de Usuario con roles (ADMIN, MANAGER, AGENT)
- [x] Registro con validación Zod
- [x] Login con JWT + refresh token (15min + 7 días)
- [x] Middleware de autenticación (requireAuth)
- [x] Middleware de autorización (requireRole, requireAdmin)
- [x] Recuperación de contraseña (forgot/reset password)
- [x] Generación de tokens de reset con crypto
- [x] Schema de validación con Zod
- [x] Hash de contraseñas con bcrypt (salt rounds: 12)
- [x] Endpoint GET /me para obtener usuario actual
- [x] Rutas: /register, /login, /logout, /refresh-token, /forgot-password, /reset-password

#### Frontend
- [x] Página de Login (estilo Zoho) con React Hook Form
- [x] Página de Registro con validación
- [x] Página de Forgot Password con estado de éxito
- [x] Página de Reset Password con token en URL
- [x] AuthLayout con diseño Zoho
- [x] authStore con Zustand + persistencia
- [x] ProtectedRoute component con verificación de roles
- [x] Token refresh automático en interceptor
- [x] Manejo de sesiones expiradas con redirect
- [x] Schemas de validación Zod (frontend)
- [x] Integración completa con API
- [x] Mensajes de error/éxito con Ant Design
- [x] Checkbox "Recordarme" en login

#### Archivos Creados:
**Backend (6 archivos):**
- `src/models/User.ts` - Modelo con bcrypt y métodos
- `src/schemas/auth.schema.ts` - Validación con Zod
- `src/controllers/auth.controller.ts` - 7 endpoints
- `src/middlewares/auth.ts` - requireAuth, requireRole, requireAdmin
- `src/middlewares/validate.ts` - Middleware genérico de validación
- `src/routes/auth.routes.ts` - Rutas de autenticación

**Frontend (6 archivos):**
- `src/pages/Auth/Login.tsx` - Página de login
- `src/pages/Auth/Register.tsx` - Página de registro
- `src/pages/Auth/ForgotPassword.tsx` - Recuperar contraseña
- `src/pages/Auth/ResetPassword.tsx` - Nueva contraseña
- `src/schemas/auth.schema.ts` - Validación frontend
- `src/components/common/ProtectedRoute.tsx` - Protección de rutas

**Duración real:** 3 días
**Estado:** ✅ COMPLETADA

---

### **Fase 3: Dashboard y Home** 📊 ✅
**Objetivo:** Dashboard personalizado con widgets estilo Zoho

#### Backend
- [x] Endpoints de estadísticas generales
- [x] KPIs por rol
- [x] Actividad reciente
- [x] Próximas tareas/eventos
- [x] Filtros de periodo
- [x] Rutas protegidas con requireAuth

#### Frontend
- [x] Dashboard con grid de widgets
- [x] KPI Cards con iconos y tendencias
- [x] Gráficas con Recharts (estilo Zoho)
- [x] Activity Feed widget con timeline
- [x] MiniChart component (line, bar, pie)
- [x] Filtros de periodo (hoy, semana, mes, año)
- [x] Integración completa con API
- [x] Loading states y manejo de errores
- [x] Layout responsive

**Duración real:** 1 día
**Estado:** ✅ COMPLETADA

---

### **Fase 4: Módulo de Leads** 🎯
**Objetivo:** Gestión completa de leads estilo Zoho

#### Backend
- [ ] Modelo de Lead con campos estándar
- [ ] Soporte para campos personalizados
- [ ] CRUD completo
- [ ] Filtros avanzados
- [ ] Vistas guardadas
- [ ] Asignación de leads
- [ ] Conversión a Contact + Account + Deal
- [ ] Importación CSV
- [ ] Exportación Excel/CSV
- [ ] Detección de duplicados

#### Frontend
- [ ] LeadList con DataTable (Ant Design)
- [ ] Filtros y búsqueda avanzada
- [ ] Vistas guardadas (tabs)
- [ ] Acciones masivas (asignar, eliminar, exportar)
- [ ] LeadDetail con tabs (Overview, Timeline, Notes, Related)
- [ ] LeadForm (crear/editar)
- [ ] LeadKanban por estado
- [ ] Conversión wizard
- [ ] Import wizard

**Duración estimada:** 6-7 días

---

### **Fase 5: Módulo de Contactos** 👥
**Objetivo:** Gestión de contactos individuales

#### Backend
- [x] Modelo de Contact con 30+ campos
- [x] Relación con Accounts (ref)
- [x] Schemas de validación Zod (6 schemas)
- [x] CRUD completo
- [x] Filtros y búsquedas
- [x] Merge de duplicados
- [x] Asignación y vinculación con cuentas
- [x] Estadísticas de contactos

#### Frontend
- [x] ContactList con filtros
- [x] ContactDetail con tabs
- [x] ContactForm
- [x] Vinculación con Account
- [x] Timeline de actividades (placeholder)
- [x] Related Deals (placeholder)
- [x] Schemas y validaciones Zod
- [x] contactService con 12 métodos API

**Duración real:** 1 día
**Estado:** ✅ COMPLETADA

---

### **Fase 6: Módulo de Cuentas (Accounts)** 🏢
**Objetivo:** Gestión de empresas/organizaciones

#### Backend
- [ ] Modelo de Account
- [ ] Jerarquía de cuentas (parent-child)
- [ ] Relación con Contacts
- [ ] CRUD completo
- [ ] Territorios

#### Frontend
- [ ] AccountList
- [ ] AccountDetail con contacts relacionados
- [ ] AccountForm
- [ ] Jerarquía visual
- [ ] Territory management

**Duración estimada:** 4-5 días

---

### **Fase 7: Módulo de Deals (Oportunidades)** 💼
**Objetivo:** Pipeline de ventas completo

#### Backend
- [ ] Modelo de Deal
- [ ] Etapas personalizables
- [ ] Probabilidad por etapa
- [ ] Relación con Product/Contact/Account
- [ ] CRUD completo
- [ ] Pronóstico de ventas
- [ ] Competidores

#### Frontend
- [ ] DealList con filtros
- [ ] DealPipeline (visual con etapas)
- [ ] DealKanban (drag & drop entre etapas)
- [ ] DealDetail
- [ ] DealForm
- [ ] Forecast view
- [ ] Vinculación de productos

**Duración estimada:** 6-7 días

---

### **Fase 8: Módulo de Productos (Propiedades)** 🏠
**Objetivo:** Catálogo de propiedades inmobiliarias

#### Backend
- [ ] Modelo de Product (Property)
- [ ] Tipos de propiedad
- [ ] Características detalladas
- [ ] Galería de imágenes (Cloudinary)
- [ ] Documentos asociados
- [ ] Estados (disponible, reservada, vendida)
- [ ] Historial de precios
- [ ] CRUD completo

#### Frontend
- [ ] ProductList con filtros avanzados
- [ ] ProductDetail con galería
- [ ] ProductForm con upload de imágenes
- [ ] Vista de catálogo (grid)
- [ ] Mapas de ubicación (Google Maps/Mapbox)
- [ ] Tour virtual embed

**Duración estimada:** 5-6 días

---

### **Fase 9: Módulo de Cotizaciones (Quotes)** 📄
**Objetivo:** Generación de cotizaciones formales

#### Backend
- [ ] Modelo de Quote
- [ ] Vinculación con Deal/Contact
- [ ] Productos en cotización
- [ ] Cálculo de totales
- [ ] Estados de cotización
- [ ] Generación de PDF (Puppeteer)
- [ ] Templates personalizables
- [ ] Sistema de aprobaciones

#### Frontend
- [ ] QuoteList
- [ ] QuoteForm con builder de productos
- [ ] QuoteDetail
- [ ] Preview de PDF
- [ ] Download PDF
- [ ] Envío por email
- [ ] Estado tracking

**Duración estimada:** 5-6 días

---

### **Fase 10: Módulo de Actividades** 📅
**Objetivo:** Gestión de tareas, eventos, llamadas, emails

#### Backend
- [ ] Modelo de Task
- [ ] Modelo de Event
- [ ] Modelo de Call
- [ ] Modelo de Email
- [ ] Modelo de Note
- [ ] Vinculación con cualquier módulo
- [ ] Recordatorios automáticos (node-cron)
- [ ] CRUD para cada tipo

#### Frontend
- [ ] ActivityList unificada
- [ ] TaskForm con prioridad y fecha límite
- [ ] EventForm con invitados
- [ ] CallForm con registro
- [ ] EmailForm con templates
- [ ] Calendar view (FullCalendar)
- [ ] Timeline de actividades en detalles
- [ ] Filtros por tipo y estado

**Duración estimada:** 6-7 días

---

### **Fase 11: Reportes y Analytics** 📊
**Objetivo:** Sistema de reportes personalizables

#### Backend
- [ ] Endpoints de reportes predefinidos
- [ ] Query builder para reportes custom
- [ ] Agregaciones de MongoDB
- [ ] Exportación a Excel (exceljs)
- [ ] Exportación a PDF
- [ ] Programación de reportes

#### Frontend
- [ ] ReportList
- [ ] ReportBuilder (drag & drop)
- [ ] ReportView con gráficas
- [ ] Filtros avanzados
- [ ] Múltiples dashboards
- [ ] DashboardBuilder
- [ ] Compartir reportes
- [ ] Programar envíos

**Duración estimada:** 7-8 días

---

### **Fase 12: Automatización y Workflows** ⚙️
**Objetivo:** Automatización estilo Zoho

#### Backend
- [ ] Modelo de Workflow
- [ ] Motor de reglas
- [ ] Triggers (create, update, scheduled)
- [ ] Acciones (email, task, update, assign, webhook)
- [ ] Condiciones personalizadas
- [ ] Lead scoring automático
- [ ] Asignación automática por reglas
- [ ] Ejecución de workflows (node-cron)

#### Frontend
- [ ] WorkflowList
- [ ] WorkflowBuilder (visual)
- [ ] Trigger configuration
- [ ] Action builder
- [ ] Condition builder
- [ ] Testing de workflows
- [ ] Logs de ejecución

**Duración estimada:** 8-10 días

---

### **Fase 13: Administración y Configuración** ⚙️
**Objetivo:** Panel de admin completo

#### Backend
- [ ] Modelo de CustomField
- [ ] Modelo de Layout
- [ ] Gestión de roles y permisos
- [ ] Configuración del sistema
- [ ] Territorios
- [ ] Audit logs
- [ ] Importación masiva con validación
- [ ] Exportación masiva

#### Frontend
- [ ] Users management
- [ ] Roles & Permissions
- [ ] CustomFields builder
- [ ] Layout editor
- [ ] System settings
- [ ] Territory management
- [ ] Import wizard (CSV/Excel)
- [ ] Export center
- [ ] Audit logs viewer

**Duración estimada:** 7-8 días

---

### **Fase 14: Notificaciones y Comunicaciones** 🔔
**Objetivo:** Sistema de notificaciones en tiempo real

#### Backend
- [ ] Modelo de Notification
- [ ] Socket.IO setup
- [ ] Eventos de notificación
- [ ] Email notifications (Nodemailer)
- [ ] Templates de emails (Handlebars)
- [ ] Configuración SMTP

#### Frontend
- [ ] NotificationBell con badge
- [ ] Notification panel
- [ ] Real-time updates (Socket.IO)
- [ ] Configuración de preferencias
- [ ] Email notification settings

**Duración estimada:** 4-5 días

---

### **Fase 15: Búsqueda Global** 🔍
**Objetivo:** Búsqueda unificada en todos los módulos

#### Backend
- [ ] Endpoint de búsqueda global
- [ ] Búsqueda en múltiples colecciones
- [ ] Índices de MongoDB
- [ ] Búsqueda por texto
- [ ] Filtros inteligentes

#### Frontend
- [ ] SearchBar en navbar
- [ ] Resultados agrupados por módulo
- [ ] Navegación rápida
- [ ] Highlights en resultados
- [ ] Búsqueda con shortcuts (Cmd+K)

**Duración estimada:** 3-4 días

---

### **Fase 16: Integraciones** 🔌
**Objetivo:** Conectar con servicios externos

#### Backend
- [ ] Email integration (Gmail, Outlook IMAP)
- [ ] Calendar sync (Google Calendar API)
- [ ] WhatsApp Business API
- [ ] Webhooks system
- [ ] API REST pública con documentación
- [ ] Rate limiting por cliente

#### Frontend
- [ ] Integration settings
- [ ] OAuth flows
- [ ] Connected accounts
- [ ] Webhook configuration
- [ ] API keys management

**Duración estimada:** 10-12 días

---

### **Fase 17: Mobile Responsive & PWA** 📱
**Objetivo:** Experiencia móvil completa

- [ ] Responsive design en todos los módulos
- [ ] Mobile navigation
- [ ] Touch gestures
- [ ] PWA configuration
- [ ] Offline mode básico
- [ ] Push notifications móvil

**Duración estimada:** 6-7 días

---

### **Fase 18: Testing y Optimización** 🧪
**Objetivo:** Calidad y performance

- [ ] Unit tests (Backend con Jest)
- [ ] Integration tests
- [ ] E2E tests (Frontend con Playwright)
- [ ] Performance optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Security audit

**Duración estimada:** 7-10 días

---

## ⏱️ Timeline Estimado Total

**Duración total:** 100-120 días (4-5 meses)

**MVP (Funcional básico):** ~60 días (Fases 1-10)
**Sistema completo:** 100-120 días (Todas las fases)

---

## 🔑 Funcionalidades Clave por Rol

### **Administrador (Admin)**
- Acceso total al sistema
- Gestión de usuarios, roles y permisos
- Configuración del sistema completo
- Personalización de campos y layouts
- Gestión de workflows y automatización
- Ver todos los módulos y datos
- Auditoría completa
- Importación/exportación masiva
- Configuración de integraciones

### **Manager/Gerente de Ventas**
- Ver y gestionar su equipo
- Dashboard de rendimiento de equipo
- Asignar leads, deals y territorios
- Aprobar cotizaciones y descuentos
- Acceso a reportes de su equipo
- Configurar workflows de su área
- Ver pipeline completo de su equipo
- Pronóstico de ventas

### **Agente de Ventas/Vendedor**
- Ver sus leads, contacts, accounts y deals asignados
- Crear y gestionar oportunidades
- Registrar actividades (tareas, llamadas, reuniones)
- Generar cotizaciones
- Actualizar pipeline de ventas
- Ver catálogo de productos (propiedades)
- Dashboard personal con sus KPIs
- Calendario personal

### **Usuario Estándar**
- Ver información limitada
- Crear actividades básicas
- Ver reportes compartidos
- Sin permisos de edición/eliminación

---

## 🔐 Seguridad y Best Practices

- **Autenticación:** JWT con refresh tokens y expiración
- **Passwords:** Bcrypt con salt rounds
- **Validación:** Zod en backend y frontend
- **Protección XSS:** Sanitización de inputs
- **CSRF:** Tokens en formularios
- **Rate Limiting:** Por IP y por usuario
- **CORS:** Configurado correctamente
- **HTTPS:** En producción (obligatorio)
- **Variables de entorno:** Nunca en código
- **Permisos granulares:** Por módulo y acción
- **Audit logs:** Registro de todas las acciones críticas
- **Detección de duplicados:** Para evitar datos redundantes
- **Backups automáticos:** MongoDB con replicación

---

## 📝 Diferencias Clave vs la Versión Anterior

### ✅ Mejoras en esta nueva versión:

1. **Diseño Visual:**
   - Paleta de colores idéntica a Zoho
   - Componentes UI con estilo Zoho (navbar, sidebar, cards)
   - Ant Design en lugar de Material-UI (más cercano a Zoho)

2. **Arquitectura de Datos:**
   - Separación clara: Leads → Contacts + Accounts + Deals
   - Modelo de Product independiente
   - Campos personalizables dinámicos
   - Mejor estructura relacional

3. **Funcionalidades Nuevas:**
   - Módulo de Accounts (empresas)
   - Módulo de Contacts separado
   - Sistema de workflows visuales
   - Report builder personalizable
## 🎯 Estado Actual del Proyecto

**Fecha de inicio:** Diciembre 1, 2025  
**Última actualización:** Diciembre 2, 2025  
**Proyecto:** VinQ CRM (Versión 2.0 - Zoho Clone)  
**Tipo:** Sistema CRM para Bienes Raíces estilo Zoho  
**Estado:** 🚀 Fase 5 COMPLETADA - Módulo de Contactos con CRUD Completo

### Progreso Actual:
- ✅ **Fase 1:** Setup Inicial y Diseño Base (100%)
- ✅ **Fase 2:** Sistema de Autenticación (100%)
- ✅ **Fase 3:** Dashboard y Home (100%)
- ✅ **Fase 4:** Módulo de Leads (100%)
- ✅ **Fase 5:** Módulo de Contactos (100%) **COMPLETADA**

### Resumen Fase 4 (Módulo de Leads):
**Backend Implementado:**
- ✅ Lead Model (Lead.ts) con 25+ campos
- ✅ Enums: LeadStatus (6 valores), LeadSource (8 valores), LeadRating (3 valores)
- ✅ Validaciones con Mongoose y custom validators
- ✅ Índices de búsqueda de texto completo
- ✅ Schemas de validación con Zod (5 schemas)
- ✅ leadController.ts con 9 endpoints funcionales
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Búsqueda, filtrado, ordenamiento, paginación
- ✅ Bulk delete (eliminación masiva)
- ✅ Asignación de leads a usuarios
- ✅ Conversión de leads (a Contact/Account/Deal)
- ✅ Estadísticas de leads (agregaciones)
- ✅ Rutas protegidas con requireAuth y requireRole

**Frontend Implementado:**
- ✅ lead.schema.ts con validaciones Zod y TypeScript types
- ✅ leadService.ts con 10 métodos de API
- ✅ LeadList.tsx - Tabla completa con filtros
- ✅ LeadForm.tsx - Formulario create/edit con React Hook Form
- ✅ LeadDetail.tsx - Vista detallada con tabs
- ✅ Routing completo (/leads, /leads/new, /leads/:id, /leads/:id/edit)
- ✅ Filtros por estado, fuente, rating, assignedTo
- ✅ Búsqueda en tiempo real
- ✅ Selección múltiple y acciones masivas
- ✅ Status tags con colores (NEW, CONTACTED, QUALIFIED, etc.)
- ✅ Rating badges (HOT 🔥, WARM 🌡️, COLD ❄️)
- ✅ Paginación funcional
- ✅ Modal de confirmación para eliminar
- ✅ Loading states y manejo de errores
- ✅ Formulario con 7 secciones agrupadas
- ✅ Vista de detalle con 4 tabs (Resumen, Actividad, Notas, Relacionados)
- ✅ Conversión de leads a clientes
- ✅ Sidebar habilitado para navegación

**Características del Módulo de Leads:**
1. ✅ Modelo completo con 25+ campos (firstName, lastName, email, phone, mobile, company, title, industry, status, source, rating, score, ubicación, presupuesto, intereses, notas, conversión)
2. ✅ Estados del Lead: NEW → CONTACTED → QUALIFIED → UNQUALIFIED / CONVERTED / LOST
3. ✅ Fuentes: Website, Referral, Social Media, Email Campaign, Phone Call, Trade Show, Advertising, Other
4. ✅ Rating: HOT, WARM, COLD con colores distintivos
5. ✅ Score numérico (0-100) para calificación
6. ✅ Rangos de presupuesto (budgetMin, budgetMax)
7. ✅ Asignación a usuarios (assignedTo)
8. ✅ Tracking de conversión (convertedDate, convertedAccountId, convertedContactId, convertedDealId)
9. ✅ Búsqueda por texto completo (nombre, email, empresa)
10. ✅ Filtros avanzados y ordenamiento
11. ✅ Paginación con control de límite
12. ✅ Acciones masivas (eliminación múltiple)
13. ✅ Validación en frontend y backend con Zod
14. ✅ Manejo de errores consistente
15. ✅ Loading states en todas las operaciones

### Archivos Totales Creados:
**Fase 1:** 41 archivos
**Fase 2:** 12 archivos
**Fase 3:** 5 archivos
**Fase 4:** 10 archivos nuevos
**Total:** 68 archivos

### Archivos Creados en Fase 4:
**Backend (4 archivos):**
1. `src/models/Lead.ts` - Modelo Mongoose con ILead interface, enums, 25+ campos, validaciones
2. `src/schemas/lead.schema.ts` - 5 schemas Zod (createLead, updateLead, convertLead, assignLead, getLeads)
3. `src/controllers/lead.controller.ts` - 9 endpoints (CRUD + stats + bulk + convert + assign)
4. `src/routes/lead.routes.ts` - Rutas protegidas con auth y roles
5. `src/server.ts` - Actualizado para registrar rutas de leads

**Frontend (6 archivos):**
1. `src/schemas/lead.schema.ts` - Types TypeScript y Zod schema (Lead, LeadFormData, LeadFilters, LeadStats)
2. `src/services/leadService.ts` - 10 métodos de API (CRUD + bulk + assign + convert + stats + export/import)
3. `src/pages/Leads/LeadList.tsx` - Tabla completa con filtros, búsqueda, paginación, bulk actions (350+ líneas)
4. `src/pages/Leads/LeadForm.tsx` - Formulario create/edit con React Hook Form + Zod, 7 secciones
5. `src/pages/Leads/LeadDetail.tsx` - Vista detallada con 4 tabs, acciones, conversión
6. `src/App.tsx` - Actualizado con 4 rutas nuevas (/leads, /leads/new, /leads/:id, /leads/:id/edit)

### Endpoints API de Leads:
1. `POST /api/leads` - Crear nuevo lead
2. `GET /api/leads` - Obtener leads con filtros y paginación
3. `GET /api/leads/:id` - Obtener lead por ID
4. `PATCH /api/leads/:id` - Actualizar lead
5. `DELETE /api/leads/:id` - Eliminar lead
6. `POST /api/leads/bulk-delete` - Eliminar múltiples leads
7. `PATCH /api/leads/:id/assign` - Asignar lead a usuario
8. `POST /api/leads/:id/convert` - Convertir lead a Contact/Account/Deal
9. `GET /api/leads/stats` - Obtener estadísticas de leads

### Sistema en Funcionamiento:
- 🟢 Backend API: http://localhost:5000
- 🟢 Frontend: http://localhost:5173
- 🟢 MongoDB: Conectado
- 🟢 Autenticación: Totalmente funcional
- 🟢 Dashboard: Con datos reales y gráficas
- 🟢 Módulo de Leads: CRUD completo funcional **NUEVO**
- 🟢 Endpoints protegidos: 14 nuevos endpoints (5 dashboard + 9 leads)

### Próximo Paso:
**Iniciar Fase 5:** Módulo de Contactos con CRUD completo (similar a Leads)

**Páginas:**
- ✅ `Dashboard.tsx` - Panel principal con KPIs y cards

### Archivos Totales Creados (Fase 1):
**Backend:** 15 archivos
**Frontend:** 21 archivos (+9 nuevos)
**Docker:** 3 archivos
**Docs:** 2 archivos
**Total:** 41 archivos

### Funcionalidades UI Implementadas:
- ✅ TopNavbar fijo con logo VinQ
- ✅ Búsqueda global en navbar
- ✅ Iconos de notificaciones (badge con contador)
- ✅ Menú de usuario con avatar y dropdown
- ✅ Sidebar colapsable (240px ↔ 60px)
- ✅ 11 items de menú con iconos (Dashboard, Leads, Contactos, etc.)
- ✅ Navegación funcional entre páginas
- ✅ Breadcrumbs dinámico según ruta
- ✅ Layout responsive
- ✅ Transiciones suaves al colapsar sidebar
- ✅ Tema de colores Zoho aplicado (#1C4BDE)
- ✅ Dashboard con KPIs y cards informativos

### Próximo Paso:
**Iniciar Fase 2:** Sistema de Autenticación (Login, Register, JWT)

---

## 📚 Referencias y Recursos

### Zoho CRM
- [Documentación oficial](https://www.zoho.com/crm/help/)
- [Guía de UI/UX](https://www.zoho.com/crm/)
- [API Documentation](https://www.zoho.com/crm/developer/)

### Librerías Principales
- [Ant Design](https://ant.design/)
- [Recharts](https://recharts.org/)
- [TanStack Table](https://tanstack.com/table/v8)
- [FullCalendar](https://fullcalendar.io/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**🚀 ¡Listo para empezar desde cero con un CRM profesional estilo Zoho!**
