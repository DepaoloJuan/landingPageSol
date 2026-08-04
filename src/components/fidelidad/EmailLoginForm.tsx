import { useState } from 'react';
import { Button } from '../ui/Button';
import { loginEmail, guardarToken, FidelidadApiError } from '../../lib/fidelidadApi';

interface EmailLoginFormProps {
  onLogueada: () => void;
  onIrARegistro: () => void;
  onOlvidePassword: () => void;
}

export function EmailLoginForm({ onLogueada, onIrARegistro, onOlvidePassword }: EmailLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const data = await loginEmail({ email: email.trim(), password });
      guardarToken(data.token);
      onLogueada();
    } catch (err) {
      setError(err instanceof FidelidadApiError ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        required
        className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
      />
      {error && <p className="text-sm text-rose-dark font-sans">{error}</p>}
      <Button type="submit" variant="primary" disabled={enviando} className="justify-center">
        {enviando ? 'Ingresando...' : 'Ingresar'}
      </Button>
      <div className="flex items-center justify-between text-sm font-sans">
        <button type="button" onClick={onOlvidePassword} className="text-charcoal/50 hover:text-charcoal underline">
          Olvidé mi contraseña
        </button>
        <button type="button" onClick={onIrARegistro} className="text-charcoal/50 hover:text-charcoal underline">
          Crear cuenta
        </button>
      </div>
    </form>
  );
}
