import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-beige-light/80 backdrop-blur-md shadow-soft py-4' : 'bg-transparent py-6'}`}
    >
      <Container className="flex items-center justify-between">
        <div className="text-2xl font-serif font-semibold tracking-wide text-charcoal">
          Sol Cantero.
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#services" className="relative group hover:text-gold transition-colors">
            Servicios
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>
          <a href="#courses" className="relative group hover:text-gold transition-colors">
            Cursos
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>
          <a href="#gallery" className="relative group hover:text-gold transition-colors">
            Resultados
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 ease-out group-hover:w-full"></span>
          </a>
        </nav>
        <Button 
          size="sm" 
          variant="primary"
          onClick={() => window.open('https://api.whatsapp.com/send/?phone=541131846305&text&type=phone_number&app_absent=0&utm_source=ig', '_blank')}
        >
          Turnos
        </Button>
      </Container>
    </motion.header>
  );
}
