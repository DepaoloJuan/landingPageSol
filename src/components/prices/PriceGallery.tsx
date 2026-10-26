import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageCircle, X } from 'lucide-react';
import { WA_PHONE } from '../../lib/constants';
import { formatearPrecio, type PrecioItem } from './types';

export interface ServicioDelFeed {
  item: PrecioItem;
  categoria: string;
}

interface Props {
  servicios: ServicioDelFeed[];
  // Posición del servicio tocado, o null si el visor está cerrado
  inicio: number | null;
  onCerrar: () => void;
}

// Visor tipo feed: un servicio por pantalla. En el celular se desliza hacia
// arriba/abajo (scroll nativo con snap); en la PC hay flechas, rueda y teclado.
export function PriceGallery({ servicios, inicio, onCerrar }: Props) {
  return (
    <AnimatePresence>
      {inicio !== null && (
        <motion.div
          key="feed-precios"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] bg-charcoal/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Fotos de los servicios"
        >
          <Feed servicios={servicios} inicio={inicio} onCerrar={onCerrar} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Feed({ servicios, inicio, onCerrar }: { servicios: ServicioDelFeed[]; inicio: number; onCerrar: () => void }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(inicio);
  const [desplazo, setDesplazo] = useState(false);
  const total = servicios.length;

  // Abre directamente en el servicio que se tocó
  useLayoutEffect(() => {
    contenedor.current?.children[inicio]?.scrollIntoView({ block: 'start' });
  }, [inicio]);

  // Mientras el visor está abierto, la página de atrás no se mueve
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  // Cuál servicio está en pantalla (para el contador y las flechas)
  useEffect(() => {
    const raiz = contenedor.current;
    if (!raiz) return;
    const observador = new IntersectionObserver(
      entradas => {
        entradas.forEach(e => {
          if (e.isIntersecting) setActual(Number((e.target as HTMLElement).dataset.indice));
        });
      },
      { root: raiz, threshold: 0.6 },
    );
    Array.from(raiz.children).forEach(hijo => observador.observe(hijo));
    return () => observador.disconnect();
  }, []);

  const irA = useCallback(
    (indice: number) => {
      setDesplazo(true);
      const destino = Math.max(0, Math.min(total - 1, indice));
      contenedor.current?.children[destino]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [total],
  );

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        irA(actual + 1);
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        irA(actual - 1);
      }
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [actual, irA, onCerrar]);

  return (
    <>
      <div
        ref={contenedor}
        data-lenis-prevent
        // Solo un gesto de la clienta oculta la pista (no el salto inicial al servicio tocado)
        onWheel={() => setDesplazo(true)}
        onTouchMove={() => setDesplazo(true)}
        className="h-[100dvh] overflow-y-auto snap-y snap-mandatory overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {servicios.map(({ item, categoria }, i) => (
          <Diapositiva
            key={item.id}
            indice={i}
            item={item}
            categoria={categoria}
            mostrarPista={i === inicio && !desplazo && i < total - 1}
            onCerrar={onCerrar}
          />
        ))}
      </div>

      {/* Barra superior: contador y cerrar */}
      <div className="pointer-events-none fixed top-0 inset-x-0 z-10 flex items-center justify-between p-4">
        <span className="pointer-events-auto px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-xs tracking-widest">
          {actual + 1} / {total}
        </span>
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="pointer-events-auto w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-charcoal hover:bg-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Flechas en la PC */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-10 flex-col gap-3">
        <button
          onClick={() => irA(actual - 1)}
          disabled={actual === 0}
          aria-label="Servicio anterior"
          className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-charcoal shadow-glow hover:bg-white disabled:opacity-30 disabled:cursor-default transition-all"
        >
          <ChevronUp size={24} />
        </button>
        <button
          onClick={() => irA(actual + 1)}
          disabled={actual === total - 1}
          aria-label="Servicio siguiente"
          className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-rose-dark flex items-center justify-center text-white shadow-glow hover:brightness-105 disabled:opacity-30 disabled:cursor-default transition-all"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </>
  );
}

interface DiapositivaProps {
  indice: number;
  item: PrecioItem;
  categoria: string;
  mostrarPista: boolean;
  onCerrar: () => void;
}

function Diapositiva({ indice, item, categoria, mostrarPista, onCerrar }: DiapositivaProps) {
  const waMensaje = encodeURIComponent(`Hola Sol, me gustaría reservar un turno para ${item.nombre}.`);

  return (
    <section
      data-indice={indice}
      aria-label={item.nombre}
      onClick={onCerrar}
      className="relative h-[100dvh] snap-start snap-always flex items-center justify-center px-4 py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ amount: 0.6 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md max-h-full flex flex-col bg-cream rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Si hay más de una foto se deslizan de costado. En pantallas bajas la foto
            cede alto (recorta, no se deforma) para que entre la descripción. */}
        <div className="relative flex-1 min-h-0 aspect-[4/5] max-h-[62dvh] flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {item.imagenes.map((url, i) => (
            <img
              key={url}
              src={url}
              alt={`${item.nombre}${item.imagenes.length > 1 ? `, foto ${i + 1}` : ''}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-full shrink-0 snap-center object-cover"
              draggable={false}
            />
          ))}
        </div>

        <div className="shrink-0 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold mb-1">{categoria}</p>
              <h3 className="font-serif text-2xl text-charcoal leading-tight">{item.nombre}</h3>
              <p className="mt-1 text-xl font-semibold text-gold">{formatearPrecio(item.precio)}</p>
            </div>
            <a
              href={`https://wa.me/${WA_PHONE}?text=${waMensaje}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-gold to-rose-dark text-white text-sm font-medium shadow-glow hover:brightness-105 active:scale-95 transition-all"
            >
              <MessageCircle size={18} />
              Reservar
            </a>
          </div>
          {item.descripcion && (
            <p className="mt-3 pt-3 border-t border-gold/20 text-sm font-light text-charcoal-light leading-relaxed">
              {item.descripcion}
            </p>
          )}
        </div>
      </motion.div>

      {/* Pista para la primera vez: invita a deslizar */}
      {mostrarPista && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 0.6 }, y: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } }}
          className="pointer-events-none absolute bottom-5 inset-x-0 flex flex-col items-center text-white/85 text-xs tracking-widest uppercase"
        >
          Deslizá para ver más
          <ChevronDown size={22} />
        </motion.div>
      )}
    </section>
  );
}
