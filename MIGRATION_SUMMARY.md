# 🔄 Migración de MongoDB a PostgreSQL (Neon)

## ✅ Cambios Completados

### 🗄️ Base de Datos
- **ANTES**: MongoDB + Mongoose
- **AHORA**: PostgreSQL + Prisma ORM

**¿Por qué PostgreSQL + Neon?**
- ✅ 100% compatible con Vercel (serverless)
- ✅ Plan gratuito forever (0.5GB storage)
- ✅ Mejor para relaciones complejas (CRM tiene muchas relaciones)
- ✅ TypeScript first-class support con Prisma
- ✅ Migrations automáticas
- ✅ Prisma Studio (GUI para ver/editar datos)

### 📦 Dependencias Actualizadas

**Removidas:**
- ❌ `mongoose`

**Agregadas:**
- ✅ `@prisma/client` - Cliente de Prisma
- ✅ `prisma` (dev) - CLI de Prisma
- ✅ `pg` - Driver de PostgreSQL

### 📁 Archivos Creados/Modificados

#### Nuevos Archivos:
1. **`backend/prisma/schema.prisma`** (350+ líneas)
   - Schema completo con User, Lead, Contact, Account
   - 4 modelos con todas las relaciones
   - 9 enums (UserRole, UserStatus, LeadStatus, etc.)
   - Índices optimizados para búsquedas

2. **`backend/prisma.config.ts`**
   - Configuración de Prisma 7
   - Connection string desde env

3. **`DEPLOYMENT_NEON.md`** (Guía completa)
   - Setup de Neon PostgreSQL
   - Deploy en Vercel paso a paso
   - Troubleshooting

4. **`SETUP.md`** (Guía rápida)
   - Setup local en 5 minutos
   - Scripts útiles
   - Problemas comunes

#### Archivos Modificados:
1. **`backend/src/config/db.ts`**
   - Removido: Mongoose connection
   - Agregado: Prisma Client singleton
   - Graceful shutdown para serverless

2. **`backend/.env.example`**
   - `MONGO_URI` → `DATABASE_URL`
   - Connection string de PostgreSQL

3. **`backend/package.json`**
   - Scripts de Prisma: `prisma:generate`, `prisma:migrate`, `prisma:studio`
   - Build incluye `prisma generate`

4. **`docker-compose.yml`**
   - `mongodb` → `postgres:16-alpine`
   - Variables de entorno actualizadas
   - Health checks agregados

5. **`vercel.json`**
   - Build command incluye migraciones de Prisma
   - `buildCommand` con `prisma migrate deploy`

6. **`package.json` (raíz)**
   - Scripts de Prisma
   - `vercel-build` actualizado

7. **`README.md`**
   - Badges actualizados (PostgreSQL + Prisma)
   - Setup instructions actualizadas
   - Variables de entorno actualizadas

---

## 🚀 Próximos Pasos

### 1. Obtener Base de Datos en Neon (2 minutos)

```bash
# 1. Ve a https://neon.tech
# 2. Sign up con GitHub (1 click)
# 3. Crear proyecto "vinq-crm"
# 4. Copiar Connection String
```

Tu connection string se verá así:
```
postgresql://usuario:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 2. Configurar Localmente

```bash
cd backend

# Crear .env con tu connection string de Neon
cat > .env << EOF
DATABASE_URL=postgresql://tu_usuario:tu_password@ep-xxx.neon.tech/vinq_crm?sslmode=require
JWT_SECRET=dev-secret-123456789
JWT_REFRESH_SECRET=dev-refresh-secret-987654321
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
EOF

# Generar cliente de Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma migrate dev --name init

# Ver tus datos con Prisma Studio (opcional)
npx prisma studio
```

### 3. Iniciar Desarrollo

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Abre http://localhost:5173

### 4. Deploy a Vercel

Lee la guía completa: **[DEPLOYMENT_NEON.md](./DEPLOYMENT_NEON.md)**

Resumen rápido:
1. Push código a GitHub
2. Importar en Vercel
3. Agregar variable `DATABASE_URL` (tu connection string de Neon)
4. Agregar `JWT_SECRET` y `JWT_REFRESH_SECRET`
5. Deploy! 🚀

---

## 📊 Schema de Base de Datos

### Modelos Implementados:

```
User (Usuarios del sistema)
├── id: UUID
├── email: String (unique)
├── password: String (hashed)
├── firstName, lastName: String
├── role: Enum (ADMIN, MANAGER, AGENT, USER)
├── status: Enum (ACTIVE, INACTIVE, SUSPENDED)
└── Relaciones:
    ├── Lead[] (creados y asignados)
    ├── Contact[] (creados y asignados)
    └── Account[] (creados y asignados)

Lead (Prospectos)
├── id: UUID
├── firstName, lastName, email, phone
├── company, title, website
├── status: Enum (NEW, CONTACTED, QUALIFIED, etc.)
├── source: Enum (WEBSITE, REFERRAL, etc.)
├── rating: Enum (HOT, WARM, COLD)
├── address: Campos completos
├── assignedTo: User (relación)
├── createdBy: User (relación)
├── isConverted: Boolean
└── convertedToContactId, convertedToAccountId

