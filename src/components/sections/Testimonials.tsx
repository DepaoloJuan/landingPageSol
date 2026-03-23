import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Valentina M.",
    role: "Clienta Frecuente",
    content: "La atención al detalle es insuperable. El ambiente, el profesionalismo y los productos que usan marcan la diferencia. Mi lugar de confianza absoluto.",
    rating: 5,
  },
  {
    name: "Sofía R.",
    role: "Tratamiento Facial",
    content: "Nunca había experimentado un cuidado tan personalizado. Entendieron exactamente lo que mi piel necesitaba. Los resultados fueron inmediatos y duraderos.",
    rating: 5,
  },
  {
    name: "Camila L.",
    role: "Manicura Premium",
    content: "Un nivel de excelencia poco común. Cada visita es un momento de relajación total y el esmaltado me dura intacto por semanas. Altamente recomendable.",
    rating: 5,
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-36 bg-beige-light">
      <Container>
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-serif text-charcoal mb-4"
          >
            Voces que nos <span className="italic font-light text-gold">Inspiran.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-charcoal-light text-lg max-w-2xl mx-auto font-light"
          >
            La satisfacción de quienes nos eligen es nuestro mayor logro.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex gap-1 mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-charcoal-light text-lg md:text-xl leading-relaxed font-light italic mb-10 flex-grow">
                "{testimonial.content}"
              </p>
              <div>
                <h4 className="font-serif text-lg text-charcoal mb-2">{testimonial.name}</h4>
                <p className="text-xs text-charcoal/50 uppercase tracking-widest">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
