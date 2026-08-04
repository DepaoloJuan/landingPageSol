import { useState } from 'react';
import { Button } from '../ui/Button';
import { registro, guardarToken, FidelidadApiError } from '../../lib/fidelidadApi';

interface EmailRegistroFormProps {
  onRegistrada: () => void;
  onIrALogin: () => void;
}

export function EmailRegistroForm({ onRegistrada, onIrALogin }: EmailRegistroFormProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [telefono, setTelefono] = useState('');
  const [enviando, setEnviando] = useState(false);
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

    setEnviando(true);
    try {
      const data = await registro({ nombre: nombre.trim(), email: email.trim(), password, telefono: telefono.trim() });
      guardarToken(data.token);
      onRegistrada();
    } catch (err) {
      setError(err instanceof FidelidadApiError ? err.message : 'No se pudo crear la cuenta.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-4">
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        required
        className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        required
        className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
      />
      <input
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Tu teléfono (el que usás en el salón)"
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
        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
      <div className="text-center text-sm font-sans">
        <button type="button" onClick={onIrALogin} className="text-charcoal/50 hover:text-charcoal underline">
          ¿Ya tenés cuenta? Ingresá
        </button>
      </div>
    </form>
  );
}
