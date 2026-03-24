import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

const WA_URL = 'https://api.whatsapp.com/send/?phone=541131846305&text&type=phone_number&app_absent=0';

const navLinks = [
  { label: 'Servicios',  href: '#services' },
  { label: 'Cursos',     href: '#courses'  },
  { label: 'Resultados', href: '#gallery'  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  const handleNavClick = (href: string) => {
    closeMenu();
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || mobileOpen
            ? 'bg-beige-light/95 backdrop-blur-md shadow-soft py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <Container className="flex items-center justify-between">

          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-3xl font-serif font-semibold tracking-wide text-charcoal"
          >
            Sol Cantero
          </a>

          {/* Nav desktop */}
          <nav
            className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide"
            aria-label="Navegacion principal"
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="relative group hover:text-gold transition-colors duration-300"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA desktop */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => window.open(WA_URL, '_blank')}
            className="hidden md:inline-flex"
            aria-label="Reservar cita por WhatsApp"
          >
            Reserva tu cita
          </Button>

          {/* Hamburger — solo mobile */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-charcoal hover:text-gold transition-colors duration-300"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={String(mobileOpen) as 'true' | 'false'}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} strokeWidth={1.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} strokeWidth={1.5} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

        </Container>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              id="mobile-menu"
              role="dialog"
              aria-modal={true}
              aria-label="Menu de navegacion"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-4/5 max-w-sm bg-beige-light flex flex-col md:hidden shadow-2xl"
            >
              {/* Header del drawer */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-charcoal/10">
                <span className="text-2xl font-serif font-semibold text-charcoal">Sol Cantero</span>
                <button
                  onClick={closeMenu}
                  className="w-9 h-9 flex items-center justify-center text-charcoal hover:text-gold transition-colors"
                  aria-label="Cerrar menu"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col px-6 pt-8 gap-2 flex-1" aria-label="Navegacion mobile">
                {navLinks.map(({ label, href }, i) => (
                  <motion.a
                    key={href}
                    href={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                    onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                    className="text-2xl font-serif text-charcoal hover:text-gold transition-colors duration-300 py-4 border-b border-charcoal/10 last:border-0"
                  >
                    {label}
                  </motion.a>
                ))}
              </nav>

              {/* CTA en el drawer */}
              <div className="px-6 pb-10 pt-4">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => { closeMenu(); window.open(WA_URL, '_blank'); }}
                  className="w-full justify-center"
                  aria-label="Reservar cita por WhatsApp"
                >
                  Reserva tu cita
                </Button>
                <p className="text-center text-xs text-charcoal/40 font-light mt-4 tracking-wide">
                  Mar a Sab · 9 a 19 hs
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


