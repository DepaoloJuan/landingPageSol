import { Container } from '../ui/Container';
import { Instagram, MapPin, MessageCircle, Clock } from 'lucide-react';

const WA_URL = 'https://api.whatsapp.com/send/?phone=541131846305&text&type=phone_number&app_absent=0';
const IG_URL = 'https://www.instagram.com/solcantero.centrodebelleza';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Lobato+680+Claypole+Almirante+Brown+Buenos+Aires';

export function Footer() {
  return (
    <>
      <footer className="bg-charcoal text-beige py-16 md:py-24 border-t border-charcoal-light/20 relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

            {/* Columna marca */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-serif text-pearl mb-6">Sol Cantero.</h3>
              <p className="text-beige-light/70 text-sm max-w-sm mb-8 leading-relaxed font-light">
                Un espacio dedicado al cuidado personal y la estetica integral,
                ideado para resaltar tu esencia con tecnicas premium.
              </p>
              <div className="flex gap-4">
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Seguinos en Instagram"
                  className="w-10 h-10 rounded-full border border-beige-light/20 flex items-center justify-center text-beige-light hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactanos por WhatsApp"
                  className="w-10 h-10 rounded-full border border-beige-light/20 flex items-center justify-center text-beige-light hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>

            {/* Columna enlaces */}
            <div>
              <h4 className="text-sm font-semibold text-gold tracking-widest uppercase mb-6">Enlaces</h4>
              <ul className="space-y-4 text-sm font-light text-beige-light/80">
                <li>
                  <a href="#services" className="hover:text-gold transition-colors duration-300">
                    Servicios
                  </a>
                </li>
                <li>
                  <a href="#courses" className="hover:text-gold transition-colors duration-300">
                    Cursos
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-gold transition-colors duration-300">
                    Resultados
                  </a>
                </li>
              </ul>
            </div>

            {/* Columna contacto */}
            <div>
              <h4 className="text-sm font-semibold text-gold tracking-widest uppercase mb-6">Contacto</h4>
              <ul className="space-y-5 text-sm font-light text-beige-light/80">

                {/* Direccion con link a Google Maps */}
                <li>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:text-gold transition-colors duration-300 group"
                    aria-label="Ver ubicacion en Google Maps"
                  >
                    <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <span>
                      Lobato 680, Esq. Rucci<br />
                      Claypole, Almirante Brown<br />
                      Buenos Aires
                    </span>
                  </a>
                </li>

                {/* Telefono con link directo a WhatsApp */}
                <li>
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:text-gold transition-colors duration-300 group"
                    aria-label="Escribinos por WhatsApp"
                  >
                    <MessageCircle size={16} className="text-gold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                    <span>+54 11 3184-6305</span>
                  </a>
                </li>

                {/* Horario */}
                <li className="flex items-start gap-3">
                  <Clock size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>
                    Mar a Sab<br />
                    9:00 a 19:00 hs
                  </span>
                </li>

              </ul>
            </div>

          </div>

          {/* Barra inferior */}
          <div className="mt-20 pt-8 border-t border-beige-light/10 text-center md:flex md:justify-between md:text-left">
            <p className="text-xs text-beige-light/50 font-light tracking-wide">
              &copy; {new Date().getFullYear()} Sol Cantero Centro de Belleza. Todos los derechos reservados.
            </p>
            <p className="text-xs text-beige-light/50 font-light tracking-wide mt-4 md:mt-0">
              Diseno por AntiGravity
            </p>
          </div>

        </Container>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactanos por WhatsApp"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] group"
      >
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-25" />
        <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] transition-all duration-300">
          <MessageCircle size={28} className="fill-current" />
        </div>
      </a>
    </>
  );
}