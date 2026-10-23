import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SESSION_KEY } from '../../lib/constants';

const EASE_OUT_EXPO = [0.76, 0, 0.24, 1] as [number, number, number, number];

interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<'intro' | 'exit'>('intro');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    // Fase 1 → video + branding visible (3200ms)
    const t1 = setTimeout(() => setPhase('exit'), 5000);

    // Fase 2 → animación de salida termina → desmontamos
    const t2 = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1');
      onComplete();
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: EASE_OUT_EXPO },
            }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="absolute inset-0 bg-white flex items-center justify-center"
          >
            {/* Video de fondo */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full md:object-cover object-contain"
            >
              <source src="/videos/Sol_Cantero.webm" type="video/webm" />
            </video>

            {/* Fallback por si el video no carga */}
            <div className="absolute inset-0 bg-white" style={{ zIndex: -1 }} />

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}