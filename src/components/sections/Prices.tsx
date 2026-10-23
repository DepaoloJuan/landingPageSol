import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Container } from '../ui/Container';
import { MessageCircle } from 'lucide-react';
import { API_URL, WA_PHONE } from '../../lib/constants';
import { PriceCategoryTabs, TODOS, type PestanaActiva } from '../prices/PriceCategoryTabs';
import { PriceCategoryBlock } from '../prices/PriceCategoryBlock';
import { PriceGallery } from '../prices/PriceGallery';
import type { PrecioCategoria, PrecioItem } from '../prices/types';

// Al cambiar de pestaña el contenido sale y entra con un fundido suave
const contenidoVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

// Esqueleto mientras carga, para que la página no salte
function Esqueleto() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[88px] rounded-2xl bg-white/60 animate-pulse" />
      ))}
    </div>
  );
}

// Si no hay nada publicado: en su propia página muestra un aviso, como sección se oculta
function SinPrecios() {
  const mensaje = encodeURIComponent('Hola Sol, me gustaría consultar los precios de los servicios.');
  return (
    <div className="max-w-md mx-auto text-center bg-white/60 backdrop-blur-sm rounded-3xl p-10 shadow-soft">
      <p className="font-serif text-2xl text-charcoal mb-3">Estamos actualizando la lista.</p>
      <p className="text-charcoal-light font-light mb-8">Mientras tanto, escribinos y te pasamos los precios al instante.</p>
      <a
        href={`https://wa.me/${WA_PHONE}?text=${mensaje}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold to-rose-dark text-white text-sm font-medium shadow-glow hover:brightness-105 active:scale-95 transition-all"
      >
        <MessageCircle size={18} />
        Consultar por WhatsApp
      </a>
    </div>
  );
}

export function Prices({ comoPagina = false }: { comoPagina?: boolean }) {
  // null = cargando; [] = no hay nada publicado (la sección no se muestra)
  const [categorias, setCategorias] = useState<PrecioCategoria[] | null>(null);
  const [activa, setActiva] = useState<PestanaActiva>(TODOS);
  const [abierto, setAbierto] = useState<PrecioItem | null>(null);
  const reducirMovimiento = useReducedMotion();

  useEffect(() => {
    fetch(`${API_URL}/api/landing/precios`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => setCategorias(Array.isArray(data) ? data.filter(c => c.items?.length > 0) : []))
      // Con precios es mejor no mostrar nada que mostrar datos viejos o inventados
      .catch(() => setCategorias([]));
  }, []);

  const vacia = categorias !== null && categorias.length === 0;
  if (vacia && !comoPagina) return null;

  const visibles = activa === TODOS ? categorias ?? [] : (categorias ?? []).filter(c => c.id === activa);

  return (
    <section
      id="precios"
      className={`relative ${comoPagina ? 'min-h-screen pt-36 pb-24 md:pt-44 md:pb-36' : 'py-24 md:py-36'} bg-gradient-to-b from-beige-light via-cream to-beige-light overflow-hidden`}
    >
      {/* Atmósfera: dos luces suaves que flotan despacio detrás del contenido */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-rose-light/40 blur-3xl"
        animate={reducirMovimiento ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-gold-light/30 blur-3xl"
        animate={reducirMovimiento ? undefined : { x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container className="relative">
        <div className="text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.35em' }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="block text-[11px] uppercase text-gold mb-4"
          >
            Carta de servicios
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-4xl md:text-5xl font-serif text-charcoal mb-6"
          >
            Lista de <span className="italic font-light text-gold">Precios.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="text-charcoal-light text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            Elegí una categoría y tocá cualquier servicio para ver fotos de nuestros trabajos.
          </motion.p>
        </div>

        {categorias === null ? (
          <Esqueleto />
        ) : vacia ? (
          <SinPrecios />
        ) : (
          <>
            <PriceCategoryTabs categorias={categorias} activa={activa} onCambiar={setActiva} />
            <AnimatePresence mode="wait">
              <motion.div key={String(activa)} variants={contenidoVariants} initial="hidden" animate="visible" exit="exit">
                {visibles.map(categoria => (
                  <PriceCategoryBlock
                    key={categoria.id}
                    categoria={categoria}
                    numero={categorias.indexOf(categoria) + 1}
                    onAbrir={setAbierto}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </Container>

      <PriceGallery item={abierto} onCerrar={() => setAbierto(null)} />
    </section>
  );
}
