-- Crear enum para roles de aplicación
CREATE TYPE public.app_role AS ENUM ('admin');

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función segura para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Función helper para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Solo admins pueden ver roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Solo admins pueden insertar roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Tabla de empresas (accounts/companies)
CREATE TABLE public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    nit VARCHAR(50),
    telefono VARCHAR(50),
    email VARCHAR(255),
    direccion TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar empresas"
ON public.empresas FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Tabla de usuarios finales (personal de cada empresa)
CREATE TABLE public.usuarios_finales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    numero_documento VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    celular VARCHAR(50),
    email VARCHAR(255),
    codigo_unico VARCHAR(100) UNIQUE,
    datos_adicionales JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (empresa_id, numero_documento)
);

ALTER TABLE public.usuarios_finales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar usuarios finales"
ON public.usuarios_finales FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Usuarios finales pueden ver su propia info"
ON public.usuarios_finales FOR SELECT
TO anon
USING (true);

-- Tabla de aplicativos globales
CREATE TABLE public.aplicativos_globales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    campos_requeridos JSONB DEFAULT '[]',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.aplicativos_globales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar aplicativos globales"
ON public.aplicativos_globales FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Tabla de aplicativos por empresa
CREATE TABLE public.aplicativos_empresa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    campos_personalizados JSONB DEFAULT '{}',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.aplicativos_empresa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar aplicativos de empresa"
ON public.aplicativos_empresa FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Tabla de asignaciones de aplicativos a usuarios finales
CREATE TABLE public.asignaciones_aplicativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_final_id UUID REFERENCES public.usuarios_finales(id) ON DELETE CASCADE NOT NULL,
    aplicativo_global_id UUID REFERENCES public.aplicativos_globales(id) ON DELETE CASCADE,
    aplicativo_empresa_id UUID REFERENCES public.aplicativos_empresa(id) ON DELETE CASCADE,
    datos_acceso JSONB DEFAULT '{}',
    notas TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CHECK (
        (aplicativo_global_id IS NOT NULL AND aplicativo_empresa_id IS NULL) OR
        (aplicativo_global_id IS NULL AND aplicativo_empresa_id IS NOT NULL)
    )
);

ALTER TABLE public.asignaciones_aplicativos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar asignaciones"
ON public.asignaciones_aplicativos FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Usuarios finales pueden ver sus asignaciones"
ON public.asignaciones_aplicativos FOR SELECT
TO anon
USING (true);

-- Tabla de alarmas/tickets
CREATE TABLE public.alarmas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_final_id UUID REFERENCES public.usuarios_finales(id) ON DELETE CASCADE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    prioridad VARCHAR(50) DEFAULT 'media',
    archivos_adjuntos JSONB DEFAULT '[]',
    comentarios JSONB DEFAULT '[]',
    resuelta_por UUID REFERENCES auth.users(id),
    resuelta_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.alarmas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden gestionar alarmas"
ON public.alarmas FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Usuarios pueden crear alarmas"
ON public.alarmas FOR INSERT
TO anon
WITH CHECK (true);

-- Tabla de historial de cambios
CREATE TABLE public.historial_cambios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tabla VARCHAR(100) NOT NULL,
    registro_id UUID NOT NULL,
    accion VARCHAR(50) NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.historial_cambios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden ver historial"
ON public.historial_cambios FOR SELECT
TO authenticated
USING (public.is_admin());

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_empresas_updated_at
    BEFORE UPDATE ON public.empresas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usuarios_finales_updated_at
    BEFORE UPDATE ON public.usuarios_finales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aplicativos_globales_updated_at
    BEFORE UPDATE ON public.aplicativos_globales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_aplicativos_empresa_updated_at
    BEFORE UPDATE ON public.aplicativos_empresa
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_asignaciones_aplicativos_updated_at
    BEFORE UPDATE ON public.asignaciones_aplicativos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alarmas_updated_at
    BEFORE UPDATE ON public.alarmas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para mejorar rendimiento
CREATE INDEX idx_usuarios_finales_empresa ON public.usuarios_finales(empresa_id);
CREATE INDEX idx_usuarios_finales_codigo ON public.usuarios_finales(codigo_unico);
CREATE INDEX idx_asignaciones_usuario ON public.asignaciones_aplicativos(usuario_final_id);
CREATE INDEX idx_alarmas_usuario ON public.alarmas(usuario_final_id);
CREATE INDEX idx_alarmas_estado ON public.alarmas(estado);