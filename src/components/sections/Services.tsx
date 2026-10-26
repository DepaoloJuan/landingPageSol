import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Container } from '../ui/Container';
import { API_URL, WA_PHONE } from '../../lib/constants';

const FALLBACK_SERVICIOS = [
  { id: 1, titulo: 'Manicura Premium', descripcion: 'Cuidado integral de cutículas y esmaltado perfecto. Durabilidad y brillo superior.', imagenes: [] },
  { id: 2, titulo: 'Soft Gel, Acrílico, Poligel y Dipping', descripcion: 'Amplia variedad de técnicas para lograr un aspecto natural y resistencia excepcional.', imagenes: [] },
  { id: 3, titulo: 'Lifting de Pestañas', descripcion: 'Arqueado natural que realza tu mirada.', imagenes: [] },
  { id: 4, titulo: 'Diseño de Miradas', descripcion: 'Perfilado de cejas, laminado de cejas, henna brows y micropigmentación.', imagenes: [] },
  { id: 5, titulo: 'Extensiones de Pestañas', descripcion: 'Técnicas sofisticadas para dar volumen y longitud a tu mirada, con un acabado natural y personalizado que resalta tu expresión con sutileza.', imagenes: [] },
  { id: 6, titulo: 'Depilación', descripcion: 'Definitiva y con cera. Dejando una piel suave y cuidada, mejorando su apariencia.', imagenes: [] },
  { id: 7, titulo: 'Belleza de Pies', descripcion: 'Ponemos tus pies en el pedestal que se merecen. Embelleciéndolos y relajándolos.', imagenes: [] },
];

interface Imagen {
  id: number;
  imagen_url: string;
}

interface Servicio {
  id: number;
  titulo: string;
  descripcion: string;
  imagenes: Imagen[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
};

export function Services() {
  const [servicios, setServicios] = useState<Servicio[]>(FALLBACK_SERVICIOS);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/landing/servicios`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServicios(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="py-24 md:py-36 bg-beige-light">
      <Container>
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
            className="text-4xl md:text-5xl font-serif text-charcoal mb-6"
          >
            Nuestros <span className="italic font-light text-gold">Servicios.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' as const }}
            className="text-charcoal-light text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            Tratamientos diseñados para resaltar tu belleza natural con productos de calidad
            y atención rigurosamente personalizada.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {servicios.map((servicio, index) => {
            const waMessage = encodeURIComponent(
              `Hola Sol, me gustaría consultar disponibilidad para el servicio de ${servicio.titulo}.`
            );
            const tieneImagenes = servicio.imagenes && servicio.imagenes.length > 0;

            return (
              <motion.div
                key={servicio.id}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' as const }}
                className="bg-cream p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-500 border border-transparent hover:border-rose/30 relative group flex flex-col h-full cursor-pointer"
                onClick={() => tieneImagenes ? setSeleccionado(servicio) : window.open(`https://wa.me/${WA_PHONE}?text=${waMessage}`, '_blank')}
              >
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-rose/10 text-rose-dark text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                    Más Elegido
                  </div>
                )}
                <h3 className="text-xl font-serif text-charcoal mt-6 mb-4 group-hover:text-rose-dark transition-colors duration-300">
                  {servicio.titulo}
                </h3>
                <p className="text-charcoal-light text-sm mb-8 leading-relaxed font-light flex-grow">
                  {servicio.descripcion}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-charcoal/5">
                  <span className="text-xs font-semibold text-charcoal tracking-widest uppercase">
                    {tieneImagenes ? 'Ver ejemplos' : 'Consultar'}
                  </span>
                  <span className="w-8 h-[1px] bg-gold/50 group-hover:w-12 transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>

      {/* Modal de imágenes */}
      <AnimatePresence>
        {seleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 backdrop-blur-sm p-4"
            onClick={() => setSeleccionado(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl text-charcoal">{seleccionado.titulo}</h3>
                <button
                  onClick={() => setSeleccionado(null)}
                  className="w-8 h-8 flex items-center justify-center text-charcoal/50 hover:text-charcoal transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {seleccionado.imagenes.map(img => (
                  <img
                    key={img.id}
                    src={img.imagen_url}
                    alt={seleccionado.titulo}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}