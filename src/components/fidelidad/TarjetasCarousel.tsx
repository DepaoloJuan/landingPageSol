import { useEffect, useMemo, useState } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TarjetaSellos } from './TarjetaSellos';
import { getTarjetasAnteriores, type Progreso, type TarjetaAnterior } from '../../lib/fidelidadApi';

interface TarjetasCarouselProps {
  progreso: Progreso;
}

type Slide =
  | { tipo: 'actual'; ciclo: number; sellosDelCiclo: number; totalSellosPorCiclo: number }
  | { tipo: 'anterior'; ciclo: number; premios: TarjetaAnterior['premios'] };

const ANCHO_TARJETA_DESKTOP = 680;
const MAX_VISIBLES = 2; // vecinos a cada lado antes de ocultar la tarjeta

// El carrusel posiciona las tarjetas con un ancho fijo en píxeles (necesario
// para el efecto coverflow con transform 3D) — en mobile eso desbordaba la
// pantalla, así que el ancho se recalcula contra el viewport real.
function useAnchoTarjeta() {
  const calcular = () =>
    typeof window === 'undefined'
      ? ANCHO_TARJETA_DESKTOP
      : Math.min(ANCHO_TARJETA_DESKTOP, window.innerWidth - 32);

  const [ancho, setAncho] = useState(calcular);

  useEffect(() => {
    const onResize = () => setAncho(calcular());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return ancho;
}

export function TarjetasCarousel({ progreso }: TarjetasCarouselProps) {
  const [anteriores, setAnteriores] = useState<TarjetaAnterior[]>([]);
  const [activo, setActivo] = useState(0);
  const [dragX, setDragX] = useState(0);
  const anchoTarjeta = useAnchoTarjeta();
  const espaciado = anchoTarjeta * (360 / ANCHO_TARJETA_DESKTOP);

  useEffect(() => {
    getTarjetasAnteriores()
      .then((data) => setAnteriores(data.tarjetas))
      .catch(() => {});
  }, []);

  const slides: Slide[] = useMemo(
    () => [
      {
        tipo: 'actual' as const,
        ciclo: progreso.ciclo_actual,
        sellosDelCiclo: progreso.sellos_del_ciclo,
        totalSellosPorCiclo: progreso.total_sellos_por_ciclo,
      },
      ...anteriores.map((t) => ({ tipo: 'anterior' as const, ciclo: t.ciclo, premios: t.premios })),
    ],
    [progreso, anteriores],
  );

  // progreso.premios puede incluir premios sin girar arrastrados de un ciclo
  // ANTERIOR (ver getPremiosActivos en el backend) — para el corazón de la
  // tarjeta actual solo interesan los del ciclo actual, si no un premio viejo
  // marcaría corazón en un sello que esta tarjeta todavía no llegó a sellar.
  const premiosDelCicloActual = useMemo(
    () => progreso.premios.filter((p) => p.ciclo === progreso.ciclo_actual),
    [progreso],
  );

  const ir = (i: number) => setActivo(Math.max(0, Math.min(slides.length - 1, i)));

  const handlePanEnd = (_: unknown, info: PanInfo) => {
    setDragX(0);
    const pasos = Math.round(-info.offset.x / espaciado);
    if (pasos !== 0) {
      ir(activo + pasos);
    } else if (Math.abs(info.velocity.x) > 500) {
      ir(activo + (info.velocity.x < 0 ? 1 : -1));
    }
  };

  const soloUna = slides.length <= 1;

  return (
    <div className="w-full">
      <div
        className="relative mx-auto"
        style={{ height: 440, maxWidth: 1100, perspective: soloUna ? undefined : 2000 }}
      >
        {soloUna ? (
          <div className="w-full max-w-[680px] mx-auto h-full">
            {slides[0] && slides[0].tipo === 'actual' && (
              <TarjetaSellos
                ciclo={slides[0].ciclo}
                activa
                sellosDelCiclo={slides[0].sellosDelCiclo}
                totalSellosPorCiclo={slides[0].totalSellosPorCiclo}
                premios={premiosDelCicloActual}
              />
            )}
          </div>
        ) : (
          <>
            <motion.div
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
              onPan={(_, info) => setDragX(info.offset.x)}
              onPanEnd={handlePanEnd}
            >
              {slides.map((slide, i) => {
                const offset = i - activo;
                if (Math.abs(offset) > MAX_VISIBLES) return null;
                const esActiva = offset === 0;

                const contenido =
                  slide.tipo === 'actual' ? (
                    <TarjetaSellos
                      ciclo={slide.ciclo}
                      activa
                      sellosDelCiclo={slide.sellosDelCiclo}
                      totalSellosPorCiclo={slide.totalSellosPorCiclo}
                      premios={premiosDelCicloActual}
                    />
                  ) : (
                    <TarjetaSellos
                      ciclo={slide.ciclo}
                      activa={false}
                      sellosDelCiclo={10}
                      totalSellosPorCiclo={10}
                      premios={slide.premios}
                    />
                  );

                return (
                  <motion.div
                    key={slide.ciclo}
                    className="absolute top-0 left-1/2 pointer-events-none"
                    style={{ width: anchoTarjeta, marginLeft: -anchoTarjeta / 2 }}
                    animate={{
                      x: offset * espaciado + (esActiva ? dragX : dragX * 0.4),
                      scale: esActiva ? 1 : 0.82,
                      rotateY: offset * -28,
                      opacity: 1,
                      zIndex: 10 - Math.abs(offset),
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                  >
                    {esActiva ? (
                      <div className="w-full h-full">{contenido}</div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => ir(i)}
                        className="w-full h-full block pointer-events-auto cursor-pointer"
                        aria-label={`Ver tarjeta N.º ${slide.ciclo}`}
                      >
                        {contenido}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {activo > 0 && (
              <button
                type="button"
                onClick={() => ir(activo - 1)}
                aria-label="Tarjeta anterior"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-cream shadow-soft flex items-center justify-center text-charcoal/60 hover:text-charcoal"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {activo < slides.length - 1 && (
              <button
                type="button"
                onClick={() => ir(activo + 1)}
                aria-label="Tarjeta siguiente"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-cream shadow-soft flex items-center justify-center text-charcoal/60 hover:text-charcoal"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </>
        )}
      </div>

      {!soloUna && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((slide, i) => (
            <button
              key={slide.ciclo}
              onClick={() => ir(i)}
              aria-label={`Ir a la tarjeta N.º ${slide.ciclo}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activo ? 'bg-gold' : 'bg-charcoal/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
