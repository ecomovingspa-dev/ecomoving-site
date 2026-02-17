# Ecomoving Public Site

Este es el sitio público oficial de **Ecomoving**, diseñado para ser ligero, premium y sincronizado en tiempo real con el panel de administración.

## Características
- **Catálogo Dinámico**: Sincronizado directamente con Supabase (`agent_buffer`).
- **Landing por Bloques**: Réplica exacta del diseño visual del panel administrativo a través de bloques Bento.
- **Optimización Premium**: Estilos minimalistas, animaciones fluidas con Framer Motion y tipografía editorial.
- **Lead Magnet**: Sistema integrado para captación de clientes interesados en el catálogo 2026.

## Estructura
- `/`: Landing page dinámica con secciones de productos y portfolio.
- `/catalogo`: Catálogo completo de productos con buscador en tiempo real.
- `lib/useWebContent.ts`: Hook maestro para la alimentación de datos.

## Desarrollo
```bash
npm install
npm run dev
```

## Despliegue
Este repositorio está optimizado para despliegue automático en **Vercel**.
