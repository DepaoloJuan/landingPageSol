import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { girarPremio, type Premio } from '../../lib/fidelidadApi';

interface PremioCardProps {
  premio: Premio;
  onGirado: (premioActualizado: Premio) => void;
}

export function PremioCard({ premio, onGirado }: PremioCardProps) {
  const [girando, setGirando] = useState(false);
  const [revelado, setRevelado] = useState(Boolean(premio.tipo_premio));

  const handleGirar = async () => {
    setGirando(true);
    try {
      const data = await girarPremio(premio.id);
      onGirado(data.premio);
      setRevelado(true);
    } catch {
      // si falla, se puede reintentar — no rompemos la UI
    } finally {
      setGirando(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto [perspective:1000px]">
      <AnimatePresence mode="wait">
        {!revelado ? (
          <motion.button
            key="oculto"
            type="button"
            onClick={handleGirar}
            disabled={girando}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full bg-charcoal text-beige rounded-3xl shadow-soft p-8 text-center font-serif text-xl"
          >
            {girando ? 'Descubriendo...' : `🎁 Llegaste al sello ${premio.sello_numero} — Descubrí tu premio`}
          </motion.button>
        ) : (
          <motion.div
            key="revelado"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            className="w-full bg-gold text-white rounded-3xl shadow-glow p-8 text-center"
          >
            <p className="text-xs uppercase tracking-widest opacity-80 font-sans mb-2">Ganaste</p>
            <p className="font-serif text-2xl">{premio.descripcion}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
