import { motion } from 'framer-motion';

interface PremioResumen {
  sello_numero: number;
  descripcion: string | null;
}

interface TarjetaSellosProps {
  ciclo: number;
  sellosDelCiclo: number;
  totalSellosPorCiclo: number;
  activa?: boolean;
  premios?: PremioResumen[];
}

export function TarjetaSellos({
  ciclo,
  sellosDelCiclo,
  totalSellosPorCiclo,
  activa = true,
  premios,
}: TarjetaSellosProps) {
  const sellos = Array.from({ length: totalSellosPorCiclo }, (_, i) => i < sellosDelCiclo);
  const ultimoSellado = sellosDelCiclo - 1;
  // El corazón sale de premios REALMENTE otorgados (filas de fidelidad_premios
  // ya creadas), nunca de la config actual de reglas — si Sol agrega o saca una
  // regla, eso solo afecta sellos que se otorguen de ahora en más (ver
  // otorgarSelloSiCorresponde), nunca marca retroactivamente un sello ya sellado.
  const numerosConPremio = new Set((premios ?? []).map((p) => p.sello_numero));

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-cream via-cream to-beige-light rounded-3xl shadow-soft ring-1 ring-charcoal/[0.06] p-5 sm:p-12 flex flex-col justify-between gap-4 sm:gap-8 select-none">
      <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div className="text-left">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-charcoal/50 font-sans">
            Tarjeta N.º {ciclo}
            {!activa && ' · completa'}
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-charcoal">Tu fidelidad</h2>
        </div>
        <span className="text-2xl sm:text-4xl leading-none">💎</span>
      </div>

      <div className="relative grid grid-cols-5 justify-items-center gap-y-3 sm:flex sm:justify-between sm:gap-y-0">
        {sellos.map((sellado, i) => {
          const esSelloConPremio = numerosConPremio.has(i + 1);
          return (
          <div key={i} className="relative">
            {activa && i === ultimoSellado && (
              <motion.span
                className="absolute inset-0 rounded-full bg-gold/40"
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <motion.span
              initial={{ scale: 0, rotate: sellado ? -90 : 0 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.04 }}
              className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-full border flex items-center justify-center text-sm sm:text-base font-sans ${
                sellado ? 'bg-gold border-gold text-white' : 'border-charcoal/20 text-charcoal/30'
              }`}
            >
              {sellado ? (esSelloConPremio ? '❤️' : '✓') : i + 1}
            </motion.span>
          </div>
          );
        })}
      </div>

      <div className="relative">
        {activa ? (
          <p className="text-sm sm:text-base text-charcoal/60 font-sans">
            {sellosDelCiclo} de {totalSellosPorCiclo} sellos — te faltan{' '}
            {Math.max(totalSellosPorCiclo - sellosDelCiclo, 0)} para completar la tarjeta.
          </p>
        ) : premios && premios.length > 0 ? (
          <ul className="flex flex-col gap-1 text-left max-h-24 overflow-y-auto">
            {premios.map((p, i) => (
              <li key={i} className="font-sans text-sm sm:text-base text-charcoal/70">
                🎁 Sello {p.sello_numero}: {p.descripcion || 'Premio pendiente de girar'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm sm:text-base text-charcoal/50 font-sans">Sin premios en esta tarjeta.</p>
        )}
      </div>
    </div>
  );
}
