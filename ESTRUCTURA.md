# 📁 Estructura del Proyecto VinQ CRM

\`\`\`
VinQ/
│
├── 📄 README.md                    # Documentación principal
├── 📄 WORKFLOW.md                  # Plan de desarrollo y arquitectura
├── 📄 QUICKSTART.md                # Guía de inicio rápido
├── 📄 docker-compose.yml           # Configuración Docker
├── 📄 .gitignore                   # Archivos ignorados por Git
├── 🚀 start.sh                     # Script de inicio automático
│
├── 📂 backend/                     # API REST - Node.js + Express + TypeScript
│   ├── 📂 src/
│   │   ├── 📂 controllers/        # Lógica de negocio
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── lead.controller.ts
│   │   │   ├── property.controller.ts
│   │   │   └── opportunity.controller.ts
│   │   │
│   │   ├── 📂 models/             # Modelos de MongoDB (Mongoose)
│   │   │   ├── User.model.ts
│   │   │   ├── Lead.model.ts
│   │   │   ├── Property.model.ts
│   │   │   └── Opportunity.model.ts
│   │   │
│   │   ├── 📂 routes/             # Rutas de la API
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── lead.routes.ts
│   │   │   ├── property.routes.ts
│   │   │   └── opportunity.routes.ts
│   │   │
│   │   ├── 📂 middlewares/        # Middleware (auth, error handling)
│   │   │   ├── auth.middleware.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── server.ts              # Punto de entrada del servidor
│   │   └── seed.ts                # Script para datos de prueba
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env                       # Variables de entorno
│   └── .env.example
│
├── 📂 frontend/                    # Aplicación React + Vite + TypeScript
│   ├── 📂 src/
│   │   ├── 📂 pages/              # Páginas/Vistas
│   │   │   ├── 📂 Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── 📂 Dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── 📂 Leads/
│   │   │   │   └── Leads.tsx
│   │   │   ├── 📂 Properties/
│   │   │   │   └── Properties.tsx
│   │   │   ├── 📂 Opportunities/
│   │   │   │   └── Opportunities.tsx
│   │   │   └── 📂 Admin/
│   │   │       └── AdminPanel.tsx
│   │   │
│   │   ├── 📂 layouts/            # Layouts (MainLayout con sidebar)
│   │   │   └── MainLayout.tsx
│   │   │
│   │   ├── 📂 components/         # Componentes reutilizables
│   │   │
│   │   ├── 📂 services/           # Servicios de API
│   │   │   ├── api.ts
│   │   │   └── authService.ts
│   │   │
│   │   ├── 📂 store/              # Estado global (Zustand)
│   │   │   └── authStore.ts
│   │   │
│   │   ├── App.tsx                # Configuración de rutas
│   │   └── main.tsx               # Punto de entrada
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── Dockerfile
│   ├── .env                       # Variables de entorno
│   └── .env.example
│
└── 📂 .vscode/
    └── extensions.json            # Extensiones recomendadas

\`\`\`

---

## 🔑 Archivos Clave

### Backend

| Archivo | Descripción |
|---------|-------------|
| \`server.ts\` | Configuración principal del servidor Express |
| \`*.model.ts\` | Esquemas de MongoDB con Mongoose |
| \`*.controller.ts\` | Lógica de negocio para cada módulo |
| \`*.routes.ts\` | Definición de endpoints de la API |
| \`auth.middleware.ts\` | Protección de rutas con JWT |
| \`seed.ts\` | Datos de prueba para desarrollo |

### Frontend

| Archivo | Descripción |
|---------|-------------|
| \`App.tsx\` | Configuración de rutas y navegación |
| \`MainLayout.tsx\` | Layout principal con sidebar y navbar |
| \`authStore.ts\` | Gestión del estado de autenticación |
| \`api.ts\` | Cliente Axios con interceptores |
| \`*.tsx (pages)\` | Vistas principales del sistema |

---

## 📊 Flujo de Datos

\`\`\`
Frontend (React)
    ↓
API Client (Axios)
    ↓
Backend API (Express)
    ↓
Controllers
    ↓
Models (Mongoose)
    ↓
MongoDB
\`\`\`

---

## 🔐 Autenticación

\`\`\`
1. Usuario hace login → Frontend
2. Frontend envía credenciales → Backend /api/auth/login
3. Backend valida y genera JWT → Response con token
4. Frontend guarda token → Zustand Store
5. Requests subsecuentes incluyen token → Header: Authorization: Bearer <token>
6. Backend valida token → Middleware auth
7. Si válido → Acceso permitido
8. Si inválido → 401 Unauthorized
\`\`\`

---

## 🗄️ Modelos de Datos

### User
- firstName, lastName, email, password
- role (admin, manager, agent, user)
- phone, avatar, isActive

### Lead
- firstName, lastName, email, phone
- status (new, contacted, qualified, converted, lost)
- source, interestedIn, budget, notes
- assignedTo, activities

### Property
- title, description, type, status
- price, currency, address
- features (bedrooms, bathrooms, area)
- amenities, images, documents

### Opportunity
- name, client (Lead), property
- stage, value, probability
- expectedCloseDate, assignedTo
- notes, activities

---

## 🚀 Próximas Expansiones

Estructura preparada para agregar:
- \`📂 services/\` - Lógica de negocio compleja
- \`📂 utils/\` - Funciones auxiliares
- \`📂 config/\` - Configuraciones centralizadas
- \`📂 types/\` - Definiciones TypeScript compartidas
- \`📂 tests/\` - Pruebas unitarias e integración
