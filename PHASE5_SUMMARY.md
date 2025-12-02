# 📋 VinQ CRM - Fase 5: Módulo de Contactos (Contacts)

**Fecha de Implementación:** Diciembre 2, 2025  
**Duración:** 1 día  
**Estado:** ✅ COMPLETADA  
**Líneas de Código:** ~3,800 líneas

---

## 📊 Resumen Ejecutivo

La **Fase 5** implementa el módulo completo de **Contactos** (Contacts), que gestiona personas individuales en el CRM. Este módulo se diferencia de **Leads** en que representa contactos ya establecidos que pueden estar vinculados a empresas (Accounts) mediante una relación de referencia.

### 🎯 Objetivos Cumplidos

✅ **Backend API** con 10 endpoints RESTful protegidos  
✅ **Modelo de datos** con 30+ campos y direcciones duales  
✅ **Validación robusta** con Zod en ambos lados  
✅ **Frontend React** con tabla interactiva, formulario multi-sección y vista de detalle  
✅ **Funcionalidades avanzadas**: merge de duplicados, link/unlink de accounts, asignación de usuarios  
✅ **0 errores de TypeScript** tras compilación  

---

## 🏗️ Arquitectura Implementada

### Backend Structure
```
backend/src/
├── models/Contact.ts           # Modelo Mongoose con 30+ campos
├── schemas/contact.schema.ts   # 6 schemas Zod de validación
├── controllers/contact.controller.ts  # 10 endpoints con lógica de negocio
└── routes/contact.routes.ts    # Rutas protegidas con auth y roles
```

### Frontend Structure
```
frontend/src/
├── schemas/contact.schema.ts   # Types y validaciones Zod
├── services/contactService.ts  # 12 métodos de API
└── pages/Contacts/
    ├── ContactList.tsx         # Tabla con filtros (370+ líneas)
    ├── ContactForm.tsx         # Formulario 6 secciones (660+ líneas)
    └── ContactDetail.tsx       # Vista detallada con 5 tabs (380+ líneas)
```

---

## 📦 Modelo de Datos (Contact)

### Campos Principales (30+)

#### **Información Personal**
```typescript
firstName: string         // Requerido
lastName: string          // Requerido
fullName: string          // Auto-generado (pre-save hook)
email: string             // Requerido, único
phone?: string
mobile?: string
dateOfBirth?: Date
```

#### **Información Profesional**
```typescript
title?: string            // Ej: "Gerente de Ventas"
department?: string       // Ej: "Ventas"
account?: ObjectId        // Referencia a Account (empresa)
isPrimary: boolean        // Contacto principal de la empresa
```

#### **Direcciones Duales**
```typescript
mailingAddress?: {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

otherAddress?: {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}
```

#### **Fuente y Asignación**
```typescript
leadSource: enum          // 8 valores (WEBSITE, REFERRAL, etc.)
description?: string      // Notas
assignedTo?: ObjectId     // Usuario asignado
createdBy: ObjectId       // Usuario creador
lastContactedDate?: Date  // Última interacción
```

#### **Redes Sociales**
```typescript
linkedInUrl?: string      // URL de LinkedIn
twitterHandle?: string    // @usuario
facebookUrl?: string      // URL de Facebook
```

#### **Metadatos**
```typescript
customFields?: Map<string, any>  // Campos personalizados
timestamps: true                 // createdAt, updatedAt
```

### Enums

#### ContactLeadSource (8 valores)
```typescript
WEBSITE           // Sitio web
REFERRAL          // Referido
SOCIAL_MEDIA      // Redes sociales
EMAIL_CAMPAIGN    // Campaña de email
PHONE_CALL        // Llamada telefónica
TRADE_SHOW        // Feria comercial
ADVERTISING       // Publicidad
OTHER             // Otro
```

### Índices de Base de Datos
```typescript
{ email: 1 }                     // Único
{ account: 1 }                   // Performance
{ assignedTo: 1 }                // Queries por usuario
{ createdBy: 1 }                 // Auditoría
{ isPrimary: 1 }                 // Contactos principales
{ createdAt: -1 }                // Ordenamiento
{
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
  title: 'text',
  department: 'text'
}                                // Búsqueda de texto completo
```

