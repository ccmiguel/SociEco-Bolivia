# Sistema de Diseño SOCIECO (React + Tailwind CSS)

Basado en el análisis de tu prototipo de Figma para **SOCIECO**, he extraído los tokens de diseño (colores, tipografía) y he generado los componentes base de React utilizando Tailwind CSS.

## 1. Configuración de Tailwind CSS (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        socieco: {
          primary: '#D9ED92',   // Verde lima claro (Botones principales, progreso)
          secondary: '#F9A482', // Naranja pastel (Acentos, insignias)
          dark: '#2D4635',      // Verde oliva oscuro (Cabecera principal, texto destacado)
          bg: '#FDFBF7',        // Crema / Off-white (Fondo general de la app)
          text: '#1A2F23',      // Texto principal
          muted: '#4A5568',     // Texto secundario
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], 
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
```

## 2. Componentes de React

Los componentes base han sido guardados en `src/components/`:
- `Button.tsx`: Botón principal.
- `Input.tsx`: Campos de entrada de formulario.
- `BottomNav.tsx`: Menú de navegación inferior.
- `Card.tsx`: Tarjetas base.
