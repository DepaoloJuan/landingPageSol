import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { WA_URL, API_URL } from '../../lib/constants';

const FALLBACK_CURSOS = [
  {
    id: 1,
    titulo: 'Diseño de Miradas',
    descripcion: 'Capacitación intensiva en perfilado de cejas, laminado, henna brows y micropigmentación.',
    imagen_url: null,
    imagen_url_fallback: '/images/profesora-con-alumnas.jpg',
  },
  {
    id: 2,
    titulo: 'Especialización técnica Soft Gel',
    descripcion: 'Aprendé desde la base hasta el acabado perfecto.',
    imagen_url: null,
    imagen_url_fallback: '/images/profesora-con-alumnas.jpg',
  },
];

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  imagen_url_fallback: string | null;
}

export function Courses() {
  const [cursos, setCursos] = useState<Curso[]>(FALLBACK_CURSOS);

  useEffect(() => {
    fetch(`${API_URL}/api/landing/cursos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCursos(data);
        }
      })
      .catch(() => {});
  }, []);

  // La imagen principal es la del primer curso que tenga imagen
  const imagenPrincipal =
    cursos.find(c => c.imagen_url || c.imagen_url_fallback);
  const srcImagen = imagenPrincipal?.imagen_url || imagenPrincipal?.imagen_url_fallback || '';

  return (
    <section id="courses" className="py-24 md:py-36 bg-rose-light/40 text-charcoal relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-rose/20 blur-[150px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Imagen principal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] md:h-[550px]">
              <img
                src={srcImagen}
                alt="Formación profesional Sol Cantero"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                onError={(e) => {
                  if (imagenPrincipal?.imagen_url_fallback) {
                    e.currentTarget.src = imagenPrincipal.imagen_url_fallback;
                  }
                }}
              />
              <div className="absolute inset-0 bg-charcoal/20 mix-blend-overlay" />
            </div>
          </motion.div>

          {/* Texto y lista de cursos */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-block mb-8">
              <span className="bg-white/60 text-rose-dark border border-rose/30 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                Cupos Limitados
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-charcoal">
              Formación <br />
              <span className="italic font-light text-gold text-5xl md:text-6xl">Profesional.</span>
            </h2>
            <p className="text-charcoal-light text-lg mb-10 leading-relaxed font-light">
              Brindamos capacitaciones intensivas, diseñadas para proporcionarte las herramientas necesarias para destacarte en el rubro.
            </p>

            {/* Lista de cursos */}
            <ul className="space-y-5 mb-12">
              {cursos.map(curso => (
                <li key={curso.id} className="flex items-center text-charcoal font-light text-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mr-5 flex-shrink-0" />
                  <span>{curso.titulo}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => window.open(WA_URL, '_blank')}
            >
              Solicitar Información
            </Button>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}