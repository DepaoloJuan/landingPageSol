import { motion } from 'framer-motion';
import { Container } from '../ui/Container';

const services = [
  {
    title: 'Manicura Premium',
    description: 'Cuidado integral de cutículas y esmaltado perfecto. Durabilidad y brillo superior.',
    price: 'Consultar',
    tag: 'Más Elegido',
  },
  {
    title: 'Soft Gel',
    description: 'Extensión de uñas con técnica de soft gel. Aspecto natural y resistencia excepcional.',
    price: 'Consultar',
  },
  {
    title: 'Lifting de Pestañas',
    description: 'Arqueado natural que realza tu mirada de forma orgánica. Incluye tinte y nutrición con keratina.',
    price: 'Consultar',
  },
  {
    title: 'Laminado de Cejas',
    description: 'Diseño y fijación de cejas para un look sofisticado, poblado y perfectamente definido.',
    price: 'Consultar',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as any },
  },
};

export function Services() {
  return (
    <section id="services" className="py-24 md:py-36 bg-beige-light">
      <Container>
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" as any }}
            className="text-4xl md:text-5xl font-serif text-charcoal mb-6"
          >
            Nuestros <span className="italic font-light text-gold">Servicios.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" as any }}
            className="text-charcoal-light text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            Tratamientos diseñados para resaltar tu belleza natural con productos de 
            la más alta calidad y atención rigurosamente personalizada.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => {
            const waMessage = encodeURIComponent(`Hola Sol, me gustaría consultar disponibilidad para el servicio de ${service.title}.`);
            return (
            <motion.a
              href={`https://wa.me/5491112345678?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" as any }}
              className="bg-cream p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-500 border border-transparent hover:border-gold/20 relative group flex flex-col h-full"
            >
              {service.tag && (
                <div className="absolute top-4 right-4 bg-gold/10 text-gold text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                  {service.tag}
                </div>
              )}
              <h3 className="text-xl font-serif text-charcoal mt-6 mb-4 group-hover:text-gold transition-colors duration-300">{service.title}</h3>
              <p className="text-charcoal-light text-sm mb-8 leading-relaxed font-light flex-grow">{service.description}</p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-charcoal/5">
                <span className="text-xs font-semibold text-charcoal tracking-widest uppercase">{service.price}</span>
                <span className="w-8 h-[1px] bg-gold/50 group-hover:w-12 transition-all duration-500"></span>
              </div>
            </motion.a>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
