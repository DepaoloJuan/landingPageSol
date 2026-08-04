import { useState } from 'react';
import { Container } from '../ui/Container';
import { TarjetaSellos } from './TarjetaSellos';
import { PremioCard } from './PremioCard';
import { Historial } from './Historial';
import { TarjetasAnteriores } from './TarjetasAnteriores';
import type { Progreso, Premio } from '../../lib/fidelidadApi';

interface DashboardProps {
  progreso: Progreso;
}

function primerNombre(nombreCompleto: string | null): string | null {
  if (!nombreCompleto) return null;
  const primera = nombreCompleto.trim().split(/\s+/)[0];
  return primera.charAt(0).toUpperCase() + primera.slice(1).toLowerCase();
}

export function Dashboard({ progreso }: DashboardProps) {
  const [premios, setPremios] = useState<Premio[]>(progreso.premios);
  const nombre = primerNombre(progreso.nombre);

  const handleGirado = (premioActualizado: Premio) => {
    setPremios((prev) => prev.map((p) => (p.id === premioActualizado.id ? premioActualizado : p)));
  };

  return (
    <Container className="py-32 flex flex-col gap-8">
      <h1 className="font-serif text-2xl text-charcoal text-center">
        {nombre ? `¡Bienvenida, ${nombre}!` : '¡Bienvenida!'}
      </h1>

      <TarjetaSellos
        cicloActual={progreso.ciclo_actual}
        sellosDelCiclo={progreso.sellos_del_ciclo}
        totalSellosPorCiclo={progreso.total_sellos_por_ciclo}
      />

      {premios.map((premio) => (
        <PremioCard key={premio.id} premio={premio} onGirado={handleGirado} />
      ))}

      <TarjetasAnteriores />

      <Historial />
    </Container>
  );
}
