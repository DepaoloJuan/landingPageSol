import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { API_URL } from '../../lib/constants';

interface ImagenGaleria {
  id: number;
  imagen_url: string | null;
  imagen_url_fallback: string | null;
  alt_texto: string | null;
}

export function Gallery() {
  const [galeria, setGaleria] = useState<ImagenGaleria[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/landing/galeria`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGaleria(data);
        }
        // Si viene vacío mantenemos el fallback
      })
      .catch(() => {
        // Si falla mantenemos el fallback
      });
  }, []);

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
            Una muestra de nuestro arte, precisión y dedicación en cada detalle.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {galeria.map((imagen, index) => (
            <motion.div
              key={imagen.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1] as any,
              }}
              className="relative group rounded-2xl overflow-hidden shadow-soft bg-beige aspect-[4/5]"
            >
              <img
                src={imagen.imagen_url || imagen.imagen_url_fallback || ''}
                alt={imagen.alt_texto || 'Resultado Sol Cantero'}
                loading={index < 3 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  if (imagen.imagen_url_fallback) {
                    e.currentTarget.src = imagen.imagen_url_fallback;
                  }
                }}
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}