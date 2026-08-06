import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

interface PremioModalProps {
  abierto: boolean;
  estado: 'girando' | 'revelado';
  selloNumero: number;
  descripcion: string | null;
  onCerrar: () => void;
}

export function PremioModal({ abierto, estado, selloNumero, descripcion, onCerrar }: PremioModalProps) {
  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-4"
          onClick={() => estado === 'revelado' && onCerrar()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-gradient-to-b from-cream to-beige-light rounded-3xl shadow-glow p-10 text-center overflow-hidden"
          >
            <motion.div
              className="pointer-events-none absolute -inset-16 rounded-full bg-gold/20 blur-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative">
              <AnimatePresence mode="wait">
                {estado === 'girando' ? (
                  <motion.div
                    key="girando"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-5 py-4"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full border-2 border-gold border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <p className="font-serif text-xl text-charcoal">Descubriendo tu premio...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="revelado"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <span className="text-4xl">🎁</span>
                    <p className="text-xs uppercase tracking-widest text-gold font-sans">
                      Sello {selloNumero} — ¡Ganaste!
                    </p>
                    <p className="font-serif text-2xl text-charcoal leading-snug">{descripcion}</p>
                    <p className="text-xs text-charcoal/50 font-sans mt-1">
                      Mostrale esta pantalla a Sol en tu próxima visita.
                    </p>
                    <Button variant="secondary" size="sm" onClick={onCerrar} className="mt-4">
                      ¡Buenísimo!
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
