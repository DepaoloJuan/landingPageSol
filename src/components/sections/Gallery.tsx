import { motion } from 'framer-motion';
import { Container } from '../ui/Container';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80&w=800',
    alt: 'Resultado de manicura premium en Sol Cantero',
  },
  {
    src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=800',
    alt: 'Diseno de cejas y lifting de pestanas',
  },
  {
    src: 'https://images.unsplash.com/photo-1596755389378-c11dde124153?auto=format&fit=crop&q=80&w=800',
    alt: 'Extensiones de pestanas volumen natural',
  },
  {
    src: 'https://images.unsplash.com/photo-1600185960012-dbd486888ac8?auto=format&fit=crop&q=80&w=800',
    alt: 'Tratamiento de unas con tecnica soft gel',
  },
  {
    src: 'https://images.unsplash.com/photo-1512496015851-a1fbbfc69229?auto=format&fit=crop&q=80&w=800',
    alt: 'Belleza de pies y pedicura premium',
  },
  {
    src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    alt: 'Ambiente premium del centro de estetica Sol Cantero',
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 md:py-36 bg-cream">
      <Container>
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-charcoal mb-4"
          >
            Nuestros <span className="italic font-light text-gold">Resultados.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-charcoal-light text-lg max-w-2xl mx-auto font-light"
          >
            Una muestra de nuestro arte, precision y dedicacion en cada detalle.
          </motion.p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1] as any,
              }}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-soft bg-beige aspect-[3/4]"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 2 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}