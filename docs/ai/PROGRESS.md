# Bitácora de Progreso — landingPageSol (Sol Cantero)

## [2026-03-23]

**Qué se hizo:**
- Commit inicial del proyecto: scaffold Vite + React + TypeScript + Tailwind (`first commit`), incluye `README.md`, `eslint.config.js`, `index.html` y build de `dist/` (commiteado en ese momento).
- Se agregó `.gitignore` (commit `fix gitignore`), aunque con un error inicial (línea `node_modules` duplicada).

**Archivos tocados:** `README.md`, `eslint.config.js`, `index.html`, `.gitignore`, `dist/*`, `node_modules/*` (commiteados por error en el primer commit).

**Pendiente / a revisar:** en el primer commit se incluyeron `node_modules/` y `dist/` en el repo; se corrige recién en los commits siguientes.

---

## [2026-03-24]

**Qué se hizo:**
- Se corrigió el `.gitignore`: se sacó `dist` del tracking y se agregaron `dist-ssr`, `*.local`, `*.log`, `.DS_Store` (commit `fix: remove dist from tracking`).
- Cambios de copy/textos en el sitio (commit `modificaciones de textos`): ajustes en `Header.tsx`, `About.tsx`, `Courses.tsx`, `Hero.tsx`, `Services.tsx`, `index.css`, `tailwind.config.js` y rebuild de `dist/`.
- Corrección ortográfica puntual en `About.tsx` (commit `error ortografico`).
- Se actualizó el `README.md` (commit `readme actalizado`), reescritura parcial (77 inserciones / 61 eliminaciones).
- Commit grande de optimización para producción y datos reales del negocio (`feat: production-ready optimization & real business data`):
  - **SEO**: `index.html` reescrito con meta tags completos, Open Graph, Twitter Card, Schema.org tipo `BeautySalon`, geo tags y canonical para `solcantero.com.ar`. Cambio de `lang="en"` a `lang="es-AR"`.
  - **Header**: menú hamburguesa mobile con drawer animado (Framer Motion), scroll lock del body, atributos aria, manejo de click en nav con scroll suave.
  - **Footer**: reemplazo de datos placeholder por datos reales del negocio — dirección (Lobato 680, Claypole), teléfono (+54 11 3184-6305), link a Instagram, horario (mar-sáb 9-19hs) y link directo a Google Maps.
  - **Services**: corrección de número de WhatsApp incorrecto (`5491112345678` → `541131846305`), constante `WA_PHONE` centralizada en el propio archivo, aria-labels en las cards.
  - **Gallery**: `loading=lazy` / `decoding=async` en imágenes, conversión del array de imágenes a objetos con alt text descriptivo en español (SEO), parámetro `&w=800` en URLs de Unsplash para reducir peso.
  - **Vite**: `manualChunks` (vendor-react / vendor-motion / vendor-ui), alias de path `@` → `src`, `assetsInlineLimit` y `chunkSizeWarningLimit`.
  - Limpieza de estilos residuales del template de Vite en `App.css`.

