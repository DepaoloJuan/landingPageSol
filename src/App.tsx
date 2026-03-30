import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';
import { IntroScreen } from './components/sections/IntroScreen';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Services } from './components/sections/Services';
import { Courses } from './components/sections/Courses';
import { Gallery } from './components/sections/Gallery';
import { Testimonials } from './components/sections/Testimonials';
import { Footer } from './components/layout/Footer';

const SESSION_KEY = 'sc_intro_seen';

function App() {
  // Si ya se vio la intro en esta sesión, la saltamos directamente
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem(SESSION_KEY)
  );

  useEffect(() => {
    // Lenis no debe correr mientras la intro bloquea el scroll
    if (showIntro) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [showIntro]); // Se re-ejecuta solo cuando showIntro cambia a false

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

      <div className="bg-beige-light font-sans text-charcoal selection:bg-gold/30 selection:text-white">
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
      </div>
    </>
  );
}

export default App;
