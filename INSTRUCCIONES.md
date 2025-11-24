# 🚀 Usuarios Convert-IA

Sistema integral de gestión de usuarios, control de accesos y mesa de ayuda con arquitectura multiempresa completamente aislada.

## 📋 Características Implementadas

### ✅ Autenticación y Roles
- Sistema de roles con rol único: **Administrador**
- Autenticación segura con Supabase Auth
- Usuario DEMO disponible (ver credenciales abajo)

### ✅ Arquitectura Multiempresa
- Cada empresa funciona de forma independiente
- Aislamiento total de datos entre empresas
- Gestión CRUD completa de empresas

### ✅ Gestión de Usuarios Finales
- CRUD de usuarios por empresa
- Generación automática de códigos únicos
- Campos: documento, nombre, celular, email
- Estructura para carga masiva (próximamente)

### ✅ Portal del Usuario Final
- Acceso mediante código único
- Visualización de información personal
- Estructura para aplicativos asignados

### ✅ Dashboard Administrativo
- Vista de métricas generales
- Navegación entre módulos
- Diseño responsive y moderno

## 🔐 Credenciales de Acceso

### Usuario Demo Administrador
Para crear el usuario demo, sigue estos pasos:

1. Ve a la página de autenticación: `/auth`
2. Necesitas crear el primer usuario admin manualmente mediante:
   - Panel de Supabase > Authentication > Users > Add User
   - Email: `demo@convertia.com`
   - Password: `demo123`
   
3. Luego ejecuta en SQL Editor de Supabase:
```sql
-- Asignar rol de admin al usuario demo
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'demo@convertia.com';
```

## 🗂️ Estructura de la Base de Datos

### Tablas Principales
- `empresas` - Cuentas de empresa
- `usuarios_finales` - Personal de cada empresa
- `aplicativos_globales` - Aplicativos disponibles para todas las empresas
- `aplicativos_empresa` - Aplicativos personalizados por empresa
- `asignaciones_aplicativos` - Relación usuario-aplicativo con credenciales
- `alarmas` - Tickets/reportes de usuarios
- `historial_cambios` - Auditoría de cambios
- `user_roles` - Roles de administradores

## 📱 Rutas Disponibles

- `/` - Página principal
- `/auth` - Login de administrador
- `/portal` - Portal del usuario final (búsqueda por código)
- `/admin` - Dashboard administrativo
- `/admin/empresas` - Gestión de empresas
- `/admin/usuarios` - Gestión de usuarios finales
- `/admin/aplicativos` - Gestión de aplicativos (próximamente)
- `/admin/alarmas` - Centro de control de alarmas (próximamente)

## 🎨 Diseño

### Colores
- **Primary**: Azul Navy (#1e3a5f) - Color corporativo principal
- **Secondary**: Verde Esmeralda (#10b981) - Acentos y acciones
- **Gradientes**: Utilizados en heroes y CTAs

### Tipografía
- Sistema por defecto con fallbacks profesionales
- Weights: 400 (regular), 600 (semibold), 700 (bold)

## 🔄 Próximas Funcionalidades

### Alta Prioridad
1. **Gestión de Aplicativos**
   - CRUD de aplicativos globales
   - CRUD de aplicativos por empresa
   - Asignación masiva a usuarios

2. **Sistema de Alarmas/Tickets**
   - Centro de control para administrador
   - Formulario de creación para usuarios finales
   - Upload de archivos adjuntos
   - Estados y seguimiento

3. **Carga Masiva**
   - Import CSV/Excel de usuarios
   - Validación y preview
   - Generación automática de códigos

### Media Prioridad
4. **Vista Editable Masiva**
   - Tabla tipo Excel editable
   - Actualización en lote
   - Filtros avanzados

5. **Historial y Auditoría**
   - Timeline de cambios
   - Filtros por usuario/fecha
   - Exportación de reportes

6. **Métricas Avanzadas**
   - Gráficos en dashboard
   - Reportes por empresa
   - Estadísticas de uso

## 🛠️ Stack Tecnológico

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Estado**: React Query
- **Routing**: React Router DOM

## 🔒 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Función `is_admin()` para verificación de permisos
- Security Definer functions para operaciones sensibles
- Aislamiento completo entre empresas
- Validación de roles del lado del servidor

## 📝 Notas Importantes

1. **Aislamiento Multiempresa**: Cada empresa es completamente independiente. No hay datos compartidos entre empresas excepto los aplicativos globales (que son opcionales).

2. **Códigos Únicos**: Se generan automáticamente con formato `{documento}_{primer_nombre}`. El administrador puede personalizar la fórmula en futuras versiones.

3. **Portal del Usuario**: Los usuarios finales NO tienen login tradicional. Acceden únicamente con su código único.

4. **Roles**: Por ahora solo existe el rol "admin". En futuras versiones se pueden agregar más roles.

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📧 Soporte

Para cualquier consulta sobre el sistema, contacta al equipo de desarrollo.

---

**Estado del Proyecto**: ✅ Primera versión funcional completada
**Fecha**: Noviembre 2025
