import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { formatearPrecio, type PrecioItem } from './types';

// Variantes fuera del componente: entra subiendo y la línea punteada se "dibuja"
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const lineaVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, delay: 0.25, ease: 'easeOut' as const } },
};

interface Props {
  item: PrecioItem;
  onAbrir: (item: PrecioItem) => void;
}

// Una línea de la carta: foto redonda, nombre, puntos dorados y precio.
// Al pasar el mouse brilla un destello dorado de lado a lado.
export function PriceItem({ item, onAbrir }: Props) {
  const fotos = item.imagenes.length;

  return (
    <motion.li variants={itemVariants}>
      <button
        type="button"
        onClick={() => onAbrir(item)}
        className="group relative w-full flex items-center gap-4 p-3 pr-5 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-500 text-left overflow-hidden"
      >
        {/* Destello dorado que cruza la tarjeta al pasar el mouse */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold-light/40 to-transparent translate-x-0 group-hover:translate-x-[400%] transition-transform duration-1000 ease-out"
        />

        <span className="relative shrink-0 w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-gold-light to-rose-light">
          <img
            src={item.imagenes[0]}
            alt=""
            loading="lazy"
            className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </span>

        <span className="relative flex-1 min-w-0">
          <span className="flex items-end gap-3">
            <span className="font-serif text-lg md:text-xl text-charcoal leading-tight group-hover:text-rose-dark transition-colors duration-300">
              {item.nombre}
            </span>
            <motion.span
              variants={lineaVariants}
              aria-hidden="true"
              className="hidden sm:block flex-1 mb-1.5 border-b border-dotted border-gold/60 origin-left"
            />
          </span>
          <span className="mt-1 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-charcoal-light/70">
            <Camera size={12} />
            {fotos === 1 ? 'Ver foto' : `Ver ${fotos} fotos`}
          </span>
        </span>

        <span className="relative shrink-0 font-sans font-semibold text-lg text-gold group-hover:text-rose-dark transition-colors duration-300">
          {formatearPrecio(item.precio)}
        </span>
      </button>
    </motion.li>
  );
}
