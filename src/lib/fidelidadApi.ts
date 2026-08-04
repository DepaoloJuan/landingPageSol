import { API_URL } from './constants';

const TOKEN_KEY = 'sc_fidelidad_token';

export const guardarToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const obtenerToken = () => localStorage.getItem(TOKEN_KEY);
export const borrarToken = () => localStorage.removeItem(TOKEN_KEY);

export interface Premio {
  id: number;
  ciclo: number;
  sello_numero: 5 | 10;
  tipo_premio: string | null;
  descripcion: string | null;
  redimido: boolean;
}

export interface Progreso {
  ok: true;
  estado_vinculacion: 'pendiente' | 'auto' | 'manual' | 'rechazada';
  requiere_telefono: boolean;
  ciclo_actual: number;
  sellos_del_ciclo: number;
  total_sellos_por_ciclo: number;
  premios: Premio[];
}

export interface TurnoHistorial {
  fecha: string;
  hora: string;
  estado: string;
  servicio: string | null;
  empleada: string | null;
}

class FidelidadApiError extends Error {
  status: number;
  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.status = status;
  }
}

async function pedido<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = obtenerToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    borrarToken();
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.ok === false) {
    throw new FidelidadApiError(res.status, data.mensaje || 'Ocurrió un error inesperado.');
  }

  return data as T;
}

export const loginGoogle = (idToken: string) =>
  pedido<{ ok: true; token: string; requiere_telefono: boolean; estado_vinculacion?: string }>(
    '/api/fidelidad/login-google',
    { method: 'POST', body: JSON.stringify({ id_token: idToken }) },
  );

export const enviarTelefono = (telefono: string) =>
  pedido<{ ok: true; estado_vinculacion: string }>('/api/fidelidad/telefono', {
    method: 'POST',
    body: JSON.stringify({ telefono }),
  });

export const getProgreso = () => pedido<Progreso>('/api/fidelidad/progreso');

export const girarPremio = (id: number) =>
  pedido<{ ok: true; premio: Premio; ya_girado: boolean }>(`/api/fidelidad/premios/${id}/girar`, {
    method: 'POST',
  });

export const getHistorial = (offset = 0) =>
  pedido<{ ok: true; turnos: TurnoHistorial[] }>(`/api/fidelidad/historial?limit=20&offset=${offset}`);

export { FidelidadApiError };