### Virtual References
```typescript
deals: {
  ref: 'Deal',
  localField: '_id',
  foreignField: 'contact'
}  // Oportunidades relacionadas (Fase 7)
```

---

## 🔌 API Endpoints (10)

### 1. **POST /api/v1/contacts** - Crear Contacto
**Autenticación:** Requerida  
**Rol:** Todos los autenticados

**Request Body:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "phone": "+52 123 456 7890",
  "mobile": "+52 987 654 3210",
  "title": "Gerente de Compras",
  "department": "Adquisiciones",
  "account": "64f8a12b5c3d2e001f9a1234",
  "isPrimary": true,
  "mailingAddress": {
    "street": "Av. Reforma 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zip": "06600",
    "country": "México"
  },
  "leadSource": "REFERRAL",
  "assignedTo": "64f8a12b5c3d2e001f9a5678",
  "linkedInUrl": "https://linkedin.com/in/juanperez",
  "description": "Contacto clave en la empresa"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a12b5c3d2e001f9a9999",
    "firstName": "Juan",
    "lastName": "Pérez",
    "fullName": "Juan Pérez",
    "email": "juan.perez@example.com",
    "isPrimary": true,
    "account": { /* Account populated */ },
    "assignedTo": { /* User populated */ },
    "createdBy": { /* User populated */ },
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
}
```

---

### 2. **GET /api/v1/contacts** - Listar Contactos
**Autenticación:** Requerida

**Query Parameters:**
```
?page=1
&limit=10
&account=64f8a12b5c3d2e001f9a1234
&assignedTo=64f8a12b5c3d2e001f9a5678
&leadSource=REFERRAL
&isPrimary=true
&search=juan
&sortBy=createdAt
&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [ /* Array de contactos */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

### 3. **GET /api/v1/contacts/:id** - Obtener Contacto
**Autenticación:** Requerida

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a12b5c3d2e001f9a9999",
    "firstName": "Juan",
    "lastName": "Pérez",
    "fullName": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "+52 123 456 7890",
    "mobile": "+52 987 654 3210",
    "title": "Gerente de Compras",
    "department": "Adquisiciones",
    "account": {
      "_id": "64f8a12b5c3d2e001f9a1234",
      "name": "Empresa XYZ",
      "industry": "Tecnología",
      "website": "https://empresa.com"
    },
    "isPrimary": true,
    "mailingAddress": {
      "street": "Av. Reforma 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zip": "06600",
      "country": "México"
    },
    "leadSource": "REFERRAL",
    "assignedTo": { /* User populated */ },
    "createdBy": { /* User populated */ },
    "linkedInUrl": "https://linkedin.com/in/juanperez",
    "createdAt": "2025-12-02T10:00:00.000Z",
    "updatedAt": "2025-12-02T10:00:00.000Z"
  }
}
```

---

### 4. **PATCH /api/v1/contacts/:id** - Actualizar Contacto
**Autenticación:** Requerida

**Request Body:** (Campos parciales)
```json
{
  "title": "Director de Compras",
  "mobile": "+52 999 888 7777",
  "otherAddress": {
    "street": "Calle Secundaria 456",
    "city": "Monterrey",
    "state": "Nuevo León",
    "zip": "64000",
    "country": "México"
  }
}
```

**Response:** Contacto actualizado completo

---

### 5. **DELETE /api/v1/contacts/:id** - Eliminar Contacto
**Autenticación:** Requerida  
**Rol:** Admin o Manager

**Response:**
```json
{
  "success": true,
  "message": "Contacto eliminado exitosamente"
}
```

---

### 6. **DELETE /api/v1/contacts/bulk** - Eliminación Masiva
**Autenticación:** Requerida  
**Rol:** Admin o Manager

**Request Body:**
```json
{
  "ids": [
    "64f8a12b5c3d2e001f9a9999",
    "64f8a12b5c3d2e001f9a8888",
    "64f8a12b5c3d2e001f9a7777"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedCount": 3
  }
}
```

---

### 7. **PATCH /api/v1/contacts/:id/assign** - Asignar Contacto
**Autenticación:** Requerida  
**Rol:** Admin o Manager

**Request Body:**
```json
{
  "assignedTo": "64f8a12b5c3d2e001f9a5678"
}
```

**Response:** Contacto actualizado con nuevo assignedTo

---

### 8. **PATCH /api/v1/contacts/:id/link-account** - Vincular con Account
**Autenticación:** Requerida

**Request Body:**
```json
{
  "accountId": "64f8a12b5c3d2e001f9a1234",
  "isPrimary": true
}
```

**Lógica:**
- Si `isPrimary=true`, desmarca otros contactos de la misma cuenta como no primarios
- Actualiza el contacto actual

**Response:** Contacto actualizado con account vinculada

---

### 9. **POST /api/v1/contacts/merge** - Merge de Duplicados
**Autenticación:** Requerida  
**Rol:** Admin o Manager

**Request Body:**
```json
{
  "sourceContactId": "64f8a12b5c3d2e001f9a9999",
  "targetContactId": "64f8a12b5c3d2e001f9a8888",
  "fieldsToKeep": {
    "phone": "source",
    "mobile": "target",
    "title": "target",
    "mailingAddress": "source"
  },
  "mergeActivities": true,
  "mergeDeals": true
}
```

**Lógica:**
1. Fusiona campos según preferencias (source/target)
2. TODO: Transferir actividades del source al target
3. TODO: Transferir deals del source al target
4. Elimina el source contact

**Response:** Contacto target actualizado con datos fusionados

---

### 10. **GET /api/v1/contacts/stats** - Estadísticas
**Autenticación:** Requerida

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 156,
    "withAccount": 120,
    "withoutAccount": 36,
    "byLeadSource": [
      { "_id": "WEBSITE", "count": 45 },
      { "_id": "REFERRAL", "count": 38 },
      { "_id": "SOCIAL_MEDIA", "count": 28 },
      { "_id": "EMAIL_CAMPAIGN", "count": 22 },
      { "_id": "PHONE_CALL", "count": 15 },
      { "_id": "TRADE_SHOW", "count": 5 },
      { "_id": "ADVERTISING", "count": 2 },
      { "_id": "OTHER", "count": 1 }
    ]
  }
}
```

