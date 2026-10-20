# Sol Cantero · Sitio institucional y portal de fidelización

Sitio web y portal de clientas para **Sol Cantero Centro de Belleza**, un negocio real. Combina una presencia institucional de estilo editorial y minimalista con un portal de fidelización ("Mi Fidelidad") instalable como PWA.

## Qué incluye

| Módulo | Detalle |
| --- | --- |
| Sitio institucional | Diseño mobile-first con animaciones fluidas y scroll suave |
| Portal de fidelización | Login con Google y con email y contraseña, reseteo de contraseña, sellos e historial de la clienta |
| PWA | Instalable en el celular desde el navegador |
| Despliegue | Firebase Hosting |

## Stack

| Área | Tecnología |
| --- | --- |
| Frontend | React 18, Vite, TypeScript |
| Estilos | Tailwind CSS |
| Animaciones | Framer Motion, Lenis (scroll inercial) |
| Íconos | Lucide React |
| Backend como servicio y hosting | Firebase |

## Decisiones de diseño

| Tema | Decisión |
| --- | --- |
| Identidad visual | Tipografía serif (Cormorant Garamond) para la marca y sans (Montserrat) para el texto |
| Paleta | Neutros cálidos, beige y charcoal, con mucho espacio en blanco |
| Organización del código | Atomic Design en `src/components` |

## Ejecutar en local

| Paso | Comando |
| --- | --- |
| Instalar dependencias | `npm install` |
| Entorno de desarrollo | `npm run dev` |
| Build de producción | `npm run build` |

Las variables de entorno van en un archivo `.env` local, que no se versiona.

## Documentación interna

La carpeta `docs/ai` contiene el contexto del proyecto y el estado de cada módulo.

## Autor

Juan Manuel Depaolo · [LinkedIn](https://linkedin.com/in/juan-manuel-depaolo) · [GitHub](https://github.com/DepaoloJuan)
