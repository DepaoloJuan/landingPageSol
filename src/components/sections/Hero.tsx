import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-beige-light">
      {/* Background Image Placeholder with Fade */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-beige-light/95 via-beige-light/80 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-beige-light to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1615397323136-d846b5bd6266?auto=format&fit=crop&q=80"
          alt="Sol Cantero interior"
          className="w-full h-full object-cover object-right opacity-80"
        />
      </div>

      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="text-gold tracking-[0.25em] text-xs font-semibold uppercase">
              Centro de Belleza Premium
            </span>
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-serif text-charcoal leading-tight mb-6"
          >
            Tu esencia, <br />
            <span className="italic font-light text-charcoal-light">nuestra dedicación.</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-charcoal-light text-lg md:text-xl mb-12 max-w-xl font-light leading-relaxed"
          >
            Descubrí una experiencia de belleza diseñada para resaltar tu autenticidad.
            Detalles que importan, en un espacio pensado exclusivamente para vos.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6"
          >
            <Button 
              size="lg" 
              variant="primary" 
              className="min-w-[200px]"
              onClick={() => window.open('https://api.whatsapp.com/send/?phone=541131846305&text&type=phone_number&app_absent=0&utm_source=ig', '_blank')}
            >
              Agendar Turno
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
