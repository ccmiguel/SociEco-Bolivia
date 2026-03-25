# Base de Datos y Autenticación (Supabase)

Esta carpeta contiene la configuración principal y los scripts de migración SQL para la base de datos de SOCIECO.

## Conexiones Independientes por Microservicio
Siguiendo la arquitectura de Microservicios:
- **Frontend (Next.js)**: Utiliza `src/services/supabase.ts` en la carpeta `frontend/` para autenticación y consumo de datos mediante `@supabase/supabase-js`.
- **Backend AI (Flask)**: Utiliza `config.py` en la carpeta `backend-ai/` utilizando la librería de Python `supabase`.

## Variables de Entorno
Cada microservicio deberá contar con su archivo `.env` independiente conteniendo:
- `SUPABASE_URL`
- `SUPABASE_KEY` (Anon Key para frontend, Service Role Key para backend si requiere acceso privilegiado).
