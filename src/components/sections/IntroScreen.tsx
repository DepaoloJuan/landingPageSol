import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';

// ─── Constantes ───────────────────────────────────────────────────────────────
const QUOTE = 'Cuando te brindas amor, lo bonito florece solo.';
const WORDS = QUOTE.split(' ');
const SESSION_KEY = 'sc_intro_seen';

// Cubic bezier tipado explícitamente para satisfacer Framer Motion v12
const EASE_OUT_EXPO = [0.76, 0, 0.24, 1] as [number, number, number, number];
const EASE_SPRING   = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ─── Variantes ────────────────────────────────────────────────────────────────

const curtainVariants: Variants = {
  initial: { y: '0%' },
  exit: {
    y: '-100%',
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const curtainLogoVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' as const },
  },
};

const lineVariants: Variants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: {
    scaleX: 1,
    opacity: 0.7,
    transition: { duration: 0.7, ease: EASE_SPRING },
  },
};

const badgeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SPRING },
  },
};

const wordVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_SPRING },
  },
};

const brandVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_SPRING },
  },
};

const contentVariants: Variants = {
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: 'easeIn' as const },
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────
interface IntroScreenProps {
  onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<'curtain' | 'reveal' | 'exit'>('curtain');

  useEffect(() => {
    // Respeta prefers-reduced-motion: salta la intro directamente
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      onComplete();
      return;
    }

    // Fase 1 → Cortina visible con logo (800ms) → Reveal
    const t1 = setTimeout(() => setPhase('reveal'), 800);

    // Fase 2 → Contenido animado (800 + 3800ms de lectura) → Exit
    const t2 = setTimeout(() => setPhase('exit'), 4600);

    // Fase 3 → Desmontar y habilitar el cuerpo de la página
    const t3 = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1');
      onComplete();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-beige-light overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Cortina charcoal ── */}
      <AnimatePresence>
        {phase === 'curtain' && (
          <motion.div
            key="curtain"
            variants={curtainVariants}
            initial="initial"
            exit="exit"
            className="absolute inset-0 bg-charcoal flex items-center justify-center z-10"
          >
            <motion.p
              variants={curtainLogoVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="font-serif text-beige-light text-2xl md:text-3xl tracking-[0.12em] uppercase font-light"
            >
              Sol Cantero
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contenido editorial ── */}
      <AnimatePresence>
        {phase === 'reveal' && (
          <motion.div
            key="content"
            variants={contentVariants}
            animate="animate"
            exit="exit"
            className="relative flex flex-col items-center justify-center w-full h-full px-6"
          >
            {/* Línea decorativa superior */}
            <motion.span
              variants={lineVariants}
              initial="initial"
              animate="animate"
              className="absolute top-12 left-1/2 -translate-x-1/2 w-40 h-px bg-gold origin-center"
            />

            {/* Badge */}
            <motion.p
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
              className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-gold mb-8"
            >
              Centro de Estética
            </motion.p>

            {/* Frase — cada palabra animada individualmente */}
            <p className="font-serif text-charcoal text-xl md:text-2xl lg:text-3xl font-light italic text-center leading-relaxed max-w-md md:max-w-xl tracking-[-0.01em]">
              {WORDS.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="inline-block mr-[0.28em]"
                >
                  {word}
                </motion.span>
              ))}
            </p>

            {/* Marca */}
            <motion.p
              variants={brandVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 + WORDS.length * 0.07 + 0.25 }}
              className="font-serif text-charcoal text-3xl md:text-4xl font-normal tracking-[0.05em] mt-8"
            >
              Sol <span className="italic font-light text-gold">Cantero.</span>
            </motion.p>

            {/* Línea decorativa inferior */}
            <motion.span
              variants={lineVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.05 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-px bg-gold origin-center"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
