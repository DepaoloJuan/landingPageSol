interface TarjetaSellosProps {
  cicloActual: number;
  sellosDelCiclo: number;
  totalSellosPorCiclo: number;
}

export function TarjetaSellos({ cicloActual, sellosDelCiclo, totalSellosPorCiclo }: TarjetaSellosProps) {
  const sellos = Array.from({ length: totalSellosPorCiclo }, (_, i) => i < sellosDelCiclo);

  return (
    <div className="w-full max-w-md mx-auto bg-cream rounded-3xl shadow-soft p-8 text-center">
      <p className="text-xs uppercase tracking-widest text-charcoal/50 font-sans mb-1">
        Tarjeta N.º {cicloActual}
      </p>
      <h2 className="font-serif text-2xl text-charcoal mb-6">Tu fidelidad</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {sellos.map((sellado, i) => (
          <span
            key={i}
            className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-sans transition-colors ${
              sellado
                ? 'bg-gold border-gold text-white'
                : 'border-charcoal/20 text-charcoal/30'
            }`}
          >
            {sellado ? '✓' : i + 1}
          </span>
        ))}
      </div>
      <p className="text-sm text-charcoal/60 font-sans mt-6">
        {sellosDelCiclo} de {totalSellosPorCiclo} sellos — te faltan{' '}
        {Math.max(totalSellosPorCiclo - sellosDelCiclo, 0)} para completar la tarjeta.
      </p>
    </div>
  );
}
