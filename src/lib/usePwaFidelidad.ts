import { useEffect } from 'react';

const MANIFEST_HREF = '/manifest-fidelidad.json';
const SW_URL = '/sw-fidelidad.js';
const SW_SCOPE = '/mi-fidelidad/';
const THEME_COLOR = '#2A2A2A';

/**
 * El manifest/SW de "Mi Fidelidad" solo se instalan mientras la clienta está
 * navegando dentro de /mi-fidelidad — así el "Instalar app" de Chrome no
 * aparece en el resto de la landing, y al salir se desregistra el link del
 * manifest para no dejarlo colgado en páginas fuera de su scope.
 */
export function usePwaFidelidad() {
  useEffect(() => {
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = MANIFEST_HREF;
    document.head.appendChild(manifestLink);

    const themeMeta = document.createElement('meta');
    themeMeta.name = 'theme-color';
    themeMeta.content = THEME_COLOR;
    document.head.appendChild(themeMeta);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }).catch(() => {
        // instalar la PWA es un extra, nunca algo que deba romper la página
      });
    }

    return () => {
      manifestLink.remove();
      themeMeta.remove();
    };
  }, []);
}
