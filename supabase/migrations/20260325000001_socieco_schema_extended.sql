-- Enable UUID extension si no está activada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================================================
-- 1. TABLA PERFILES
-- ======================================================
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'user' CHECK (rol IN ('user', 'acopiador')),
    puntos_totales INTEGER DEFAULT 0,
    co2_ahorrado DECIMAL(10,2) DEFAULT 0.0,
    agua_ahorrada DECIMAL(10,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================================
-- 2. TABLA CENTROS DE ACOPIO
-- ======================================================
CREATE TABLE IF NOT EXISTS public.centros_acopio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    precios_por_material JSONB DEFAULT '{}'::jsonb, -- Ej: {"plastico": 5.0, "vidrio": 2.5}
    horarios TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================================
-- 3. TABLA TRANSACCIONES DE RECICLAJE
-- ======================================================
CREATE TABLE IF NOT EXISTS public.transacciones_reciclaje (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
    centro_id UUID REFERENCES public.centros_acopio(id) ON DELETE SET NULL,
    material VARCHAR(100) NOT NULL,
    peso DECIMAL(10,2) NOT NULL,
    hash_blockchain VARCHAR(66),
    estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado', 'cancelado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ======================================================
-- 4. TABLA CURSOS LAKAPLAY
-- ======================================================
CREATE TABLE IF NOT EXISTS public.cursos_lakaplay (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    puntos_otorgados INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ======================================================
-- SEGURIDAD A NIVEL DE FILAS (Row Level Security - RLS)
-- ======================================================

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacciones_reciclaje ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centros_acopio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos_lakaplay ENABLE ROW LEVEL SECURITY;

-- 1. Políticas de Perfiles
-- Los usuarios solo pueden ver y editar su propio perfil.
CREATE POLICY "Usuarios pueden ver su propio perfil" 
    ON public.perfiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" 
    ON public.perfiles FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Los acopiadores (rol='acopiador') pueden ver el perfil de cualquier usuario.
CREATE POLICY "Acopiadores pueden ver perfiles de usuarios" 
    ON public.perfiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.perfiles as p 
            WHERE p.user_id = auth.uid() AND p.rol = 'acopiador'
        )
    );

-- 2. Políticas de Transacciones de Reciclaje
-- Los usuarios pueden leer y crear sus propias transacciones/entregas.
CREATE POLICY "Usuarios listan sus propias transacciones" 
    ON public.transacciones_reciclaje FOR SELECT 
    USING (
        usuario_id IN (SELECT id FROM public.perfiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Usuarios insertan transacciones propias" 
    ON public.transacciones_reciclaje FOR INSERT 
    WITH CHECK (
        usuario_id IN (SELECT id FROM public.perfiles WHERE user_id = auth.uid())
    );

-- Acopiadores pueden ver y actualizar el estado de las transacciones de reciclaje
CREATE POLICY "Acopiadores listan y gestionan transacciones" 
    ON public.transacciones_reciclaje FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.perfiles as p 
            WHERE p.user_id = auth.uid() AND p.rol = 'acopiador'
        )
    );

CREATE POLICY "Acopiadores pueden actualizar transacciones" 
    ON public.transacciones_reciclaje FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.perfiles as p 
            WHERE p.user_id = auth.uid() AND p.rol = 'acopiador'
        )
    );

-- 3. Políticas de Centros de Acopio y Cursos LakaPlay
-- Lectura pública para cualquier usuario autenticado
CREATE POLICY "Lectura libre para centros acopio" 
    ON public.centros_acopio FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Lectura libre para cursos LakaPlay" 
    ON public.cursos_lakaplay FOR SELECT USING (auth.uid() IS NOT NULL);


-- ======================================================
-- TRIGGERS / FUNCIONES
-- ======================================================
-- Genera un perfil automáticamente tras el registro en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfiles (user_id, nombre, rol)
  VALUES (
      new.id, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo'), 
      COALESCE(new.raw_user_meta_data->>'rol', 'user')
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
