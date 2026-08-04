import { useEffect, useState, useCallback } from 'react';
import { Container } from '../../components/ui/Container';
import { GoogleLoginButton } from '../../components/fidelidad/GoogleLoginButton';
import { TelefonoForm } from '../../components/fidelidad/TelefonoForm';
import { Dashboard } from '../../components/fidelidad/Dashboard';
import { obtenerToken, borrarToken, getProgreso, type Progreso } from '../../lib/fidelidadApi';

type Estado =
  | { paso: 'cargando' }
  | { paso: 'login' }
  | { paso: 'telefono' }
  | { paso: 'esperando' }
  | { paso: 'error'; mensaje: string }
  | { paso: 'dashboard'; progreso: Progreso };

export function FidelidadPage() {
  const [estado, setEstado] = useState<Estado>({ paso: 'cargando' });

  const evaluarEstado = useCallback(async () => {
    if (!obtenerToken()) {
      setEstado({ paso: 'login' });
      return;
    }

    try {
      const progreso = await getProgreso();
      if (progreso.estado_vinculacion === 'auto' || progreso.estado_vinculacion === 'manual') {
        setEstado({ paso: 'dashboard', progreso });
      } else if (progreso.requiere_telefono) {
        setEstado({ paso: 'telefono' });
      } else {
        setEstado({ paso: 'esperando' });
      }
    } catch {
      if (!obtenerToken()) {
        setEstado({ paso: 'login' });
      } else {
        setEstado({ paso: 'error', mensaje: 'No pudimos cargar tu cuenta. Probá recargar la página.' });
      }
    }
  }, []);

  useEffect(() => {
    evaluarEstado();
  }, [evaluarEstado]);

  return (
    <div className="min-h-screen bg-beige-light font-sans text-charcoal flex items-center justify-center px-4">
      <Container className="max-w-2xl py-20">
        {estado.paso === 'cargando' && (
          <p className="text-center text-charcoal/50">Cargando...</p>
        )}

        {estado.paso === 'login' && (
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="font-serif text-3xl text-charcoal">Mi Fidelidad</h1>
            <p className="text-charcoal/60 max-w-sm">
              Iniciá sesión con Google para ver tu tarjeta de sellos y tus premios.
            </p>
            <GoogleLoginButton
              onLogueada={evaluarEstado}
              onError={(mensaje) => setEstado({ paso: 'error', mensaje })}
            />
          </div>
        )}

        {estado.paso === 'telefono' && (
          <TelefonoForm
            onVinculada={evaluarEstado}
            onPendiente={() => setEstado({ paso: 'esperando' })}
          />
        )}

        {estado.paso === 'esperando' && (
          <div className="text-center flex flex-col items-center gap-4">
            <h2 className="font-serif text-2xl text-charcoal">Ya recibimos tus datos</h2>
            <p className="text-charcoal/60 max-w-sm">
              Sol va a confirmar tu cuenta en breve. Volvé a entrar más tarde para ver tu tarjeta.
            </p>
          </div>
        )}

        {estado.paso === 'error' && (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="text-rose-dark">{estado.mensaje}</p>
            <button
              onClick={() => {
                borrarToken();
                setEstado({ paso: 'login' });
              }}
              className="text-sm text-charcoal/50 underline"
            >
              Volver a intentar
            </button>
          </div>
        )}

        {estado.paso === 'dashboard' && <Dashboard progreso={estado.progreso} />}
      </Container>
    </div>
  );
}
