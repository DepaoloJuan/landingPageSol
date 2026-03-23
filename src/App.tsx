import { useEffect } from 'react';
import Lenis from 'lenis';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Services } from './components/sections/Services';
import { Courses } from './components/sections/Courses';
import { Gallery } from './components/sections/Gallery';
import { Testimonials } from './components/sections/Testimonials';
import { Footer } from './components/layout/Footer';

function App() {
  useEffect(() => {
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
  }, []);

  return (
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
  );
}

export default App;
