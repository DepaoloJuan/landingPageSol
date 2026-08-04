# CONTEXT.md — Sol Cantero Landing Page
_Última actualización: 2026-08-04_

## Qué es esto
Landing page institucional de "Sol Cantero, Centro de Belleza" (Claypole, Buenos Aires). Sitio de presentación/marketing: muestra servicios, cursos, galería de resultados y testimonios, con el objetivo de derivar contactos a WhatsApp. En la rama `fidelizacion-front` (**no mergeada a `main`**) se le agregó además un portal de fidelización para clientas (`/mi-fidelidad`): login con Google, tarjeta de sellos y premios. El sitio sigue siendo 100% frontend — los datos dinámicos de la landing pública y los del portal de fidelización se consumen de APIs externas; **este repo no tiene base de datos propia**.

## Stack
- **Frontend:** React 19 + TypeScript + Vite 8
- **Ruteo:** `react-router-dom` v7 (`BrowserRouter`) — **solo en la rama `fidelizacion-front`**, `main` sigue siendo single-page sin router
- **Auth:** `@react-oauth/google` — **solo en `fidelizacion-front`**, primera dependencia de auth que tiene este repo
- **Estilos:** Tailwind CSS 3 (paleta custom: beige, gold, rose, charcoal — ver `tailwind.config.js`)
- **Animación/UX:** Framer Motion (transiciones, scroll-reveal, parallax, flip cards), Lenis (smooth scroll inercial)
- **Utilidades:** `clsx` + `tailwind-merge` (helper `cn` en `src/lib/utils.ts`), `lucide-react` (iconos)
- **Datos:** sin base de datos propia — consume REST APIs externas vía `fetch` (ver sección Arquitectura)
- **Deploy:** Firebase Hosting (proyecto `sol-cantero`, config en `firebase.json` / `.firebaserc`), SPA con rewrite a `index.html`. **El deploy real hoy sigue siendo el contenido de `main`** (sin fidelización, sin router).
- **Build:** `tsc -b && vite build`; el build también copia `public/curso_soft_gel_v2.html` a `dist/curso-soft-gel.html` (landing standalone para un curso específico, servida como página estática aparte)

## Arquitectura

### En `main` (lo que está deployado hoy)
Single-page con anchors, sin router. Ver estructura general de componentes más abajo (`components/sections`, `components/layout`, `components/ui`).

### En `fidelizacion-front` (branch, no mergeada)
Se introdujo ruteo. `src/App.tsx` pasó de ser el orquestador de toda la página a ser solo el switch de rutas:

```tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/mi-fidelidad" element={<FidelidadPage />} />
</Routes>
```

Todo lo que antes vivía inline en `App.tsx` (IntroScreen → Header → secciones → Footer → Popup) se movió tal cual a `src/pages/LandingPage.tsx`. `src/main.tsx` envuelve la app en `GoogleOAuthProvider` (con `VITE_GOOGLE_CLIENT_ID`) + `BrowserRouter`.

```
src/
 ├── assets/                # imágenes bundleadas por Vite
 ├── components/
 │    ├── layout/           # Header, Footer (estructurales)
 │    ├── sections/         # secciones de la landing pública (Hero, About, Services,
 │    │                       Courses, Gallery, Testimonials, IntroScreen, Popup)
 │    ├── ui/                # átomos reutilizables (Button, Container, WhatsAppWidget)
 │    └── fidelidad/         # [branch fidelizacion-front] portal de clientas
 │         ├── GoogleLoginButton.tsx   # botón de @react-oauth/google
 │         ├── TelefonoForm.tsx        # pide teléfono para vincular cuenta la 1ra vez
 │         ├── Dashboard.tsx           # orquesta TarjetaSellos + PremioCard[] + Historial
 │         ├── TarjetaSellos.tsx       # 10 círculos, sellados en dorado
 │         ├── PremioCard.tsx          # flip animado (Framer Motion) al llegar a sello 5/10
 │         └── Historial.tsx           # turnos pasados, paginado ("Cargar más"), sin montos
 ├── pages/                  # [branch fidelizacion-front]
 │    ├── LandingPage.tsx    # landing pública completa (ex contenido de App.tsx)
 │    └── fidelidad/
 │         └── FidelidadPage.tsx  # orquestador con máquina de estados del portal
 ├── lib/
 │    ├── constants.ts      # URLs de contacto, API_URL, SESSION_KEY
 │    ├── utils.ts          # cn() = clsx + tailwind-merge
 │    └── fidelidadApi.ts   # [branch fidelizacion-front] cliente HTTP del portal (ver abajo)
 ├── App.tsx                # [branch fidelizacion-front] switch de <Routes>; en main es el orquestador de la landing
 └── main.tsx                # entry point (StrictMode + createRoot + GoogleOAuthProvider + BrowserRouter en la branch)
```