**Archivos tocados:** `.gitignore`, `index.html`, `vite.config.ts`, `src/App.css`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/sections/{About,Courses,Hero,Services,Gallery}.tsx`, `README.md`.

**Pendiente / a revisar:** no se pudo determinar el detalle línea por línea de `modificaciones de textos` sobre `Hero.tsx`/`Services.tsx` más allá del resumen de diff (cambios de copy y clases de estilo).

---

## [2026-03-29]

**Qué se hizo:**
- Se agregó una pantalla de intro (`IntroScreen.tsx`, componente nuevo de ~212 líneas) con secuencia animada tipo editorial, integrada en `App.tsx` vía `AnimatePresence`. Usa `sessionStorage` (`sc_intro_seen`) para no repetir la intro en la misma sesión y bloquea el scroll del body mientras se muestra (commit `intro a la pagina`).
- Se agregó un archivo `repo_completo.txt` (dump del repo, ~1428 líneas) — no es código de la app.
- Segundo commit del mismo día (`feat: add intro screen, centralize constants and add custom favicon`):
  - Se creó `src/lib/constants.ts` como fuente única de verdad para `WA_PHONE`, `WA_URL`, `IG_URL`, `MAPS_URL` y `SESSION_KEY`, reemplazando las constantes que estaban duplicadas en cada componente (`Footer`, `Header`, `Courses`, `Hero`, `Services`, `IntroScreen`).
  - Favicon custom (`public/favicon.svg`) con iniciales "SC" en los colores del proyecto, reemplazando el ícono default de Vite.
  - Fix de tipos de Framer Motion v12 (cubic-bezier tipado explícito como tupla) para los `ease` usados en las animaciones.

**Archivos tocados:** `src/App.tsx`, `src/components/sections/IntroScreen.tsx`, `src/lib/constants.ts`, `public/favicon.svg`, `src/components/layout/{Header,Footer}.tsx`, `src/components/sections/{Courses,Hero,Services}.tsx`.

**Pendiente / a revisar:** `repo_completo.txt` quedó commiteado en el repo en este punto (se borra recién en el working tree actual, sin commitear todavía — ver sección de cambios sin commitear).

---

## [2026-04-06]

**Qué se hizo:**
- Commit `fotos y styles`: se agregaron 11 imágenes reales a `public/images/` (entrada, filosofía, kaping, lifting de pestañas, manos y pies, microblading, perfilado de cejas, portada, profesora con alumnas, softgel, tarjeta de fidelidad). El commit es solo binarios (no se pudo determinar qué cambios de "styles" mencionados en el mensaje corresponden a código, ya que el diff no muestra cambios de texto en esta cabeza de commit).

**Archivos tocados:** `public/images/*.jpeg`, `public/images/profesora-con-alumnas.jpg`.

**Pendiente / a revisar:** el mensaje del commit menciona "styles" pero el diff registrado en este commit es exclusivamente de imágenes; no se pudo determinar en qué commit quedaron reflejados esos cambios de estilos (posiblemente están entre los cambios sin commitear actuales).

---

## Estado actual — cambios sin commitear (al momento de esta entrada)

Al día de hoy (2026-04-06 en el árbol local, fecha de esta bitácora 2026-08-03) hay trabajo en curso en el working tree que todavía no fue commiteado:

- **Firebase Hosting**: aparecen `.firebaserc`, `firebase.json`, `.firebase/` y `.env.production` como archivos nuevos sin trackear — indica que se configuró (o se está configurando) el deploy a Firebase Hosting.
- **Nuevos componentes**: `src/components/sections/Popup.tsx` y `src/components/ui/WhatsAppWidget.tsx` (sin trackear, no hay commit que los documente).
- **Nuevos assets**: `public/curso_soft_gel_v2.html`, `public/fonts/`, `public/videos/`, `public/images/logo-widget.png` (sin trackear).
- **`package.json`**: el script `build` fue modificado para copiar `public/curso_soft_gel_v2.html` a `dist/curso-soft-gel.html` después del build de Vite.
- **Modificados sin commitear**: `src/App.tsx`, `src/components/layout/Footer.tsx`, `src/components/sections/{About,Courses,Gallery,Hero,IntroScreen,Services,Testimonials}.tsx`, `src/index.css`, `src/lib/constants.ts`, `tailwind.config.js`, `public/images/microblading.jpeg` (reemplazada).
- **Eliminado en el working tree (sin commitear)**: `repo_completo.txt`.

**Pendiente / a revisar:** todo este bloque es trabajo en progreso no commiteado; no hay mensajes de commit ni historia que documenten la intención exacta de cada cambio. Se recomienda revisar y commitear en unidades lógicas (Firebase/deploy, Popup + WhatsAppWidget, contenido de cursos/imágenes, ajustes de estilos) para que quede trazable.

---

## [2026-08-04]

**Qué se hizo:**
- Rama `fidelizacion-front` (aún no mergeada a `main`, un commit por encima: `feat: portal de fidelización para clientas (login Google, sellos, historial)`). Construye el portal de fidelización de clientas que consume el backend nuevo del repo Sol Admin (rama `fidelizacion`).
- Router con `react-router-dom`: la landing pública sigue igual, se movió tal cual a `src/pages/LandingPage.tsx`; se agregó la ruta nueva `/mi-fidelidad`.
- Login con Google (`@react-oauth/google`) contra el backend de Sol Admin, sesión con token bearer en `localStorage`.
- Máquina de estados en `FidelidadPage`: login → pedir teléfono (primera vez) → esperando revisión de Sol (vinculación ambigua) → dashboard.
- Dashboard de fidelización: tarjeta de 10 sellos (`TarjetaSellos`), tarjeta de premio con animación de flip (`PremioCard`, el giro es idempotente del lado backend), historial de servicios con paginación "Cargar más" (`Historial`). Reusa los tokens de diseño existentes (gold/charcoal/font-serif); a diferencia del resto de la landing, acá no hay fallback silencioso porque son datos reales de la cuenta de la clienta.
- Link "Mi Fidelidad" agregado al header, en desktop y en el drawer mobile.
- Se sumaron al commit `Popup.tsx` y `WhatsAppWidget.tsx`: ya estaban deployados a producción (confirmado vía caché local de `.firebase/hosting`) pero nunca habían quedado commiteados en git. Sumarlos acá no cambia nada de lo que ya está en vivo, solo lo deja registrado.
- El resto del WIP viejo sin commitear en `main` (config de Firebase, fotos, ajustes de estilos en las secciones existentes, `curso_soft_gel_v2.html`) quedó deliberadamente sin tocar en este commit, para que Juanma lo revise aparte.
- PR abierto (sin mergear): https://github.com/DepaoloJuan/landingPageSol/pull/new/fidelizacion-front

**Archivos tocados:** `src/App.tsx`, `src/main.tsx`, `src/pages/LandingPage.tsx` (nuevo), `src/pages/fidelidad/FidelidadPage.tsx` (nuevo), `src/components/fidelidad/{Dashboard,GoogleLoginButton,Historial,PremioCard,TarjetaSellos,TelefonoForm}.tsx` (nuevos), `src/lib/fidelidadApi.ts` (nuevo), `src/components/layout/Header.tsx`, `src/components/sections/Popup.tsx` (nuevo, ya deployado antes), `src/components/ui/WhatsAppWidget.tsx` (nuevo, ya deployado antes), `package.json`, `package-lock.json`.

**Pendiente / a revisar:**
- La rama no está mergeada a `main` ni deployada.
- Falta configurar `VITE_GOOGLE_CLIENT_ID` en Google Cloud Console (mismo Client ID que usa el backend) para que el login funcione de punta a punta; se agregó vacía en `.env.local` (no trackeado).
- Sigue sin tocarse el bloque de WIP viejo descrito en la entrada anterior (Firebase config, fotos, estilos de secciones existentes, `curso_soft_gel_v2.html`) — sigue pendiente de revisión y commit aparte.

---

## [2026-08-04] (2)

**Qué se hizo:**
- Sigue en `fidelizacion-front` (aún sin mergear a `main`), commit `feat: login/registro por email+contraseña, reseteo de contraseña` por encima del anterior de la rama.
- Login/registro manual con email+contraseña como alternativa al login de Google, para clientas sin cuenta de Gmail (Yahoo, iCloud, etc.): componentes nuevos `EmailLoginForm`, `EmailRegistroForm`, `OlvidePasswordForm`, con toggle entre las tres vistas (y Google) en `FidelidadPage`.
- Ruta nueva `/mi-fidelidad/resetear` (`ResetearPasswordPage`), lee el token desde la URL con `useSearchParams`.
- `fidelidadApi.ts`: se agregan `registro`, `loginEmail`, `olvidePassword`, `resetearPassword`. El backend correspondiente (Sol Admin, rama `fidelizacion`, otro repo) agregó los endpoints y el envío de mail vía Resend.
- `Progreso.nombre_google` renombrado a `Progreso.nombre` — ya no se asume que el nombre viene siempre de Google, ahora puede venir de una cuenta manual.
- Ajustes de UI en el dashboard por feedback directo de cómo se veía en pantalla: botón de "Cerrar sesión" reposicionado (antes al lado del saludo, ahora fijo arriba a la derecha con `fixed top-6 right-6`); `Historial` ahora se muestra colapsado a los últimos 3 turnos por default, con botón "Ver historial completo" para desplegar el resto.
- Primera vez que `docs/ai/CONTEXT.md` y `docs/ai/PROGRESS.md` quedan trackeados en git en este repo — existían en el working tree pero nunca se habían commiteado.

**Archivos tocados:** `src/components/fidelidad/EmailLoginForm.tsx` (nuevo), `src/components/fidelidad/EmailRegistroForm.tsx` (nuevo), `src/components/fidelidad/OlvidePasswordForm.tsx` (nuevo), `src/pages/fidelidad/ResetearPasswordPage.tsx` (nuevo), `src/pages/fidelidad/FidelidadPage.tsx`, `src/components/fidelidad/Dashboard.tsx`, `src/components/fidelidad/Historial.tsx`, `src/lib/fidelidadApi.ts`, `src/App.tsx`, `docs/ai/CONTEXT.md`, `docs/ai/PROGRESS.md`.

**Pendiente / a revisar:**
- La rama sigue sin mergear a `main` ni deployada.
- El WIP viejo sin commitear (config de Firebase, fotos, ajustes de estilos en las secciones existentes de la landing pública) sigue intacto, sin tocar en este commit.
- No se verificó en esta entrada si el flujo de reseteo de contraseña se probó de punta a punta contra el backend real.
