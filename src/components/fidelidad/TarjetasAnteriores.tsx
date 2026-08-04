import { useEffect, useState } from 'react';
import { getTarjetasAnteriores, type TarjetaAnterior } from '../../lib/fidelidadApi';

const VISIBLES_COLAPSADO = 3;

export function TarjetasAnteriores() {
  const [tarjetas, setTarjetas] = useState<TarjetaAnterior[]>([]);
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState(false);

  useEffect(() => {
    getTarjetasAnteriores()
      .then((data) => setTarjetas(data.tarjetas))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  if (cargando || tarjetas.length === 0) return null;

  const visibles = expandido ? tarjetas : tarjetas.slice(0, VISIBLES_COLAPSADO);
  const hayOcultas = !expandido && tarjetas.length > VISIBLES_COLAPSADO;

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h3 className="font-serif text-xl text-charcoal mb-4 text-center">Tus tarjetas anteriores</h3>

      <ul className="flex flex-col gap-3">
        {visibles.map((t) => (
          <li key={t.ciclo} className="bg-pearl rounded-2xl px-5 py-4">
            <p className="font-sans text-sm font-medium text-charcoal mb-1">Tarjeta N.º {t.ciclo} — completa</p>
            {t.premios.length === 0 ? (
              <p className="font-sans text-xs text-charcoal/50">Sin premios en esta tarjeta.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {t.premios.map((p, i) => (
                  <li key={i} className="font-sans text-xs text-charcoal/70">
                    🎁 Sello {p.sello_numero}: {p.descripcion || 'Premio pendiente de girar'}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {hayOcultas && (
        <div className="text-center mt-4">
          <button
            onClick={() => setExpandido(true)}
            className="text-sm text-charcoal/50 hover:text-charcoal underline font-sans"
          >
            Ver todas mis tarjetas
          </button>
        </div>
      )}
    </div>
  );
}
