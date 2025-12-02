# VinQ CRM - Backend API

Backend API para VinQ CRM, un sistema de gestión de relaciones con clientes especializado en bienes raíces.

## 🚀 Tecnologías

- **Node.js** 20+
- **Express.js** - Framework web
- **TypeScript** - Tipado estático
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Zod** - Validación de datos
- **Winston** - Logging

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
```

## 🏃‍♂️ Ejecución

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start
```

## 📚 Estructura

```
src/
├── config/          # Configuraciones
├── controllers/     # Controladores
├── middlewares/     # Middlewares
├── models/          # Modelos de datos
├── routes/          # Rutas
├── services/        # Lógica de negocio
├── utils/           # Utilidades
├── types/           # Tipos TypeScript
└── server.ts        # Punto de entrada
```

## 🔐 Variables de Entorno

Ver `.env.example` para las variables requeridas.

## 📝 API Endpoints

```
GET  /health           - Health check
GET  /api/v1           - API info
```

Más endpoints serán agregados en las siguientes fases.
