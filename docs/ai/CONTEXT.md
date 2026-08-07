# CONTEXT.md — Sol Cantero Landing Page
_Última actualización: 2026-08-06_

## Qué es esto
Landing page institucional de "Sol Cantero, Centro de Belleza" (Claypole, Buenos Aires). Sitio de presentación/marketing: muestra servicios, cursos, galería de resultados y testimonios, con el objetivo de derivar contactos a WhatsApp. Incluye además un portal de fidelización para clientas (`/mi-fidelidad`): login con Google o con email/contraseña, tarjeta de sellos, carrusel de tarjetas anteriores, revelado de premios y canje, e instalación como PWA ("Mi Fidelidad"). El sitio sigue siendo 100% frontend — los datos dinámicos de la landing pública y los del portal de fidelización se consumen de APIs externas; **este repo no tiene base de datos propia**.

## Stack
- **Frontend:** React 19 + TypeScript + Vite 8
- **Ruteo:** `react-router-dom` v7 (`BrowserRouter`)
- **Auth:** `@react-oauth/google` (login con Google), convive con login/registro manual por email+contraseña (sin librería extra, contra el backend propio)
- **Estilos:** Tailwind CSS 3 (paleta custom: beige, gold, rose, charcoal — ver `tailwind.config.js`)
- **Animación/UX:** Framer Motion (transiciones, scroll-reveal, parallax, carrusel coverflow, modales), Lenis (smooth scroll inercial)
- **Utilidades:** `clsx` + `tailwind-merge` (helper `cn` en `src/lib/utils.ts`), `lucide-react` (iconos)
- **PWA:** sin librería (`vite-plugin-pwa` no se usa) — manifest y service worker manuales, solo para el portal `/mi-fidelidad` (ver Arquitectura)
- **Datos:** sin base de datos propia — consume REST APIs externas vía `fetch` (ver sección Arquitectura)
- **Deploy:** Firebase Hosting (proyecto `sol-cantero`, sitio `sol-cantero.web.app`, config en `firebase.json` / `.firebaserc`), SPA con rewrite a `index.html`. **En producción desde el 2026-08-06** (PR #1, rama `fidelizacion-front` mergeada a `main`): landing pública + portal de fidelización + PWA instalable.
- **Build:** `tsc -b && vite build`; el build también copia `public/curso_soft_gel_v2.html` a `dist/curso-soft-gel.html` (landing standalone para un curso específico, servida como página estática aparte)

## Arquitectura
`src/App.tsx` es el switch de rutas:

```tsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/mi-fidelidad" element={<FidelidadPage />} />
  <Route path="/mi-fidelidad/" element={<FidelidadPage />} />
  <Route path="/mi-fidelidad/resetear" element={<ResetearPasswordPage />} />
</Routes>
```

Todo lo que antes vivía inline en `App.tsx` (IntroScreen → Header → secciones → Footer → Popup) vive en `src/pages/LandingPage.tsx`. `src/main.tsx` envuelve la app en `GoogleOAuthProvider` (con `VITE_GOOGLE_CLIENT_ID`) + `BrowserRouter`.

```
src/
 ├── assets/                # imágenes bundleadas por Vite
 ├── components/
 │    ├── layout/           # Header, Footer (Footer renderiza <WhatsAppWidget/>)
 │    ├── sections/         # secciones de la landing pública (Hero, About, Services,
 │    │                       Courses, Gallery, Testimonials, IntroScreen, Popup)
 │    ├── ui/                # átomos reutilizables (Button, Container, WhatsAppWidget)
 │    └── fidelidad/         # portal de clientas
 │         ├── GoogleLoginButton.tsx   # botón de @react-oauth/google
 │         ├── EmailLoginForm.tsx      # login manual con email + contraseña
 │         ├── EmailRegistroForm.tsx   # alta manual: nombre + email + password + confirmar + teléfono, todo en un paso
 │         ├── OlvidePasswordForm.tsx  # pide email, dispara el mail de reseteo (Resend, del lado del backend)
 │         ├── TelefonoForm.tsx        # pide teléfono para vincular cuenta la 1ra vez (solo en el flujo de Google)
 │         ├── Dashboard.tsx           # orquesta TarjetasCarousel + PremioCard[] + Historial; saludo "¡Bienvenida, {nombre}!"
 │         ├── TarjetasCarousel.tsx    # carrusel coverflow (drag + flechas) con la tarjeta actual + tarjetas de ciclos anteriores
 │         ├── TarjetaSellos.tsx       # una tarjeta individual (10 círculos, sellados en dorado); usada como slide dentro del carrusel
 │         ├── PremioCard.tsx          # botón "girar" por premio disponible; abre PremioModal y maneja el estado girando/resultado
 │         ├── PremioModal.tsx         # modal fullscreen: spinner ("Descubriendo tu premio...") → reveal con scale-spring y botón de cierre
 │         └── Historial.tsx           # últimos 3 turnos por default, "Ver historial completo" despliega el resto
 ├── pages/
 │    ├── LandingPage.tsx    # landing pública completa (ex contenido de App.tsx)
 │    └── fidelidad/
 │         ├── FidelidadPage.tsx        # orquestador con máquina de estados del portal + toggle Google/email; llama a usePwaFidelidad()
 │         └── ResetearPasswordPage.tsx # ruta /mi-fidelidad/resetear, lee el token de la URL (useSearchParams)
 ├── lib/
 │    ├── constants.ts      # URLs de contacto, API_URL, SESSION_KEY
 │    ├── utils.ts          # cn() = clsx + tailwind-merge
 │    ├── fidelidadApi.ts   # cliente HTTP del portal (ver abajo)
 │    └── usePwaFidelidad.ts # hook que registra manifest + service worker de "Mi Fidelidad" (ver PWA)
 ├── App.tsx                # switch de <Routes>
 └── main.tsx                # entry point (StrictMode + createRoot + GoogleOAuthProvider + BrowserRouter)
```

**Flujo de datos de la landing pública:** cada sección con contenido dinámico (`Services`, `Courses`, `Gallery`, `Testimonials`, `Popup`) hace su propio `fetch` a `${API_URL}/api/landing/<recurso>` en un `useEffect`, con **fallback hardcodeado en el mismo componente** si la API falla o devuelve vacío (patrón repetido, no centralizado). `API_URL` sale de `import.meta.env.VITE_API_URL`, con default `https://admin.solcantero.com.ar`.

Endpoints de landing consumidos (contrato inferido del código):
- `GET /api/landing/servicios` → `{ id, titulo, descripcion, imagenes: { id, imagen_url }[] }[]`
- `GET /api/landing/cursos` → `{ id, titulo, descripcion, imagen_url, imagen_url_fallback }[]`
- `GET /api/landing/galeria` → `{ id, imagen_url, imagen_url_fallback, alt_texto }[]`
- `GET /api/landing/testimonios` → `{ id, nombre, texto, estrellas, foto_url, foto_url_fallback }[]`
- `GET /api/landing/popup` → `{ activo, imagen_url, imagen_url_fallback, texto }`

**Flujo de datos del portal de fidelización:** cliente centralizado en `src/lib/fidelidadApi.ts` (a diferencia del patrón de arriba, acá sí hay un único cliente HTTP). Maneja el token bearer en `localStorage['sc_fidelidad_token']`, agrega el header `Authorization` automáticamente, y si la respuesta es 401 borra el token. Consume el backend de **Sol Admin** (repo separado, en producción en `https://admin.solcantero.com.ar`), endpoints bajo `/api/fidelidad/*`:
- `POST /api/fidelidad/login-google` → `{ token, requiere_telefono, estado_vinculacion? }` (recibe `id_token` de Google)
- `POST /api/fidelidad/registro` → `{ token, requiere_telefono, estado_vinculacion? }` (alta manual: nombre + email + password + teléfono en un solo request)
- `POST /api/fidelidad/login` → `{ token, requiere_telefono, estado_vinculacion? }` (login manual con email + password)
- `POST /api/fidelidad/logout` (best-effort, invalida sesión del lado del backend; se llama antes de borrar el token local)
- `POST /api/fidelidad/olvide-password` → `{ ok, mensaje }` (dispara el mail de reseteo del lado del backend, vía Resend)
- `POST /api/fidelidad/resetear-password` → `{ ok, mensaje }` (recibe el `token` del link del mail + `password_nueva`)
- `POST /api/fidelidad/telefono` → `{ estado_vinculacion }`
- `GET /api/fidelidad/progreso` → `{ estado_vinculacion, requiere_telefono, nombre, ciclo_actual, sellos_del_ciclo, total_sellos_por_ciclo, premios[] }`
- `GET /api/fidelidad/tarjetas-anteriores` → `{ tarjetas: { ciclo, premios[] }[] }` (para los slides del carrusel)
- `POST /api/fidelidad/premios/:id/girar` → `{ premio, ya_girado }`
- `GET /api/fidelidad/historial?limit=&offset=` → `{ turnos[] }` (sin montos, el backend ya los filtra)

`FidelidadPage.tsx` es una máquina de estados simple (`cargando` → `login` → `telefono` → `esperando` → `dashboard` | `error`): sin token va a `login`; con token pide `/progreso` y bifurca según `estado_vinculacion` (`auto`/`manual` → dashboard, si pide teléfono → `telefono`, si quedó ambiguo del lado del backend → `esperando`). Dentro del paso `login` hay un segundo estado interno (`vistaEmail: 'oculto' | 'login' | 'registro' | 'olvide'`) que alterna, sin cambiar de ruta, entre el botón de Google (default) y tres formularios de email: `EmailLoginForm`, `EmailRegistroForm`, `OlvidePasswordForm`.

### PWA "Mi Fidelidad"
El portal es instalable como app independiente, pero **sin push notifications reales** — pese al nombre de la rama de origen (`fidelizacion-front`), no hay `Notification.requestPermission`, suscripción push ni backend para eso; es solo instalabilidad.

- `public/manifest-fidelidad.json`: manifest propio (no el de la landing), `start_url`/`scope` = `/mi-fidelidad/`, iconos `pwa-192.png` / `pwa-512.png` / `pwa-maskable-512.png`.
- `public/sw-fidelidad.js`: service worker con cache `stale-while-revalidate` para el shell de la app (HTML/JS/CSS/imágenes). Nunca cachea rutas que empiecen con `/api/` — los datos de sellos/premios/historial siempre tienen que venir frescos del backend.
- `src/lib/usePwaFidelidad.ts`: hook invocado solo dentro de `FidelidadPage`. En un `useEffect` inyecta el `<link rel="manifest">` y el `<meta name="theme-color">` en el `<head>`, y registra el service worker con `scope: '/mi-fidelidad/'`; al desmontar (clienta navega fuera de `/mi-fidelidad`) remueve el link y el meta, para que el prompt "Instalar app" de Chrome no aparezca en el resto de la landing.

## Estructura de la Base de Datos
Este repositorio **no tiene base de datos propia** ni acceso a ella (no hay `DATABASE_URL`, ORM, ni cliente de DB en las dependencias). Los datos de la landing pública los sirve `admin.solcantero.com.ar`; los datos del portal de fidelización los sirve el backend de **Sol Admin** (repo separado) — el esquema de esa base hay que documentarlo desde ese repo, no desde acá.

No existe `docs/ai/db_schema_dump.sql` en este proyecto.

## Decisiones de diseño relevantes
- **Fallback local por componente en la landing pública, en vez de un cliente API centralizado:** cada sección de la landing maneja su propio `fetch` + estado de fallback. Decisión pragmática para que el sitio nunca se vea "roto" o vacío si la API del admin está caída, a costa de repetir el patrón en varios componentes.
- **`fidelidadApi.ts` SIN fallback silencioso, a propósito distinto del patrón anterior:** el portal de fidelización muestra datos reales de la cuenta de una clienta (sellos, premios, historial) — mostrar un fallback inventado ahí sería directamente incorrecto. Si el fetch falla, se propaga el error y la UI lo muestra explícitamente (estado `error` en `FidelidadPage`), no hay contenido de relleno.
- **Token de sesión de fidelización en `localStorage`, no `sessionStorage`:** a diferencia de la marca de "intro ya vista" (que usa `sessionStorage` para reaparecer en cada sesión nueva), el login de una clienta tiene que persistir entre sesiones del navegador, así que usa `localStorage` (`sc_fidelidad_token`).
- **Login dual (Google + email/contraseña), no solo Google:** el flujo original ofrecía únicamente login con Google, lo que dejaba afuera a clientas sin cuenta de Gmail (Yahoo, iCloud, Hotmail, etc.). Se agregó un link secundario ("¿No tenés Gmail? Ingresá con tu email") que despliega un toggle interno en `FidelidadPage` con tres vistas (login, registro, olvidé mi contraseña) sin salir de `/mi-fidelidad`. El registro manual pide el teléfono en el mismo paso que el resto de los datos, porque no hay otro momento post-login natural donde pedirlo.
- **Botón de cerrar sesión sacado de `Dashboard.tsx`, fijado en `FidelidadPage.tsx`:** vive en un botón `position: fixed` arriba a la derecha de toda la pantalla, fuera del `Container` centrado, y ahora además llama a `logout()` del backend (best-effort) antes de borrar el token local.
- **Revelado de premio en modal fullscreen (`PremioModal`), no flip en la card ni ruleta segmentada:** al girar, `PremioCard` abre un modal con dos estados (`girando` → spinner circular; `revelado` → ícono + descripción con animación de `scale` tipo spring). Se descartó tanto la ruleta gráfica real como el flip in-place por simplicidad de implementar/mantener, con el mismo efecto de "sorpresa" percibido.
- **Tarjetas anteriores integradas al carrusel coverflow (`TarjetasCarousel`), no como lista separada debajo:** la tarjeta actual y las de ciclos anteriores (`GET /api/fidelidad/tarjetas-anteriores`) son slides del mismo carrusel con drag + flechas y efecto 3D coverflow. El ancho de la tarjeta se recalcula contra `window.innerWidth` porque el efecto usa transform 3D con ancho fijo en px, que en mobile desbordaba la pantalla.
- **PWA scopeada a `/mi-fidelidad/`, no a todo el sitio:** manifest y service worker se registran/desregistran dinámicamente solo mientras la clienta está en el portal (`usePwaFidelidad`), para no ofrecer "Instalar app" en la landing pública ni interferir con su cache.
- **Service worker nunca cachea `/api/*`:** los datos de sellos, premios e historial tienen que reflejar siempre el estado real del backend; solo el shell estático de la app usa stale-while-revalidate.
- **`VITE_API_URL` con default hardcodeado:** si la env var no está seteada, el sitio apunta a producción (`admin.solcantero.com.ar`) en vez de fallar. Bueno para demos rápidas, cuidado de no pegarle a prod sin querer en desarrollo.
- **`curso_soft_gel_v2.html` como HTML estático plano:** vive en `public/` y se copia a `dist/curso-soft-gel.html` en el build (paso manual en el script `build` de `package.json`). Landing de venta de un curso específico, deliberadamente fuera del bundle de React.
- **IntroScreen con video bloqueante solo una vez por sesión:** usa `sessionStorage` para que el usuario la vea de nuevo en cada sesión nueva del navegador, no solo la primera vez en el dispositivo.
- **Paleta y tipografía de marca:** Cormorant Garamond (serif) + Montserrat (sans) + fuente custom `BingoDilan` (`font-brand`, widget de WhatsApp). Tokens en `tailwind.config.js` (`beige`, `cream`, `pearl`, `charcoal`, `gold`, `rose`) — no usar hex sueltos en componentes nuevos, usar estos tokens. Los componentes de fidelización reusan estos mismos tokens y los átomos `Button`/`Container` ya existentes, no se inventó paleta nueva.

## Estado actual
- **En producción (Firebase Hosting, canal `live`, última release 2026-08-06):** landing pública completa (Hero, About, Services, Courses, Gallery, Testimonials, Footer, WhatsApp widget, IntroScreen, Popup) **+ portal de fidelización completo** (login dual Google/email, registro manual, reseteo de contraseña por mail, alta de teléfono, tarjeta de sellos con carrusel de ciclos anteriores, revelado y canje de premios, historial de turnos) **+ PWA instalable "Mi Fidelidad"**. Mergeado a `main` vía PR #1 (rama `fidelizacion-front`) y deployado el mismo día. Depende del backend de **Sol Admin** para todo lo dinámico — landing pública y portal de fidelización — también mergeado y en producción del lado del backend.
- **Variables de entorno resueltas, sin pendientes:** `.env.production` tiene `VITE_API_URL=https://admin.solcantero.com.ar` y `VITE_GOOGLE_CLIENT_ID` (mismo Client ID que usa el backend).
- **Sin push notifications:** el nombre "fidelización" no implica notificaciones push — no están implementadas ni planeadas en esta iteración, solo instalabilidad como PWA.
- **Roadmap declarado en el README** (no confirmado como implementado, tratar como pendiente):
  - Integración con Google Calendar para turnos automáticos.
  - Panel administrativo dinámico en `admin.solcantero.com.ar` (parcialmente ya existe, dado que la landing y el portal ya consumen sus endpoints).
  - Galería conectada en tiempo real con la API de Instagram.
- **Sin tests automatizados:** no hay carpeta de tests ni configuración de test runner en `package.json`.

## Convenciones del proyecto
- **Idioma:** UI y contenido en español rioplatense; nombres de variables/componentes en inglés, pero interfaces de datos de la API en español (`titulo`, `descripcion`, `imagen_url`, `sellos_del_ciclo`) porque siguen el contrato del backend.
- **Componentes de sección (landing pública):** un archivo por sección en `src/components/sections/`, cada uno con su propio `id` de anchor (`id="services"`, etc.) para navegación por hash.
- **Componentes del portal de fidelización:** un archivo por pieza de UI en `src/components/fidelidad/`, sin anchors — navegan por ruta (`/mi-fidelidad`), no por hash.
- **Páginas (`src/pages/`):** un archivo por ruta top-level; `FidelidadPage` y `ResetearPasswordPage` viven en su propia subcarpeta `pages/fidelidad/` porque orquestan/comparten sub-componentes de esa feature.
- **Componentes atómicos (`ui/`):** usan `forwardRef` + `cn()` para permitir override de clases vía `className`, siguiendo el patrón de `Button` y `Container`.
- **Animaciones:** variantes de Framer Motion definidas como constantes arriba del componente, con `whileInView` + `viewport={{ once: true }}` para scroll-reveal en la landing; en fidelización se usan `AnimatePresence` + `motion.div` para el modal de premio y para el drag del carrusel de tarjetas.
- **Fetch a la API de landing:** patrón fijo — `useEffect` vacío en deps, `fetch(...).then(res => res.json()).then(data => ...).catch(() => {})`, siempre con fallback local si `data` no es array o viene vacío.
- **Fetch a la API de fidelización:** todo pasa por las funciones exportadas de `src/lib/fidelidadApi.ts` (`pedido<T>()` interno), nunca `fetch` directo desde un componente. Los errores se tipan con `FidelidadApiError` y se manejan con `try/catch` explícito en cada componente, no silenciosamente.
- **Hooks de efectos globales (PWA, etc.):** viven en `src/lib/` (no en `components/`) cuando no renderizan nada propio, solo gestionan side-effects del `document`/`navigator` (ver `usePwaFidelidad.ts`).
- **Assets estáticos vs. bundleados:** imágenes de contenido van en `public/images/` y se referencian por ruta absoluta (`/images/foo.jpg`); solo assets realmente parte del build quedan en `src/assets/`.
- **Nunca commitear `.env` con valores reales** — usar `.env.local` para desarrollo y `.env.production` para el build de prod; env vars relevantes: `VITE_API_URL` y `VITE_GOOGLE_CLIENT_ID`.
