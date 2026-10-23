import { motion } from 'framer-motion';
import type { PrecioCategoria } from './types';

export const TODOS = 'todos' as const;
export type PestanaActiva = typeof TODOS | number;

interface Props {
  categorias: PrecioCategoria[];
  activa: PestanaActiva;
  onCambiar: (pestana: PestanaActiva) => void;
}

// Pestañas tipo chip: en el celular se deslizan de costado y la elegida
// lleva una píldora dorada que viaja de una a otra (layoutId).
export function PriceCategoryTabs({ categorias, activa, onCambiar }: Props) {
  const pestanas: { id: PestanaActiva; nombre: string }[] = [
    { id: TODOS, nombre: 'Todos los servicios' },
    ...categorias.map(c => ({ id: c.id, nombre: c.nombre })),
  ];

  return (
    <div className="-mx-4 sm:mx-0 mb-14 md:mb-20" data-lenis-prevent>
      <div
        role="tablist"
        aria-label="Categorías de servicios"
        className="flex gap-2 overflow-x-auto px-4 sm:px-0 sm:flex-wrap sm:justify-center pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pestanas.map(p => {
          const seleccionada = p.id === activa;
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={seleccionada}
              onClick={() => onCambiar(p.id)}
              className={`relative shrink-0 px-5 py-2.5 rounded-full text-sm tracking-wide transition-colors duration-300 ${
                seleccionada ? 'text-white' : 'text-charcoal-light hover:text-charcoal bg-white/70 border border-charcoal/5'
              }`}
            >
              {seleccionada && (
                <motion.span
                  layoutId="pestana-precios"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gold to-rose-dark shadow-glow"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                />
              )}
              <span className="relative">{p.nombre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
