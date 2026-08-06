import { useState } from 'react';
import { Button } from '../ui/Button';
import { enviarTelefono } from '../../lib/fidelidadApi';

interface TelefonoFormProps {
  onVinculada: () => void;
  onPendiente: () => void;
}

export function TelefonoForm({ onVinculada, onPendiente }: TelefonoFormProps) {
  const [telefono, setTelefono] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telefono.trim()) return;

    setEnviando(true);
    setError(null);
    try {
      const data = await enviarTelefono(telefono.trim());
      if (data.estado_vinculacion === 'auto' || data.estado_vinculacion === 'manual') {
        onVinculada();
      } else {
        onPendiente();
      }
    } catch {
      setError('No pudimos procesar el teléfono. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col gap-4">
      <div>
        <h2 className="font-serif text-2xl text-charcoal mb-2">¡Ya casi!</h2>
        <p className="text-sm text-charcoal/60 font-sans">
          Ingresá el número de teléfono con el que estás registrada en el salón, así te vinculamos con tu historial.
        </p>
      </div>
      <input
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="11 1234-5678"
        required
        className="w-full px-5 py-3.5 rounded-2xl border border-charcoal/20 bg-transparent font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors"
      />
      {error && <p className="text-sm text-rose-dark font-sans">{error}</p>}
      <Button type="submit" variant="primary" disabled={enviando} className="justify-center">
        {enviando ? 'Enviando...' : 'Continuar'}
      </Button>
    </form>
  );
}
