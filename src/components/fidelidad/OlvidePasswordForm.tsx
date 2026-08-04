import { useState } from 'react';
import { Button } from '../ui/Button';
import { olvidePassword, FidelidadApiError } from '../../lib/fidelidadApi';

interface OlvidePasswordFormProps {
  onVolver: () => void;
}

export function OlvidePasswordForm({ onVolver }: OlvidePasswordFormProps) {
  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await olvidePassword(email.trim());
      setEnviado(true);
    } catch (err) {
      setError(err instanceof FidelidadApiError ? err.message : 'No se pudo procesar el pedido.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="w-full max-w-sm mx-auto text-center flex flex-col gap-4">
        <p className="text-charcoal/70">
          Si el email está registrado, te mandamos un link para restablecer la contraseña. Revisá tu casilla.
        </p>
        <button type="button" onClick={onVolver} className="text-sm text-charcoal/50 hover:text-charcoal underline">
          Volver
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-4">
      <p className="text-sm text-charcoal/60 font-sans">
        Ingresá tu email y te mandamos un link para elegir una contraseña nueva.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        required
        className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
      />
      {error && <p className="text-sm text-rose-dark font-sans">{error}</p>}
      <Button type="submit" variant="primary" disabled={enviando} className="justify-center">
        {enviando ? 'Enviando...' : 'Mandar link'}
      </Button>
      <div className="text-center text-sm font-sans">
        <button type="button" onClick={onVolver} className="text-charcoal/50 hover:text-charcoal underline">
          Volver
        </button>
      </div>
    </form>
  );
}
