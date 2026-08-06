import { useState } from 'react';
import { motion } from 'framer-motion';
import { girarPremio, type Premio } from '../../lib/fidelidadApi';
import { PremioModal } from './PremioModal';

interface PremioCardProps {
  premio: Premio;
  onGirado: (premioActualizado: Premio) => void;
}

export function PremioCard({ premio, onGirado }: PremioCardProps) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<Premio | null>(
    premio.tipo_premio ? premio : null,
  );
  // Si ya estaba ganado ANTES de entrar (ej. se recarga la página), mostramos
  // directo la card compacta. Si se gana en esta sesión, nos quedamos en el
  // modal hasta que la clienta lo cierra — no apenas llega la respuesta del
  // server, que si no el modal se cierra solo antes de poder mostrar nada.
  const [mostrarCompacta, setMostrarCompacta] = useState(Boolean(premio.tipo_premio));

  const handleGirar = async () => {
    setModalAbierto(true);
    setGirando(true);
    try {
      const data = await girarPremio(premio.id);
      onGirado(data.premio);
      setResultado(data.premio);
    } catch {
      // si falla, se cierra el modal y se puede reintentar — no rompemos la UI
      setModalAbierto(false);
    } finally {
      setGirando(false);
    }
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setMostrarCompacta(true);
  };

  if (mostrarCompacta) {
    const ganado = resultado ?? premio;
    return (
      <div className="w-full max-w-md mx-auto bg-gold/10 border border-gold/30 rounded-3xl p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-gold font-sans mb-1">
          Sello {ganado.sello_numero} — ganaste
        </p>
        <p className="font-serif text-xl text-charcoal">{ganado.descripcion}</p>
      </div>
    );
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={handleGirar}
        disabled={girando}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full max-w-md mx-auto block bg-charcoal text-beige rounded-3xl shadow-soft p-8 text-center font-serif text-xl"
      >
        🎁 Llegaste al sello {premio.sello_numero} — Descubrí tu premio
      </motion.button>

      <PremioModal
        abierto={modalAbierto}
        estado={girando ? 'girando' : 'revelado'}
        selloNumero={premio.sello_numero}
        descripcion={resultado?.descripcion ?? null}
        onCerrar={handleCerrarModal}
      />
    </>
  );
}
