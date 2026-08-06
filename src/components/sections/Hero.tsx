import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { WA_URL } from '../../lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-beige-light">
      
      {/* Background — entrada.jpeg, mármol + cartel dorado a la derecha */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-beige-light from-40% via-beige-light/95 via-60% to-beige-light/5 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-beige-light to-transparent z-10" />
        <img
          src="/images/entrada.jpeg"
          alt="Entrada Sol Cantero Centro de Belleza"
          className="w-full h-full object-cover object-right"
          fetchPriority="high"
        />
      </div>

      <Container className="relative z-10 py-24 mt-[-80px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Columna izquierda — texto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={itemVariants} className="mb-6">
            <span className="text-rose tracking-[0.25em] text-xs font-semibold uppercase">
                Centro de Belleza
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-serif text-charcoal mb-6"
            >
              Cuando te brindas amor, <br />
              <span className="italic font-light text-charcoal-light">
                lo bonito florece solo.
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-charcoal-light text-lg md:text-xl mb-12 max-w-xl font-light"
            >
              Regalate un momento de pausa y cuidado. Porque el amor que te das hoy, es la belleza que proyectas mañana.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6"
            >
              <Button
                size="lg"
                variant="primary"
                className="min-w-[200px]"
                onClick={() => window.open(WA_URL, '_blank')}
              >
                Reserva tu cita
              </Button>
            </motion.div>
          </motion.div>

          {/* Columna derecha — card kaping */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] as any }}
            className="hidden lg:block relative h-[580px] w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="/images/kaping.jpeg"
              alt="Diseño de uñas kaping Sol Cantero"
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-beige-light/98 via-beige-light/90 to-beige-light/10 z-10" />
          </motion.div>

        </div>
      </Container>
    </section>
  );
}