Contact (Contactos/Personas)
├── id: UUID
├── firstName, lastName, email, phone, mobile
├── Professional: title, department, isPrimary
├── account: Account (relación)
├── reportsTo: Contact (auto-relación jerárquica)
├── Addresses: mailing + other (completas)
├── Social: linkedInUrl, twitterHandle, facebookUrl
├── assignedTo: User
└── createdBy: User

Account (Empresas/Organizaciones)
├── id: UUID
├── name, accountNumber (auto-generado)
├── website, phone, email
├── type: Enum (CUSTOMER, PROSPECT, PARTNER, etc.)
├── industry: Enum (REAL_ESTATE, FINANCE, etc.)
├── size: Enum (SMALL, MEDIUM, LARGE, ENTERPRISE)
├── annualRevenue, employees
├── Billing Address (completa)
├── Shipping Address (completa)
├── Hierarchy:
│   ├── parentAccount: Account (auto-relación)
│   └── childAccounts: Account[]
├── contacts: Contact[] (relación inversa)
├── assignedTo: User
└── createdBy: User
```

---

## 🔄 Comparación: Mongoose vs Prisma

| Característica | Mongoose (MongoDB) | Prisma (PostgreSQL) |
|----------------|-------------------|---------------------|
| **Type Safety** | ❌ Runtime checks | ✅ Compile-time types |
| **Migrations** | ❌ Manual | ✅ Automáticas |
| **Relations** | ❌ Manual populate | ✅ Auto-join |
| **GUI** | ❌ MongoDB Compass (externo) | ✅ Prisma Studio (integrado) |
| **Vercel** | ⚠️ Requiere MongoDB Atlas | ✅ Neon serverless |
| **Gratis** | ✅ 512MB (Atlas) | ✅ 0.5GB (Neon) |
| **Developer Experience** | 😐 Buena | 🎉 Excelente |

---

## 🛠️ Comandos Útiles de Prisma

```bash
# Generar cliente de Prisma (después de cambios en schema.prisma)
npx prisma generate

# Crear una nueva migración
npx prisma migrate dev --name descripcion_cambio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status

# Abrir Prisma Studio (GUI para ver/editar datos)
npx prisma studio

# Sincronizar schema desde la base de datos existente
npx prisma db pull

# Pushear cambios del schema sin migración (solo dev)
npx prisma db push

# Reset de base de datos (⚠️ ELIMINA TODO)
npx prisma migrate reset

# Ver SQL de una migración
cat prisma/migrations/YYYYMMDDHHMMSS_nombre/migration.sql
```

---

## ⚠️ Notas Importantes

### 1. Neon Sleep Mode (Plan Gratuito)
- Base de datos se suspende después de 5 minutos de inactividad
- Primer request después del sleep toma ~1-2 segundos
- Es normal en plan gratuito
- **Solución**: Upgrade a plan Pro ($19/mes) o usar cron job para mantenerla activa

### 2. Connection Pooling
Prisma maneja el connection pooling automáticamente. No necesitas configurar nada.

### 3. Serverless Functions (Vercel)
El código está optimizado para serverless:
- Singleton de Prisma Client (evita múltiples conexiones)
- Graceful shutdown
- Reconnect automático

### 4. Desarrollo Local
Puedes usar:
- **Neon** (misma DB que producción) - Recomendado
- **PostgreSQL local** con Docker
- **Neon Branches** (crear branch de dev separado)

---

## 📚 Recursos

- **Prisma Docs**: https://www.prisma.io/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma + Vercel Guide**: https://vercel.com/guides/prisma
- **Prisma Schema Reference**: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

---

## ✅ Checklist de Migración

- [x] Desinstalar Mongoose
- [x] Instalar Prisma + PostgreSQL
- [x] Crear schema.prisma con todos los modelos
- [x] Actualizar config/db.ts para Prisma
- [x] Actualizar .env.example
- [x] Actualizar docker-compose.yml
- [x] Actualizar vercel.json
- [x] Actualizar package.json (scripts)
- [x] Crear DEPLOYMENT_NEON.md
- [x] Crear SETUP.md
- [x] Actualizar README.md
- [ ] **PENDIENTE**: Migrar controladores (User, Lead, Contact, Account) de Mongoose a Prisma
- [ ] **PENDIENTE**: Migrar middlewares si usan Mongoose
- [ ] **PENDIENTE**: Testing con datos reales

---

## 🎯 Siguiente Paso

**Necesitas migrar los CONTROLADORES** de Mongoose a Prisma.

Los modelos ya están definidos en `prisma/schema.prisma`, pero los controladores aún usan sintaxis de Mongoose.

¿Quieres que te ayude a migrar los controladores ahora? Puedo:
1. Migrar `auth.controller.ts` (Usuario)
2. Migrar `lead.controller.ts`
3. Migrar `contact.controller.ts`
4. Migrar `account.controller.ts`

O prefieres primero probarlo en Neon para asegurarte de que funciona?
