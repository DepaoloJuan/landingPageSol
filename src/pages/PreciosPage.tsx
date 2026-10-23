import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Prices } from '../components/sections/Prices';
import { useSmoothScroll } from '../lib/useSmoothScroll';

// Página propia para la lista de precios (solcantero.com.ar/precios)
export function PreciosPage() {
  useSmoothScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
    const tituloAnterior = document.title;
    document.title = 'Lista de precios · Sol Cantero';
    return () => {
      document.title = tituloAnterior;
    };
  }, []);

  return (
    <div className="bg-beige-light font-sans text-charcoal selection:bg-gold/30 selection:text-white">
      <Header />
      <main>
        <Prices comoPagina />
      </main>
      <Footer />
    </div>
  );
}
