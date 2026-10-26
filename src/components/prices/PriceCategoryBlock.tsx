import { motion } from 'framer-motion';
import { PriceItem } from './PriceItem';
import type { PrecioCategoria, PrecioItem } from './types';

const listaVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const ornamentoVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 1, ease: 'easeOut' as const } },
};

interface Props {
  categoria: PrecioCategoria;
  numero: number;
  onAbrir: (item: PrecioItem) => void;
}

// Cada categoría con su propio encabezado de "carta": número en itálica dorada,
// nombre grande y un ornamento que se dibuja. Así no parece una planilla.
export function PriceCategoryBlock({ categoria, numero, onAbrir }: Props) {
  const cantidad = categoria.items.length;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      aria-labelledby={`categoria-precios-${categoria.id}`}
      className="mb-16 md:mb-24 last:mb-0"
    >
      <header className="flex items-end gap-4 md:gap-6 mb-8">
        <motion.span
          variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } }}
          className="font-serif italic font-light text-5xl md:text-7xl text-gold/70 leading-none"
          aria-hidden="true"
        >
          {String(numero).padStart(2, '0')}
        </motion.span>
        <div className="flex-1 pb-1 md:pb-2">
          <motion.h3
            id={`categoria-precios-${categoria.id}`}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } } }}
            className="font-serif text-3xl md:text-4xl text-charcoal"
          >
            {categoria.nombre}
          </motion.h3>
          <div className="mt-3 flex items-center gap-3">
            <motion.span
              variants={ornamentoVariants}
              aria-hidden="true"
              className="h-px flex-1 max-w-xs bg-gradient-to-r from-gold via-rose to-transparent origin-left"
            />
            <span className="text-[11px] uppercase tracking-[0.25em] text-charcoal-light/70">
              {cantidad} {cantidad === 1 ? 'servicio' : 'servicios'}
            </span>
          </div>
        </div>
      </header>

      <motion.ul variants={listaVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
        {categoria.items.map(item => (
          <PriceItem key={item.id} item={item} onAbrir={onAbrir} />
        ))}
      </motion.ul>
    </motion.section>
  );
}