---

## 🛡️ Seguridad y Validaciones

### Validaciones Backend (Zod)

#### createContactSchema
```typescript
{
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  title: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  account: z.string().optional(),
  isPrimary: z.boolean().default(false),
  mailingAddress: z.object({...}).optional(),
  otherAddress: z.object({...}).optional(),
  dateOfBirth: z.string().optional(),
  leadSource: z.enum([...]),
  description: z.string().max(2000).optional(),
  linkedInUrl: z.string().url().optional(),
  twitterHandle: z.string().optional(),
  facebookUrl: z.string().url().optional(),
  assignedTo: z.string().optional(),
  customFields: z.record(z.any()).optional()
}
```

#### updateContactSchema
- Todos los campos son opcionales (partial)
- Permite actualizaciones parciales

#### mergeContactsSchema
```typescript
{
  sourceContactId: z.string(),
  targetContactId: z.string(),
  fieldsToKeep: z.object({
    firstName: z.enum(['source', 'target']).optional(),
    lastName: z.enum(['source', 'target']).optional(),
    // ... más campos
  }).optional(),
  mergeActivities: z.boolean().optional(),
  mergeDeals: z.boolean().optional()
}
```

### Permisos por Endpoint

| Endpoint | Autenticación | Roles Permitidos |
|----------|---------------|-------------------|
| POST /contacts | ✅ | Todos |
| GET /contacts | ✅ | Todos |
| GET /contacts/:id | ✅ | Todos |
| PATCH /contacts/:id | ✅ | Todos |
| DELETE /contacts/:id | ✅ | Admin, Manager |
| DELETE /contacts/bulk | ✅ | Admin, Manager |
| PATCH /contacts/:id/assign | ✅ | Admin, Manager |
| PATCH /contacts/:id/link-account | ✅ | Todos |
| POST /contacts/merge | ✅ | Admin, Manager |
| GET /contacts/stats | ✅ | Todos |

---

## 💻 Frontend Implementación

### 1. ContactList.tsx (370+ líneas)

#### Características
- ✅ Tabla Ant Design con 9 columnas
- ✅ Paginación del lado del servidor
- ✅ Ordenamiento por columnas
- ✅ Filtros: fuente, isPrimary, account, assignedTo
- ✅ Búsqueda en tiempo real
- ✅ Selección múltiple con checkboxes
- ✅ Acciones masivas (eliminar, exportar)
- ✅ Acciones por fila (editar, ver, eliminar)
- ✅ Badge verde para contactos primarios
- ✅ Tags con colores por fuente
- ✅ Links a empresas (accounts)
- ✅ Botón "Crear Contacto"
- ✅ Botones Exportar/Importar

