// Forma de GET /api/landing/precios (la versión que Soledad publicó desde Sol Admin)
export interface PrecioItem {
  id: number;
  nombre: string;
  precio: number | null;
  imagenes: string[];
}

export interface PrecioCategoria {
  id: number;
  nombre: string;
  items: PrecioItem[];
}

const formato = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatearPrecio = (precio: number | null) =>
  precio === null ? 'Consultar' : formato.format(precio);
