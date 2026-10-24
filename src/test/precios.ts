import { vi } from 'vitest';
import type { PrecioCategoria } from '../components/prices/types';

// A published price list as GET /api/landing/precios returns it
export const listaPublicada: PrecioCategoria[] = [
  {
    id: 1,
    nombre: 'Manos',
    items: [
      {
        id: 11,
        nombre: 'Kapping',
        descripcion: 'Baño de gel sobre la uña natural, dura hasta tres semanas.',
        precio: 15000,
        imagenes: ['https://cdn.test/kapping-1.jpg', 'https://cdn.test/kapping-2.jpg'],
      },
      {
        id: 12,
        nombre: 'Esmaltado semipermanente',
        descripcion: null,
        precio: 9500.5,
        imagenes: ['https://cdn.test/semi-1.jpg'],
      },
    ],
  },
  {
    id: 2,
    nombre: 'Pestañas',
    items: [
      {
        id: 21,
        nombre: 'Lifting de pestañas',
        descripcion: 'Curvatura natural que dura entre seis y ocho semanas.',
        precio: null,
        imagenes: ['https://cdn.test/lifting-1.jpg'],
      },
    ],
  },
];

// Replaces fetch with a mock that answers the price list request
export function mockPreciosFetch(respuesta: { ok?: boolean; body?: unknown; error?: Error }) {
  const fetchMock = vi.fn(async () => {
    if (respuesta.error) throw respuesta.error;
    return {
      ok: respuesta.ok ?? true,
      json: async () => respuesta.body,
    } as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
