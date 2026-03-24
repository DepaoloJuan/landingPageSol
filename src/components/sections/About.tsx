import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../ui/Container';

export function About() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-36 bg-cream overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-8 leading-tight">
              Nuestra <br /><span className="italic font-light text-gold tracking-wide">filosofía.</span>
            </h2>
            <p className="text-charcoal-light text-lg mb-6 leading-relaxed font-light">
              Combinamos la excelencia con un trato cercano y alegre, donde cada visita es una oportunidad para regalarte ese buen momento que mereces.
            </p>
          </motion.div>

          <div className="relative h-[600px] flex justify-center items-center">
            {/* Image 1 - Parallax Up */}
            <motion.div
              style={{ y: y1 }}
              className="absolute left-0 lg:left-4 top-10 w-2/3 max-w-[400px] aspect-[4/3] rounded-2xl overflow-hidden shadow-soft z-10 bg-beige"
            >
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
                alt="Atención al detalle y belleza"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
            </motion.div>

            {/* Image 2 - Parallax Down */}
            <motion.div
              style={{ y: y2 }}
              className="absolute right-0 lg:right-4 bottom-10 w-3/5 max-w-[350px] aspect-square rounded-2xl overflow-hidden shadow-soft z-0 bg-beige"
            >
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80"
                alt="Atmósfera relajante y premium"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/10 mix-blend-overlay"></div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
