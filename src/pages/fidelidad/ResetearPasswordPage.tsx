import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { resetearPassword, FidelidadApiError } from '../../lib/fidelidadApi';

export function ResetearPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La contraseña tiene que tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) return;

    setEnviando(true);
    try {
      await resetearPassword(token, password);
      setListo(true);
    } catch (err) {
      setError(err instanceof FidelidadApiError ? err.message : 'No se pudo actualizar la contraseña.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-beige-light font-sans text-charcoal flex items-center justify-center px-4">
      <Link
        to="/"
        className="fixed top-6 left-6 z-10 text-sm text-charcoal/60 hover:text-charcoal underline font-sans"
      >
        ← Volver al sitio
      </Link>

      <Container className="max-w-md py-20 text-center">
        <h1 className="font-serif text-2xl text-charcoal mb-6">Elegí tu nueva contraseña</h1>

        {!token && (
          <p className="text-rose-dark">Este link no es válido. Pedí uno nuevo desde "Olvidé mi contraseña".</p>
        )}

        {token && listo && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-charcoal/70">Listo, tu contraseña se actualizó.</p>
            <Link to="/mi-fidelidad" className="text-sm text-charcoal/50 hover:text-charcoal underline">
              Ir a iniciar sesión
            </Link>
          </div>
        )}

        {token && !listo && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña nueva"
              required
              className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
            />
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
            />
            {error && <p className="text-sm text-rose-dark font-sans">{error}</p>}
            <Button type="submit" variant="primary" disabled={enviando} className="justify-center">
              {enviando ? 'Guardando...' : 'Guardar contraseña'}
            </Button>
          </form>
        )}
      </Container>
    </div>
  );
}
