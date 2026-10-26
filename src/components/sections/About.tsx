import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../ui/Container';

export function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section id="about" ref={containerRef} className="py-32 md:py-40 bg-cream overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Columna texto */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            <span className="block w-12 h-px bg-rose mb-8" />
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 leading-tight">
              Nuestra <br />
              <span className="italic font-light text-gold tracking-wide">filosofía.</span>
            </h2>
            <p className="text-charcoal-light text-lg mb-6 leading-relaxed font-light">
              Combinamos la excelencia con un trato cercano y alegre, donde cada visita es una oportunidad para regalarte ese buen momento que mereces.
            </p>
          </motion.div>

          {/* Layout mobile — sin parallax */}
          <div className="flex flex-col gap-6 lg:hidden">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-beige">
              <img
                src="/images/entrada.jpeg"
                alt="Entrada Sol Cantero Centro de Belleza"
                className="w-full h-full object-cover object-[right_center]"
                loading="lazy"
              />
            </div>
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-soft bg-beige">
              <img
                src="/images/portada.jpeg"
                alt="Equipo Sol Cantero Centro de Belleza"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* Columna imágenes — parallax con absolute, altura explícita */}
          <div className="relative h-[500px] hidden lg:block">

            {/* Imagen 1 — entrada, arriba a la izquierda, parallax hacia arriba */}
            <motion.div
              style={{ y: y1 }}
              className="absolute top-0 left-0 w-[62%] aspect-[4/3] rounded-2xl overflow-hidden shadow-soft z-10 bg-beige"
            >
              <img
                src="/images/entrada.jpeg"
                alt="Entrada Sol Cantero Centro de Belleza"
                className="w-full h-full object-cover object-[right_center]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gold/10 mix-blend-overlay" />
            </motion.div>

            {/* Imagen 2 — portada equipo, abajo a la derecha, parallax hacia abajo */}
            <motion.div
              style={{ y: y2 }}
              className="absolute bottom-0 right-0 w-[58%] aspect-[4/3] rounded-2xl overflow-hidden shadow-soft z-0 bg-beige"
            >
              <img
                src="/images/portada.jpeg"
                alt="Equipo Sol Cantero Centro de Belleza"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay" />
            </motion.div>

          </div>
        </div>
      </Container>
    </section>
  );
}