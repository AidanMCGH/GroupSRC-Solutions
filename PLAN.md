# PLAN.md — Refactorización del sitio Grupo SRC Solutions

Refactorización de **contenido y estética**. La funcionalidad (formulario, backend,
redes, rutas) se mantiene. Trabajo en la rama `refactor/rediseno-src`, con commits
pequeños por sección. Espero tu aprobación antes de empezar.

---

## Alcance y restricciones

- **No toco:** `.env`, credenciales, `server/*.js` (lógica de envío, DB, migraciones),
  ni las integraciones. La única excepción sería *reducir campos del formulario*, que
  requiere backend → lo dejo como **decisión pendiente (D1)**, no lo hago sin tu OK.
- **Sin dependencias nuevas.** Al contrario: elimino 3 CDNs (Google Fonts, Font Awesome,
  canvas-confetti) y autoalojo las fuentes.
- **Rutas sin cambios:** `/` → `index.html`, `/legal.html`. No se rompen URLs.

## Decisiones pendientes (necesito tu respuesta antes de esas fases)

- **D1 — Campos del formulario.** El brief pide reducir a *nombre / correo / empresa(opc)
  / mensaje* y quitar el `select` "Servicio de interés". Eso obliga a tocar `routes.js`
  (validación) y `db.js` (columna `service TEXT NOT NULL`). **Dos opciones:**
  - (a) *Solo front:* mantengo el backend igual y envío `service` con un valor fijo
    (p. ej. "Consulta general") y `empresa` dentro del `message`. Cero cambios de backend.
  - (b) *Front + back:* reduzco de verdad los campos y ajusto `routes.js`/`db.js`.
  - **Recomiendo (a)** para no tocar backend en esta refactorización. Confírmame.
- **D2 — Datos de contacto** (teléfono/WhatsApp, dirección, plazo de respuesta): los que
  no pueda verificar quedan como `TODO:` visibles. No invento valores.

---

## Orden de trabajo (una sección = un commit)

### Fase 0 — Preparación
- Crear rama `refactor/rediseno-src`.
- Descargar y autoalojar fuentes woff2 (Archivo variable, IBM Plex Sans 400,
  IBM Plex Mono 500) en `public/includes/fonts/`. `@font-face` con `font-display: swap`
  + `<link rel="preload">` solo del peso del hero.

### Fase 1 — Sistema de diseño (tokens + base CSS)
- Reescribir `styles.css`: variables `--tinta/--blanco/--niebla/--grafito/--linea/--senal`,
  escala de espaciado (8·12·16·24·32·48·64·96), tipografía fluida `clamp()`,
  reglas de tracking, contenedor máx. 1200 px.
- Borrar la paleta vieja (`--secondary-color`, etc.), sombras de color, degradados.
- Set de **iconos SVG inline** (trazo 1.5, 24×24) para reemplazar Font Awesome.

### Fase 2 — Estructura HTML + Hero + Header/Nav
- Nuevo `<head>`: quitar CDNs, meta propios, Open Graph, JSON-LD `Organization`,
  preload de fuente. Un solo `<h1>`.
- Header con logo (disco) + nav; menú móvil accesible por teclado.
- Hero fondo tinta, aros hairline al borde derecho, sin imagen. Titular y bajada nuevos,
  botones **Conversemos** / **Ver qué hacemos**.

### Fase 3 — Secciones de contenido (según textos del brief)
1. Qué problemas resolvemos (rejilla 6, numerada 01–06).
2. Servicios (3×3, ícono + nombre + línea).
3. Cómo trabajamos (9 etapas / 3 momentos, discos numerados; disco 09 en azul señal).
4. Tecnologías (chips con borde hairline, **texto sin logos**).
5. Desarrollos propios (3 tarjetas con `TODO: captura pendiente`).
6. Calidad y seguridad (2 bloques + frases destacadas).
7. Por qué elegirnos (fondo tinta, 4 razones + párrafo de honestidad).

### Fase 4 — Contacto + Footer
- Remaquetar el formulario conservando el handler de `main.js` (según D1).
- Estados de carga/éxito/error accesibles (mensaje junto al campo, no solo color).
- Footer: conservar redes con `aria-label`, enlace a aviso de privacidad, sin newsletter.

### Fase 5 — JS
- Reescribir `main.js`: quitar contador animado y confetti; conservar menú, smooth scroll,
  año del footer, envío del formulario. Respetar `prefers-reduced-motion`.
- Animaciones solo opacidad/desplazamientos cortos 150–300 ms.

### Fase 6 — legal.html
- Actualizar estética a los tokens nuevos; revisar textos de privacidad para que
  coincidan con lo que el formulario realmente recoge.

### Fase 7 — Cierre y verificación
- Responsive 360/768/1024/1440. Accesibilidad AA (contraste grafito/niebla, foco,
  jerarquía de headings). Lighthouse ≥ 95.
- Entregables: lista de `TODO:`, resultados Lighthouse, capturas móvil/escritorio,
  y lista de contenido eliminado por no verificable.

---

## Contenido que se ELIMINA por no ser verificable
- Sección "Estadísticas" completa (7 proyectos, 10 clientes, +95%, 3 años, "Desde 2022").
- Sección "Testimonios" completa (María López/SIASUR, Carla Menéndez/Restaurante True).
- Frases vacías: "impulsan tu negocio", "Transformamos negocios…", "Innovación digital a tu medida".
- Imágenes: `desarrollobg.jpg` (stock), `cliente1.jpg`, `cliente2.jpg` (testimonios falsos).

## TODO conocidos (a confirmar contigo, D2)
- `TODO:` número de WhatsApp real (hoy `href="#"`).
- `TODO:` verificar Instagram (`grupo_src`, parámetro `igsh` truncado) y GitHub (`AidanMCGH`).
- `TODO:` dirección completa (hoy solo "Aragua, Maracay – Venezuela").
- `TODO:` plazo real de respuesta a mensajes del formulario.
- `TODO:` imagen Open Graph de marca.