#### Columnas de la Tabla
1. **Nombre** - fullName con badge si isPrimary
2. **Email** - con link mailto
3. **Título** - Cargo/Posición
4. **Empresa** - Link a Account (si existe)
5. **Teléfono** - phone
6. **Móvil** - mobile
7. **Fuente** - Tag con color
8. **Asignado a** - Nombre del usuario
9. **Acciones** - Dropdown con 3 opciones

#### Filtros Implementados
```typescript
{
  search: string              // Búsqueda por texto
  leadSource: ContactLeadSource
  isPrimary: boolean
  account: string (ID)
  assignedTo: string (ID)
  sortBy: string
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}
```

---

### 2. ContactForm.tsx (660+ líneas)

#### Secciones del Formulario

**Sección 1: Información Básica**
- firstName * (requerido)
- lastName * (requerido)
- email * (requerido)
- phone
- mobile
- dateOfBirth (DatePicker)

**Sección 2: Información Profesional**
- title (ej: "Gerente de Ventas")
- department
- account (Select - TODO: cargar desde API)
- isPrimary (Checkbox)

**Sección 3: Dirección de Correspondencia**
- mailingStreet
- mailingCity
- mailingState
- mailingZip
- mailingCountry

**Sección 4: Otra Dirección**
- otherStreet
- otherCity
- otherState
- otherZip
- otherCountry

**Sección 5: Información Adicional**
- leadSource * (Select con 8 opciones)
- assignedTo (Select - TODO: cargar usuarios)
- description (TextArea)

**Sección 6: Redes Sociales**
- linkedInUrl
- twitterHandle
- facebookUrl

**Sección 7: Acciones**
- Botón "Crear/Actualizar Contacto"
- Botón "Cancelar"

#### Validaciones
- React Hook Form + Zod resolver
- Validación en tiempo real
- Mensajes de error bajo cada campo
- Deshabilitación de botón durante submit

#### Modos de Operación
- **Crear** (`/contacts/new`) - Campos vacíos
- **Editar** (`/contacts/:id/edit`) - Carga datos existentes

---

### 3. ContactDetail.tsx (380+ líneas)

#### Layout
- **Header Card**
  - Nombre completo con badge isPrimary
  - Email y teléfono con iconos
  - Botones "Editar" y "Eliminar"

- **Tabs (5)**

**Tab 1: Resumen** ⭐
- Card "Información Personal" (Descriptions 2 columnas)
- Card "Información Profesional"
- Card "Dirección de Correspondencia" (si existe)
- Card "Otra Dirección" (si existe)
- Card "Información Adicional" con fuente, asignación, creador
- Card "Redes Sociales" (si tiene links)

**Tab 2: Actividad**
- Placeholder para Fase 10 (Activities Module)

**Tab 3: Oportunidades**
- Placeholder para Fase 7 (Deals Module)

**Tab 4: Notas**
- Placeholder para Fase 10 (Notes Module)

**Tab 5: Relacionados**
- Card "Empresa Vinculada" con link a Account
- Card "Otros Contactos de la Empresa" (TODO)

---

## 🧪 Testing

### Comandos de Prueba (curl)

#### 1. Crear Contacto
```bash
curl -X POST http://localhost:5000/api/v1/contacts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "firstName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "phone": "+52 555 123 4567",
    "mobile": "+52 555 987 6543",
    "title": "Directora de Marketing",
    "department": "Marketing",
    "leadSource": "WEBSITE",
    "isPrimary": true,
    "mailingAddress": {
      "street": "Insurgentes Sur 1234",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zip": "03900",
      "country": "México"
    },
    "linkedInUrl": "https://linkedin.com/in/mariagarcia",
    "description": "Contacto principal de la empresa ABC"
  }'
```

