import { useState } from 'react';
import { Container } from '../ui/Container';
import { TarjetaSellos } from './TarjetaSellos';
import { PremioCard } from './PremioCard';
import { Historial } from './Historial';
import type { Progreso, Premio } from '../../lib/fidelidadApi';

interface DashboardProps {
  progreso: Progreso;
}

export function Dashboard({ progreso }: DashboardProps) {
  const [premios, setPremios] = useState<Premio[]>(progreso.premios);

  const handleGirado = (premioActualizado: Premio) => {
    setPremios((prev) => prev.map((p) => (p.id === premioActualizado.id ? premioActualizado : p)));
  };

  return (
    <Container className="py-32 flex flex-col gap-8">
      <TarjetaSellos
        cicloActual={progreso.ciclo_actual}
        sellosDelCiclo={progreso.sellos_del_ciclo}
        totalSellosPorCiclo={progreso.total_sellos_por_ciclo}
      />

      {premios.map((premio) => (
        <PremioCard key={premio.id} premio={premio} onGirado={handleGirado} />
      ))}

      <Historial />
    </Container>
  );
}