**Flujo de datos de la landing pública:** cada sección con contenido dinámico (`Services`, `Courses`, `Gallery`, `Testimonials`, `Popup`) hace su propio `fetch` a `${API_URL}/api/landing/<recurso>` en un `useEffect`, con **fallback hardcodeado en el mismo componente** si la API falla o devuelve vacío (patrón repetido, no centralizado). `API_URL` sale de `import.meta.env.VITE_API_URL`, con default `https://admin.solcantero.com.ar`.

Endpoints de landing consumidos (contrato inferido del código):
- `GET /api/landing/servicios` → `{ id, titulo, descripcion, imagenes: { id, imagen_url }[] }[]`
- `GET /api/landing/cursos` → `{ id, titulo, descripcion, imagen_url, imagen_url_fallback }[]`
- `GET /api/landing/galeria` → `{ id, imagen_url, imagen_url_fallback, alt_texto }[]`
- `GET /api/landing/testimonios` → `{ id, nombre, texto, estrellas, foto_url, foto_url_fallback }[]`
- `GET /api/landing/popup` → `{ activo, imagen_url, imagen_url_fallback, texto }`

**Flujo de datos del portal de fidelización (`fidelizacion-front`):** cliente centralizado en `src/lib/fidelidadApi.ts` (a diferencia del patrón de arriba, acá sí hay un único cliente HTTP). Maneja el token bearer en `localStorage['sc_fidelidad_token']`, agrega el header `Authorization` automáticamente, y si la respuesta es 401 borra el token. Consume el backend de **Sol Admin, rama `fidelizacion`** (repo separado — ver `Estado actual`), endpoints bajo `/api/fidelidad/*`:
- `POST /api/fidelidad/login-google` → `{ token, requiere_telefono, estado_vinculacion? }` (recibe `id_token` de Google)
- `POST /api/fidelidad/telefono` → `{ estado_vinculacion }`
- `GET /api/fidelidad/progreso` → `{ estado_vinculacion, requiere_telefono, ciclo_actual, sellos_del_ciclo, total_sellos_por_ciclo, premios[] }`
- `POST /api/fidelidad/premios/:id/girar` → `{ premio, ya_girado }`
- `GET /api/fidelidad/historial?limit=&offset=` → `{ turnos[] }` (sin montos, el backend ya los filtra)

`FidelidadPage.tsx` es una máquina de estados simple (`cargando` → `login` → `telefono` → `esperando` → `dashboard` | `error`): sin token va a `login`; con token pide `/progreso` y bifurca según `estado_vinculacion` (`auto`/`manual` → dashboard, si pide teléfono → `telefono`, si quedó ambiguo del lado del backend → `esperando`).

**Intro screen:** al entrar por primera vez en la sesión (`sessionStorage['sc_intro_seen']`) se muestra un video de bienvenida a pantalla completa (`IntroScreen`) que bloquea el scroll; Lenis solo se inicializa después de que la intro termina. Nota: usa `sessionStorage`, distinto del token de fidelización que usa `localStorage` (ver Decisiones).

**WhatsApp como canal de conversión:** no hay formularios de contacto propios ni backend de envío de mails — todos los CTA (`Header`, `Hero`, `Footer`, `WhatsAppWidget`) abren `wa.me`/`api.whatsapp.com` con el teléfono hardcodeado en `constants.ts`.