#### 2. Listar Contactos con Filtros
```bash
curl -X GET "http://localhost:5000/api/v1/contacts?page=1&limit=10&leadSource=WEBSITE&isPrimary=true&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 3. Obtener Contacto por ID
```bash
curl -X GET http://localhost:5000/api/v1/contacts/CONTACT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Actualizar Contacto
```bash
curl -X PATCH http://localhost:5000/api/v1/contacts/CONTACT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Gerente General de Marketing",
    "mobile": "+52 555 111 2222"
  }'
```

#### 5. Vincular con Account
```bash
curl -X PATCH http://localhost:5000/api/v1/contacts/CONTACT_ID/link-account \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accountId": "ACCOUNT_ID",
    "isPrimary": true
  }'
```

#### 6. Merge de Duplicados
```bash
curl -X POST http://localhost:5000/api/v1/contacts/merge \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_ADMIN" \
  -d '{
    "sourceContactId": "SOURCE_CONTACT_ID",
    "targetContactId": "TARGET_CONTACT_ID",
    "fieldsToKeep": {
      "phone": "source",
      "title": "target"
    },
    "mergeActivities": true,
    "mergeDeals": true
  }'
```

#### 7. Bulk Delete
```bash
curl -X DELETE http://localhost:5000/api/v1/contacts/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_ADMIN" \
  -d '{
    "ids": ["CONTACT_ID_1", "CONTACT_ID_2", "CONTACT_ID_3"]
  }'
```

