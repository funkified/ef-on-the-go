# EF On-the-Go Landing (Solar + ADT)

Repo estático + API routes en Vercel para operar desde iPhone:
- Capturar lead (offline-first): guarda local y abre WhatsApp con tarjeta
- Generar Morning Pack (demo): botón que llama /api/generate
- Kanban local: status/owner + export JSON (copiar)

## Deploy en Vercel (GitHub)
1) Crea un repo en GitHub (ej: ef-on-the-go)
2) Sube estos archivos:
   - index.html
   - vercel.json
   - api/lead.js
   - api/generate.js
3) En Vercel: New Project → Import Git Repo → Deploy

## Prueba rápida
- Abre: https://TUAPP.vercel.app/
- Captura un lead y verifica que abre WhatsApp
- Prueba API:
  - https://TUAPP.vercel.app/api/lead  (debe dar 405 en navegador)
  - Generate en la UI debe mostrar un Morning Pack

## Configurar números
En index.html, al inicio del script:
- MY_WA: tu número (formato 1XXXXXXXXXX)
- IVAN_WA: Ivan
- DANNY_WA: Danny
# ef-on-the-go-landing
