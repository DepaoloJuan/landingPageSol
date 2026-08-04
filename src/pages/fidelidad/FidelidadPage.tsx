import { useEffect, useState, useCallback } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { GoogleLoginButton } from '../../components/fidelidad/GoogleLoginButton';
import { EmailLoginForm } from '../../components/fidelidad/EmailLoginForm';
import { EmailRegistroForm } from '../../components/fidelidad/EmailRegistroForm';
import { OlvidePasswordForm } from '../../components/fidelidad/OlvidePasswordForm';
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

type VistaEmail = 'oculto' | 'login' | 'registro' | 'olvide';

export function FidelidadPage() {
  const [estado, setEstado] = useState<Estado>({ paso: 'cargando' });
  const [vistaEmail, setVistaEmail] = useState<VistaEmail>('oculto');

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
    <div className="relative min-h-screen bg-beige-light font-sans text-charcoal flex items-center justify-center px-4">
      {estado.paso === 'dashboard' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            borrarToken();
            setVistaEmail('oculto');
            setEstado({ paso: 'login' });
          }}
          className="fixed top-6 right-6 z-10"
        >
          Cerrar sesión
        </Button>
      )}

      <Container className="max-w-2xl py-20">
        {estado.paso === 'cargando' && (
          <p className="text-center text-charcoal/50">Cargando...</p>
        )}

        {estado.paso === 'login' && vistaEmail === 'oculto' && (
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="font-serif text-3xl text-charcoal">Mi Fidelidad</h1>
            <p className="text-charcoal/60 max-w-sm">
              Iniciá sesión para ver tu tarjeta de sellos y tus premios.
            </p>
            <GoogleLoginButton
              onLogueada={evaluarEstado}
              onError={(mensaje) => setEstado({ paso: 'error', mensaje })}
            />
            <button
              onClick={() => setVistaEmail('login')}
              className="text-sm text-charcoal/50 hover:text-charcoal underline font-sans"
            >
              ¿No tenés Gmail? Ingresá con tu email
            </button>
          </div>
        )}

        {estado.paso === 'login' && vistaEmail === 'login' && (
          <EmailLoginForm
            onLogueada={evaluarEstado}
            onIrARegistro={() => setVistaEmail('registro')}
            onOlvidePassword={() => setVistaEmail('olvide')}
          />
        )}

        {estado.paso === 'login' && vistaEmail === 'registro' && (
          <EmailRegistroForm
            onRegistrada={evaluarEstado}
            onIrALogin={() => setVistaEmail('login')}
          />
        )}

        {estado.paso === 'login' && vistaEmail === 'olvide' && (
          <OlvidePasswordForm onVolver={() => setVistaEmail('login')} />
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
                setVistaEmail('oculto');
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
