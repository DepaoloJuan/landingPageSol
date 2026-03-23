import { Container } from '../ui/Container';
import { Instagram, MapPin, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <>
      <footer className="bg-charcoal text-beige py-16 md:py-24 border-t border-charcoal-light/20 relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-serif text-pearl mb-6">Sol Cantero.</h3>
              <p className="text-beige-light/70 text-sm max-w-sm mb-8 leading-relaxed font-light">
                Un espacio dedicado al cuidado personal y la estética integral, 
                ideado para resaltar tu esencia con técnicas premium.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-beige-light/20 flex items-center justify-center text-beige-light hover:bg-gold hover:text-white hover:border-gold transition-all duration-300">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-beige-light/20 flex items-center justify-center text-beige-light hover:bg-gold hover:text-white hover:border-gold transition-all duration-300">
                  <Mail size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gold tracking-widest uppercase mb-6">Enlaces</h4>
              <ul className="space-y-4 text-sm font-light text-beige-light/80">
                <li><a href="#services" className="hover:text-gold transition-colors">Servicios</a></li>
                <li><a href="#courses" className="hover:text-gold transition-colors">Cursos</a></li>
                <li><a href="#gallery" className="hover:text-gold transition-colors">Resultados</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gold tracking-widest uppercase mb-6">Ubicación</h4>
              <ul className="space-y-4 text-sm font-light text-beige-light/80">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>Av. del Libertador 1234, Piso 5<br/>Buenos Aires, Argentina</span>
                </li>
                <li className="flex items-start gap-3 mt-4">
                  <MessageCircle size={16} className="text-gold flex-shrink-0 mt-0.5" />
                  <span>+54 9 11 1234-5678</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-beige-light/10 text-center md:flex md:justify-between md:text-left">
            <p className="text-xs text-beige-light/50 font-light tracking-wide">
              &copy; {new Date().getFullYear()} Sol Cantero Centro de Belleza. Todos los derechos reservados.
            </p>
            <p className="text-xs text-beige-light/50 font-light tracking-wide mt-4 md:mt-0">
              Diseño por AntiGravity
            </p>
          </div>
        </Container>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://api.whatsapp.com/send/?phone=541131846305&text&type=phone_number&app_absent=0&utm_source=ig" 
        target="_blank" 
        rel="noopener noreferrer"
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
