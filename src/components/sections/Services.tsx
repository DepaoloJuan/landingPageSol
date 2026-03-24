import { motion } from 'framer-motion';
import { Container } from '../ui/Container';

const WA_PHONE = '541131846305';

const services = [
  {
    title: 'Manicura Premium',
    description: 'Cuidado integral de cuticulas y esmaltado perfecto. Durabilidad y brillo superior.',
    price: 'Consultar',
    tag: 'Mas Elegido',
  },
  {
    title: 'Soft Gel, Acrilico, Poligel y Dipping',
    description: 'Amplia variedad de tecnicas para lograr un aspecto natural y resistencia excepcional.',
    price: 'Consultar',
  },
  {
    title: 'Lifting de Pestanas',
    description: 'Arqueado natural que realza tu mirada.',
    price: 'Consultar',
  },
  {
    title: 'Diseno de Miradas',
    description: 'Perfilado de cejas, laminado de cejas, henna brows y micropigmentacion.',
    price: 'Consultar',
  },
  {
    title: 'Extensiones de pestanas',
    description: 'Tecnicas sofisticadas para dar volumen y longitud a tu mirada, con un acabado natural y personalizado que resalta tu expresion con sutileza.',
    price: 'Consultar',
  },
  {
    title: 'Depilacion',
    description: 'Definitiva y con cera. Dejando una piel suave y cuidada, mejorando su apariencia.',
    price: 'Consultar',
  },
  {
    title: 'Belleza de Pies',
    description: 'Ponemos tus pies en el pedestal que se merecen. Embelleciendolos y relajandolos.',
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
    transition: { duration: 0.8, ease: 'easeOut' as const },
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
            Tratamientos disenados para resaltar tu belleza natural con productos de calidad
            y atencion rigurosamente personalizada.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => {
            const waMessage = encodeURIComponent(
              `Hola Sol, me gustaria consultar disponibilidad para el servicio de ${service.title}.`
            );
            return (
              <motion.a
                href={`https://wa.me/${WA_PHONE}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4, ease: 'easeOut' as const }}
                aria-label={`Consultar por ${service.title} via WhatsApp`}
                className="bg-cream p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-500 border border-transparent hover:border-gold/20 relative group flex flex-col h-full"
              >
                {service.tag && (
                  <div className="absolute top-4 right-4 bg-gold/10 text-gold text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                    {service.tag}
                  </div>
                )}
                <h3 className="text-xl font-serif text-charcoal mt-6 mb-4 group-hover:text-gold transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-charcoal-light text-sm mb-8 leading-relaxed font-light flex-grow">
                  {service.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-charcoal/5">
                  <span className="text-xs font-semibold text-charcoal tracking-widest uppercase">
                    {service.price}
                  </span>
                  <span className="w-8 h-[1px] bg-gold/50 group-hover:w-12 transition-all duration-500" />
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

