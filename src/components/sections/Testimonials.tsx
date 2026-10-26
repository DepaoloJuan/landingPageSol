import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Container } from '../ui/Container';
import { API_URL } from '../../lib/constants';

const FALLBACK_TESTIMONIOS = [
  {
    id: 1,
    nombre: 'Valentina M.',
    texto: 'La atención al detalle es insuperable. El ambiente, el profesionalismo y los productos que usan marcan la diferencia. Mi lugar de confianza absoluto.',
    estrellas: 5,
    foto_url: null,
    foto_url_fallback: null,
  },
  {
    id: 2,
    nombre: 'Sofía R.',
    texto: 'Nunca había experimentado un cuidado tan personalizado. Entendieron exactamente lo que mi piel necesitaba. Los resultados fueron inmediatos y duraderos.',
    estrellas: 5,
    foto_url: null,
    foto_url_fallback: null,
  },
  {
    id: 3,
    nombre: 'Camila L.',
    texto: 'Un nivel de excelencia poco común. Cada visita es un momento de relajación total y el esmaltado me dura intacto por semanas. Altamente recomendable.',
    estrellas: 5,
    foto_url: null,
    foto_url_fallback: null,
  },
];

interface Testimonio {
  id: number;
  nombre: string;
  texto: string;
  estrellas: number;
  foto_url: string | null;
  foto_url_fallback: string | null;
}

export function Testimonials() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/landing/testimonios`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonios(data);
        } else {
          setTestimonios(FALLBACK_TESTIMONIOS);
        }
      })
      .catch(() => setTestimonios(FALLBACK_TESTIMONIOS));
  }, []);

  return (
    <section id="testimonials" className="py-24 md:py-36 bg-beige-light">
      <Container>
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-charcoal mb-4"
          >
            Voces que nos <span className="italic font-light text-gold">Inspiran.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-charcoal-light text-lg max-w-2xl mx-auto font-light"
          >
            La satisfacción de quienes nos eligen es nuestro mayor logro.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonios.map((testimonio, index) => (
            <motion.div
              key={testimonio.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              {(testimonio.foto_url || testimonio.foto_url_fallback) && (
                <img
                  src={testimonio.foto_url || testimonio.foto_url_fallback!}
                  alt={testimonio.nombre}
                  className="w-14 h-14 rounded-full object-cover mb-6 border-2 border-gold/30"
                />
              )}

              <div className="flex gap-1 mb-8">
                {[...Array(testimonio.estrellas)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-charcoal-light text-lg md:text-xl leading-relaxed font-light italic mb-10 flex-grow">
                "{testimonio.texto}"
              </p>

              <div>
                <h4 className="font-serif text-lg text-charcoal mb-2">{testimonio.nombre}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}