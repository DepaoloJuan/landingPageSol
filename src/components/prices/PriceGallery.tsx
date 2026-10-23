import { useEffect, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react';
import { WA_PHONE } from '../../lib/constants';
import { formatearPrecio, type PrecioItem } from './types';

// Cada foto entra desde el lado hacia el que se deslizó
const fotoVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

interface Props {
  item: PrecioItem | null;
  onCerrar: () => void;
}

export function PriceGallery({ item, onCerrar }: Props) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="galeria-precios"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/75 backdrop-blur-md p-4"
          onClick={onCerrar}
          data-lenis-prevent
        >
          {/* key por servicio: cada uno arranca desde su primera foto */}
          <Contenido key={item.id} item={item} onCerrar={onCerrar} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Contenido({ item, onCerrar }: { item: PrecioItem; onCerrar: () => void }) {
  const [[indice, direccion], setPagina] = useState<[number, number]>([0, 0]);
  const total = item.imagenes.length;

  const mover = (paso: number) => {
    if (total < 2) return;
    setPagina(([i]) => [(i + paso + total) % total, paso]);
  };

  // Teclado: Esc cierra, flechas cambian de foto
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  });

  const alSoltar = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) mover(1);
    if (info.offset.x > 60) mover(-1);
  };

  const waMensaje = encodeURIComponent(`Hola Sol, me gustaría reservar un turno para ${item.nombre}.`);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.nombre}
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 24 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
      className="relative w-full max-w-lg bg-cream rounded-3xl overflow-hidden shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="relative aspect-[4/5] bg-charcoal/5 overflow-hidden">
        <AnimatePresence initial={false} custom={direccion} mode="popLayout">
          <motion.img
            key={indice}
            src={item.imagenes[indice]}
            alt={`${item.nombre}, foto ${indice + 1} de ${total}`}
            custom={direccion}
            variants={fotoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeOut' }}
            drag={total > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={alSoltar}
            className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
            draggable={false}
          />
        </AnimatePresence>

        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-charcoal hover:bg-white transition-colors"
        >
          <X size={20} />
        </button>

        {total > 1 && (
          <>
            <button
              onClick={() => mover(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-charcoal hover:bg-white transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => mover(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/70 backdrop-blur flex items-center justify-center text-charcoal hover:bg-white transition-colors"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center gap-2">
              {item.imagenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina([i, i > indice ? 1 : -1])}
                  aria-label={`Ver foto ${i + 1}`}
                  className="relative w-2.5 h-2.5 rounded-full bg-white/60"
                >
                  {i === indice && (
                    <motion.span layoutId="punto-galeria-precios" className="absolute inset-0 rounded-full bg-gold" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
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
    </motion.div>
  );
}
