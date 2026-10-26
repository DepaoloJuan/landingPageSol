import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { IntroScreen } from '../components/sections/IntroScreen';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Services } from '../components/sections/Services';
import { Courses } from '../components/sections/Courses';
import { Gallery } from '../components/sections/Gallery';
import { Testimonials } from '../components/sections/Testimonials';
import { Footer } from '../components/layout/Footer';
import { Popup } from '../components/sections/Popup';
import { SESSION_KEY } from '../lib/constants';
import { useSmoothScroll } from '../lib/useSmoothScroll';



export function LandingPage() {
  // Si ya se vio la intro en esta sesión, la saltamos directamente
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem(SESSION_KEY)
  );

  // Lenis no debe correr mientras la intro bloquea el scroll
  useSmoothScroll(!showIntro);

  // Al volver desde otra página con un ancla (por ejemplo /#services), baja a esa sección
  const { hash } = useLocation();
  useEffect(() => {
    if (showIntro || !hash) return;
    const timer = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    return () => clearTimeout(timer);
  }, [showIntro, hash]);

  useEffect(() => {
    // Bloquea el scroll del body durante la intro
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  return (
    <>
      {/* AnimatePresence gestiona el unmount animado de IntroScreen */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroScreen
            key="intro"
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <div className={`bg-beige-light font-sans text-charcoal selection:bg-gold/30 selection:text-white transition-opacity duration-300 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Courses />
          <Gallery />
          <Testimonials />
        </main>
        <Footer />
        <Popup />
      </div>
    </>
  );
}