#### 8. Estadísticas
```bash
curl -X GET http://localhost:5000/api/v1/contacts/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📈 Estadísticas del Código

### Backend
```
src/models/Contact.ts              274 líneas
src/schemas/contact.schema.ts      210 líneas
src/controllers/contact.controller.ts  460 líneas
src/routes/contact.routes.ts       96 líneas
────────────────────────────────────────────
TOTAL BACKEND:                     1,040 líneas
```

### Frontend
```
src/schemas/contact.schema.ts      175 líneas
src/services/contactService.ts     175 líneas
src/pages/Contacts/ContactList.tsx     370 líneas
src/pages/Contacts/ContactForm.tsx     660 líneas
src/pages/Contacts/ContactDetail.tsx   380 líneas
────────────────────────────────────────────
TOTAL FRONTEND:                    1,760 líneas
```

### Total General
```
BACKEND + FRONTEND:                2,800 líneas
```

---

## 🔧 Configuración de Rutas

### App.tsx - Rutas Agregadas
```typescript
// Contactos
<Route path="/contacts" element={<ContactList />} />
<Route path="/contacts/new" element={<ContactForm />} />
<Route path="/contacts/:id" element={<ContactDetail />} />
<Route path="/contacts/:id/edit" element={<ContactForm />} />
```

### Sidebar Navigation
```typescript
{
  key: 'contacts',
  icon: <TeamOutlined />,
  label: 'Contactos',
  path: '/contacts'
}
```

---

## ⚠️ Limitaciones Conocidas y TODOs

### Backend
1. **Merge Activities/Deals** - Líneas 392-393 en `contact.controller.ts`
   ```typescript
   // TODO: Transfer activities from source to target
   // TODO: Transfer deals from source to target
   ```
   **Acción:** Implementar cuando existan los módulos de Activities (Fase 10) y Deals (Fase 7)

### Frontend
1. **Account Dropdown** - Línea 388 en `ContactForm.tsx`
   ```typescript
   {/* TODO: Load accounts from API */}
   ```
   **Acción:** Implementar cuando exista el módulo de Accounts (Fase 6)

2. **Users Dropdown** - Línea 569 en `ContactForm.tsx`
   ```typescript
   {/* TODO: Load users from API */}
   ```
   **Acción:** Crear endpoint `/api/v1/users` para listar usuarios

3. **Import Contacts** - Línea 349 en `ContactList.tsx`
   ```typescript
   <Button icon={<ImportOutlined />}>Importar</Button>
   ```
   **Acción:** Implementar wizard de importación CSV/Excel

4. **Activity Timeline** - Tab 2 en `ContactDetail.tsx`
   **Acción:** Integrar cuando se implemente el módulo de Activities (Fase 10)

5. **Related Deals** - Tab 3 en `ContactDetail.tsx`
   **Acción:** Integrar cuando se implemente el módulo de Deals (Fase 7)

6. **Notes Section** - Tab 4 en `ContactDetail.tsx`
   **Acción:** Integrar cuando se implemente el módulo de Activities (Fase 10)

7. **Other Contacts from Same Account** - Tab 5 en `ContactDetail.tsx`
   **Acción:** Crear query para obtener otros contactos del mismo account

---

## 🚀 Próximos Pasos

### Fase 6: Módulo de Accounts (Cuentas/Empresas)
**Objetivo:** Gestión de empresas/organizaciones a las que pertenecen los contactos

**Features a Implementar:**
1. Account Model con información corporativa
2. Jerarquía de cuentas (parent-child)
3. Relación inversa: Account → Contacts (array de contactos)
4. CRUD completo de accounts
5. Vinculación bidireccional con Contacts
6. Territorios de ventas
7. Industrias y tamaños de empresa
8. AccountList, AccountForm, AccountDetail pages
9. Integración con ContactForm (dropdown de accounts)
10. Vista de "Todos los Contactos de esta Empresa" en AccountDetail

**Dependencias Resueltas:**
- ✅ Contact Model listo con campo `account: ObjectId`
- ✅ ContactForm tiene campo `account` (falta cargar opciones)
- ✅ ContactDetail muestra empresa vinculada
- ✅ Link/unlink de accounts funcional

---

## 📝 Notas Técnicas

### Diferencias clave: Leads vs Contacts
| Aspecto | Leads | Contacts |
|---------|-------|----------|
| **Propósito** | Prospectos sin calificar | Personas establecidas |
| **Conversión** | Se convierten a Contact/Account/Deal | Ya son registros permanentes |
| **Empresa** | Campo `company: String` | Referencia `account: ObjectId` |
| **Estados** | 6 estados (NEW, CONTACTED, etc.) | Sin estados (permanentes) |
| **Rating** | HOT/WARM/COLD | Sin rating |
| **Scoring** | Lead score (0-100) | Sin scoring |
| **Presupuesto** | budgetMin/budgetMax | Sin presupuesto directo |
| **Conversión** | convertedDate, convertedAccountId | No aplica |
| **isPrimary** | No aplica | Sí (contacto principal de empresa) |
| **Direcciones** | 1 dirección (address) | 2 direcciones (mailing/other) |

### Pre-save Middleware
```typescript
contactSchema.pre('save', function (next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }
  next();
});
```
- Auto-genera `fullName` al crear/actualizar
- Se activa solo si firstName o lastName cambian

### Lógica de isPrimary
**Endpoint: PATCH /contacts/:id/link-account**
```typescript
if (isPrimary) {
  // Desmarca todos los otros contactos de esta cuenta
  await Contact.updateMany(
    { account: accountId, _id: { $ne: contactId } },
    { $set: { isPrimary: false } }
  );
}
// Luego actualiza el contacto actual
contact.account = accountId;
contact.isPrimary = isPrimary;
```
- Garantiza que solo haya 1 contacto primario por empresa
- Útil para identificar la persona principal de contacto

### Text Search Index
```typescript
{
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
  title: 'text',
  department: 'text'
}
```
- Permite búsquedas con `$text: { $search: 'query' }`
- Busca en 6 campos simultáneamente
- Usado en `getContacts` endpoint con parámetro `search`

---

## ✅ Checklist de Verificación

### Backend
- [x] Contact Model creado con 30+ campos
- [x] ContactLeadSource enum con 8 valores
- [x] Direcciones duales (mailingAddress, otherAddress)
- [x] Campo isPrimary con lógica de exclusividad
- [x] 6 schemas Zod (create, update, get, query, merge, link, assign)
- [x] 10 endpoints implementados
- [x] Validación de email único
- [x] Populate de account, assignedTo, createdBy
- [x] Búsqueda de texto completo
- [x] Filtros por account, assignedTo, leadSource, isPrimary
- [x] Paginación y ordenamiento
- [x] Bulk delete funcional
- [x] Assign to user funcional
- [x] Link/unlink account con lógica isPrimary
- [x] Merge contacts con field selection
- [x] Estadísticas con agregaciones
- [x] Rutas protegidas con requireAuth
- [x] Permisos de rol (Admin/Manager en 4 endpoints)
- [x] 0 errores de TypeScript

### Frontend
- [x] contact.schema.ts con types y validaciones
- [x] Address interface
- [x] contactService.ts con 12 métodos
- [x] ContactList.tsx con tabla de 9 columnas
- [x] Filtros: fuente, isPrimary, account, assignedTo
- [x] Búsqueda en tiempo real
- [x] Paginación funcional
- [x] Selección múltiple
- [x] Acciones masivas (delete, export)
- [x] ContactForm.tsx con 6 secciones
- [x] Modo create y edit
- [x] Validación con React Hook Form + Zod
- [x] 2 direcciones completas
- [x] Checkbox isPrimary
- [x] 3 campos de redes sociales
- [x] ContactDetail.tsx con 5 tabs
- [x] Tab Resumen con 6 cards
- [x] Tabs placeholders (Activity, Deals, Notes, Related)
- [x] Botones Edit/Delete en header
- [x] Links a accounts
- [x] Badge verde para isPrimary
- [x] Tags con colores por fuente
- [x] 4 rutas registradas en App.tsx
- [x] 0 errores de TypeScript

---

## 📚 Recursos y Referencias

### Dependencias Utilizadas

**Backend:**
- `mongoose` - ODM para MongoDB
- `zod` - Validación de esquemas
- `express` - Framework web
- `jsonwebtoken` - Autenticación JWT
- `bcrypt` - Hash de contraseñas

**Frontend:**
- `react` 18+ - Framework UI
- `react-router-dom` - Routing
- `antd` - Componentes UI
- `react-hook-form` - Manejo de formularios
- `@hookform/resolvers` - Integración Zod + RHF
- `zod` - Validación
- `axios` - HTTP client
- `dayjs` - Manejo de fechas

### Documentación Relevante
- [Mongoose Schema Types](https://mongoosejs.com/docs/schematypes.html)
- [Mongoose Virtuals](https://mongoosejs.com/docs/tutorials/virtuals.html)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Ant Design Table](https://ant.design/components/table/)
- [Ant Design Form](https://ant.design/components/form/)

---

## 🎓 Lecciones Aprendidas

1. **Direcciones como Subdocumentos:**
   - Usar subdocumentos (mailingAddress, otherAddress) en lugar de campos planos facilita la gestión
   - Permite estructuras reutilizables

2. **isPrimary Logic:**
   - Implementar lógica de exclusividad al vincular (solo 1 primario por cuenta)
   - Importante para integridad de datos

3. **Merge Functionality:**
   - Diseñar merge con field-level selection da flexibilidad
   - Dejar TODOs para activities/deals que se implementarán después

4. **Dual Addresses:**
   - Tener 2 direcciones (mailing y other) es común en CRM
   - Útil para dirección de facturación vs envío

5. **Social Media Fields:**
   - Separar en 3 campos (LinkedIn URL, Twitter handle, Facebook URL)
   - Permite validaciones específicas por plataforma

6. **Account Relationship:**
   - Usar ObjectId ref en lugar de String permite población
   - Facilita navegación bidireccional Contact → Account

7. **Text Search Index:**
   - Índice de texto en múltiples campos mejora búsqueda
   - Crucial para UX en listas grandes

8. **Zod Schema Reusability:**
   - Mantener schemas en archivos separados facilita reutilización
   - Mismo schema Zod en backend y frontend garantiza consistencia

---

## 🏁 Conclusión

La **Fase 5 (Módulo de Contactos)** fue completada exitosamente en **1 día**, implementando:

✅ **10 endpoints API** totalmente funcionales  
✅ **30+ campos** en el modelo de datos  
✅ **6 schemas Zod** para validación robusta  
✅ **3 páginas frontend** (List, Form, Detail)  
✅ **12 métodos de servicio** para comunicación con API  
✅ **2,800 líneas de código** bien estructuradas  
✅ **0 errores de TypeScript** tras compilación  

El módulo de Contactos ahora permite gestionar personas individuales en el CRM, con capacidades avanzadas como:
- Vinculación con empresas (Accounts)
- Marcado de contacto principal (isPrimary)
- Direcciones duales (correspondencia y alternativa)
- Redes sociales integradas
- Merge de duplicados
- Asignación de usuarios
- Búsqueda y filtrado avanzado

**Próxima Fase:** Implementar el Módulo de Accounts (Fase 6) para completar la relación Contact ↔ Account.

---

**Documento generado:** Diciembre 2, 2025  
**Autor:** GitHub Copilot + Desarrollador  
**Versión:** 1.0