**Nav a `/mi-fidelidad`:** `Header.tsx` (branch) agrega un link "Mi Fidelidad" en desktop y en el drawer mobile usando `Link` de `react-router-dom`, distinto de los anchors `#services` que siguen resolviendo con scroll interno (Lenis + `scrollIntoView`).

## Estructura de la Base de Datos
Este repositorio **no tiene base de datos propia** ni acceso a ella (no hay `DATABASE_URL`, ORM, ni cliente de DB en las dependencias), ni en `main` ni en `fidelizacion-front`. Los datos de la landing pública los sirve `admin.solcantero.com.ar`; los datos del portal de fidelización los sirve el backend de **Sol Admin** (repo separado, rama `fidelizacion`) — el esquema de esa base hay que documentarlo desde ese repo, no desde acá.

No existe `docs/ai/db_schema_dump.sql` en este proyecto.

## Decisiones de diseño relevantes
- **Fallback local por componente en la landing pública, en vez de un cliente API centralizado:** cada sección de la landing maneja su propio `fetch` + estado de fallback. Decisión pragmática para que el sitio nunca se vea "roto" o vacío si la API del admin está caída, a costa de repetir el patrón en varios componentes.
- **`fidelidadApi.ts` SIN fallback silencioso, a propósito distinto del patrón anterior:** el portal de fidelización muestra datos reales de la cuenta de una clienta (sellos, premios, historial) — mostrar un fallback inventado ahí sería directamente incorrecto. Si el fetch falla, se propaga el error y la UI lo muestra explícitamente (estado `error` en `FidelidadPage`), no hay contenido de relleno.
- **Token de sesión de fidelización en `localStorage`, no `sessionStorage`:** a diferencia de la marca de "intro ya vista" (que usa `sessionStorage` para reaparecer en cada sesión nueva), el login de una clienta tiene que persistir entre sesiones del navegador, así que usa `localStorage` (`sc_fidelidad_token`).
- **Revelado de premio con flip animado (Framer Motion), no ruleta segmentada:** se evaluó una ruleta gráfica real pero se decidió explícitamente ir por una tarjeta que hace flip (`rotateY` + `AnimatePresence`) para revelar el premio — mucho más rápido de implementar y de mantener, mismo efecto de "sorpresa" percibido por la usuaria.
- **`VITE_API_URL` con default hardcodeado:** si la env var no está seteada, el sitio apunta a producción (`admin.solcantero.com.ar`) en vez de fallar. Bueno para demos rápidas, cuidado de no pegarle a prod sin querer en desarrollo.
- **Sin router en `main`:** landing de una sola página con anchors (`#services`, `#courses`, `#gallery`) y scroll suave (Lenis + `scrollIntoView`). Esto cambió en `fidelizacion-front` (ver Arquitectura) pero no está mergeado.
- **`curso_soft_gel_v2.html` como HTML estático plano:** vive en `public/` y se copia a `dist/curso-soft-gel.html` en el build (paso manual en el script `build` de `package.json`). Landing de venta de un curso específico, deliberadamente fuera del bundle de React.
- **IntroScreen con video bloqueante solo una vez por sesión:** usa `sessionStorage` para que el usuario la vea de nuevo en cada sesión nueva del navegador, no solo la primera vez en el dispositivo.
- **Paleta y tipografía de marca:** Cormorant Garamond (serif) + Montserrat (sans) + fuente custom `BingoDilan` (`font-brand`, widget de WhatsApp). Tokens en `tailwind.config.js` (`beige`, `cream`, `pearl`, `charcoal`, `gold`, `rose`) — no usar hex sueltos en componentes nuevos, usar estos tokens. Los componentes de fidelización reusan estos mismos tokens y los átomos `Button`/`Container` ya existentes, no se inventó paleta nueva.

