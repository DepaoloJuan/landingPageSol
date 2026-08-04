import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { getHistorial, type TurnoHistorial } from '../../lib/fidelidadApi';

const PAGINA = 20;

function formatearFecha(fechaISO: string) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function Historial() {
  const [turnos, setTurnos] = useState<TurnoHistorial[]>([]);
  const [offset, setOffset] = useState(0);
  const [hayMas, setHayMas] = useState(true);
  const [cargando, setCargando] = useState(true);

  const cargar = async (desde: number, reemplazar: boolean) => {
    setCargando(true);
    try {
      const data = await getHistorial(desde);
      setTurnos((prev) => (reemplazar ? data.turnos : [...prev, ...data.turnos]));
      setHayMas(data.turnos.length === PAGINA);
      setOffset(desde + data.turnos.length);
    } catch {
      setHayMas(false);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <h3 className="font-serif text-xl text-charcoal mb-4 text-center">Tu historial</h3>

      {turnos.length === 0 && !cargando && (
        <p className="text-sm text-charcoal/50 font-sans text-center">Todavía no tenés turnos registrados.</p>
      )}

      <ul className="flex flex-col gap-3">
        {turnos.map((t, i) => (
          <li
            key={`${t.fecha}-${t.hora}-${i}`}
            className="bg-pearl rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
          >
            <div>
              <p className="font-sans text-sm font-medium text-charcoal">{t.servicio || 'Servicio'}</p>
              <p className="font-sans text-xs text-charcoal/50">{formatearFecha(t.fecha)} · {t.empleada || 'Sol Cantero'}</p>
            </div>
          </li>
        ))}
      </ul>

      {hayMas && (
        <div className="text-center mt-6">
          <Button variant="outline" size="sm" onClick={() => cargar(offset, false)} disabled={cargando}>
            {cargando ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </div>
  );
}
