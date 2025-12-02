# VinQ CRM - Frontend

Frontend de VinQ CRM, un sistema de gestión de relaciones con clientes especializado en bienes raíces, con diseño inspirado en Zoho CRM.

## 🚀 Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Ant Design** - Sistema de diseño (estilo Zoho)
- **React Router v6** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form + Zod** - Formularios y validación
- **Recharts** - Gráficas

## 🎨 Diseño

El diseño replica el estilo visual de Zoho CRM:
- Paleta de colores Zoho (#1C4BDE)
- Componentes UI consistentes
- Sidebar colapsable
- Top navbar con búsqueda global
- Cards con sombras sutiles

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
```

## 🏃‍♂️ Ejecución

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview de producción
npm run preview
```

## 📚 Estructura

```
src/
├── components/      # Componentes reutilizables
├── pages/          # Páginas/vistas
├── layouts/        # Layouts
├── services/       # API services
├── store/          # Estado global (Zustand)
├── styles/         # Tema y estilos
├── types/          # Tipos TypeScript
├── utils/          # Utilidades
├── App.tsx         # Componente principal
└── main.tsx        # Punto de entrada
```

## 🌐 Variables de Entorno

Ver `.env.example` para las variables requeridas.

## 📝 Próximos Pasos

- [ ] Crear componentes de layout (MainLayout, AuthLayout)
- [ ] Implementar TopNavbar estilo Zoho
- [ ] Implementar Sidebar colapsable
- [ ] Crear páginas de autenticación
- [ ] Implementar Dashboard