## Estado actual
- **En producción (deploy real de Firebase, rama `main`):** landing pública terminada y funcionando — Hero, About, Services, Courses, Gallery, Testimonials, Footer, WhatsApp widget, IntroScreen, Popup. **No incluye router ni portal de fidelización.**
- **En desarrollo, rama `fidelizacion-front` (NO mergeada a `main`, sin deployar):** portal de fidelización completo a nivel código — router, login con Google, alta de teléfono, tarjeta de sellos, revelado de premios, historial de turnos. PR abierto: https://github.com/DepaoloJuan/landingPageSol/pull/new/fidelizacion-front. Depende del backend de **Sol Admin, rama `fidelizacion`** (repo separado) para funcionar de punta a punta.
  - **Prerequisito externo pendiente:** falta configurar `VITE_GOOGLE_CLIENT_ID` (mismo OAuth Client ID de Google Cloud que necesita el backend) — sin eso el botón de login con Google no funciona. Variable agregada vacía en `.env.local` (no trackeado).
- **Commiteado en esta misma rama pero sin relación con fidelización:** `Popup.tsx` y `WhatsAppWidget.tsx` — estaban en el working tree sin commitear desde antes; se confirmó por el caché local de Firebase (`.firebase/hosting.*.cache`) que ya estaban deployados en producción aunque nunca habían quedado en git. Commitearlos ahora solo deja registrado en git algo que ya estaba en vivo, no cambia nada del deploy.
- **WIP viejo explícitamente sin tocar (otra sesión, pendiente de revisión de Juanma):** ajustes de estilos en secciones existentes, fotos nuevas, config de Firebase (`firebase.json`, `.firebaserc`, `.firebase/`), `.env.production`, `curso_soft_gel_v2.html`. No es parte de la feature de fidelización, queda para que Juanma lo revise y commitee aparte.
- **Roadmap declarado en el README** (no confirmado como implementado, tratar como pendiente):
  - Integración con Google Calendar para turnos automáticos.
  - Panel administrativo dinámico en `admin.solcantero.com.ar` (parcialmente ya existe, dado que la landing ya consume sus endpoints `/api/landing/*`).
  - Galería conectada en tiempo real con la API de Instagram.
- **Sin tests automatizados:** no hay carpeta de tests ni configuración de test runner en `package.json`.

## Convenciones del proyecto
- **Idioma:** UI y contenido en español rioplatense; nombres de variables/componentes en inglés, pero interfaces de datos de la API en español (`titulo`, `descripcion`, `imagen_url`, `sellos_del_ciclo`) porque siguen el contrato del backend.
- **Componentes de sección (landing pública):** un archivo por sección en `src/components/sections/`, cada uno con su propio `id` de anchor (`id="services"`, etc.) para navegación por hash.
- **Componentes del portal de fidelización:** un archivo por pieza de UI en `src/components/fidelidad/`, sin anchors — navegan por ruta (`/mi-fidelidad`), no por hash.
- **Páginas (`src/pages/`):** un archivo por ruta top-level; `FidelidadPage` vive en su propia subcarpeta `pages/fidelidad/` porque orquesta varios sub-componentes de esa feature.
- **Componentes atómicos (`ui/`):** usan `forwardRef` + `cn()` para permitir override de clases vía `className`, siguiendo el patrón de `Button` y `Container`.
- **Animaciones:** variantes de Framer Motion definidas como constantes arriba del componente, con `whileInView` + `viewport={{ once: true }}` para scroll-reveal en la landing; en fidelización se usa `AnimatePresence` + `rotateY` para el flip de premios.
- **Fetch a la API de landing:** patrón fijo — `useEffect` vacío en deps, `fetch(...).then(res => res.json()).then(data => ...).catch(() => {})`, siempre con fallback local si `data` no es array o viene vacío.
- **Fetch a la API de fidelización:** todo pasa por las funciones exportadas de `src/lib/fidelidadApi.ts` (`pedido<T>()` interno), nunca `fetch` directo desde un componente. Los errores se tipan con `FidelidadApiError` y se manejan con `try/catch` explícito en cada componente, no silenciosamente.
- **Assets estáticos vs. bundleados:** imágenes de contenido van en `public/images/` y se referencian por ruta absoluta (`/images/foo.jpg`); solo assets realmente parte del build quedan en `src/assets/`.
- **Nunca commitear `.env` con valores reales** — usar `.env.local` para desarrollo y `.env.production` para el build de prod; env vars relevantes: `VITE_API_URL` y, en `fidelizacion-front`, `VITE_GOOGLE_CLIENT_ID`.
