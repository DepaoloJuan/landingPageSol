import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function Courses() {
  return (
    <section id="courses" className="py-24 md:py-36 bg-charcoal text-beige relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[150px] rounded-full pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="order-2 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[450px] md:h-[550px]">
              <img 
                src="https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80" 
                alt="Clases de estética"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/20 mix-blend-overlay"></div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-block mb-8">
              <span className="bg-gold/10 text-gold-light border border-gold/20 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                Cupos Limitados
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight text-pearl">
              Formación <br/><span className="italic font-light text-gold text-5xl md:text-6xl">Profesional.</span>
            </h2>
            <p className="text-beige-light/80 text-lg mb-10 leading-relaxed font-light">
              Brindamos capacitaciones intensivas, diseñadas para proporcionarte las herramientas necesarias para destacarte en el rubro.
            </p>
            
            <ul className="space-y-5 mb-12">
              {[
                'Diseño de Miradas',
                'Especialización técnica Soft Gel'
              ].map((course, i) => (
                <li key={i} className="flex items-center text-beige-light font-light text-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mr-5 flex-shrink-0"></span>
                  <span>{course}</span>
                </li>
              ))}
            </ul>

            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto"
              onClick={() => window.open('https://api.whatsapp.com/send/?phone=541131846305&text&type=phone_number&app_absent=0&utm_source=ig', '_blank')}
            >
              Solicitar Información
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
