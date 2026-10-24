import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Prices } from './Prices';
import { API_URL, WA_PHONE } from '../../lib/constants';
import { listaPublicada, mockPreciosFetch } from '../../test/precios';

const servicio = (nombre: string | RegExp) => screen.findByRole('button', { name: nombre });

describe('Prices (landing price list, S9)', () => {
  it('requests the published list from the public API', async () => {
    const fetchMock = mockPreciosFetch({ body: listaPublicada });
    render(<Prices comoPagina />);

    await servicio(/Kapping/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/api/landing/precios`, {
      signal: expect.any(AbortSignal),
    });
  });

  it('cancels the request when the section unmounts before the answer arrives', () => {
    let senal: AbortSignal | undefined;
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init?: RequestInit) => {
        senal = init?.signal ?? undefined;
        return new Promise(() => {});
      }),
    );
    const { unmount } = render(<Prices comoPagina />);

    expect(senal?.aborted).toBe(false);
    unmount();
    expect(senal?.aborted).toBe(true);
  });

  it('renders every category with its services and formatted prices', async () => {
    mockPreciosFetch({ body: listaPublicada });
    render(<Prices comoPagina />);

    expect(await screen.findByRole('heading', { level: 3, name: 'Manos' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Pestañas' })).toBeInTheDocument();
    expect(screen.getByText('2 servicios')).toBeInTheDocument();
    expect(screen.getByText('1 servicio')).toBeInTheDocument();

    const kapping = screen.getByRole('button', { name: /Kapping/ });
    expect(within(kapping).getByText(/^\$\s*15\.000$/)).toBeInTheDocument();
    expect(within(kapping).getByText('Ver 2 fotos')).toBeInTheDocument();

    const semi = screen.getByRole('button', { name: /Esmaltado semipermanente/ });
    expect(within(semi).getByText(/^\$\s*9\.500,5$/)).toBeInTheDocument();
    expect(within(semi).getByText('Ver foto')).toBeInTheDocument();

    // A service without a price asks the client to get in touch
    const lifting = screen.getByRole('button', { name: /Lifting de pestañas/ });
    expect(within(lifting).getByText('Consultar')).toBeInTheDocument();
  });

  it('does not list categories that have no services', async () => {
    mockPreciosFetch({ body: [...listaPublicada, { id: 3, nombre: 'Depilación', items: [] }] });
    render(<Prices comoPagina />);

    await servicio(/Kapping/);
    expect(screen.queryByRole('tab', { name: 'Depilación' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Depilación' })).not.toBeInTheDocument();
  });

  it('shows "Todos los servicios" as the first, selected tab followed by one tab per category', async () => {
    mockPreciosFetch({ body: listaPublicada });
    render(<Prices comoPagina />);

    await servicio(/Kapping/);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map(t => t.textContent)).toEqual(['Todos los servicios', 'Manos', 'Pestañas']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('shows only the chosen category when switching tabs, and everything again on "Todos los servicios"', async () => {
    const user = userEvent.setup();
    mockPreciosFetch({ body: listaPublicada });
    render(<Prices comoPagina />);
    await servicio(/Kapping/);

    await user.click(screen.getByRole('tab', { name: 'Pestañas' }));

    expect(await servicio(/Lifting de pestañas/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Kapping/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: 'Manos' })).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Pestañas' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Todos los servicios' })).toHaveAttribute('aria-selected', 'false');

    await user.click(screen.getByRole('tab', { name: 'Todos los servicios' }));

    expect(await servicio(/Kapping/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Lifting de pestañas/ })).toBeInTheDocument();
  });

  describe('when nothing can be shown', () => {
    const avisoActualizando = async () => {
      expect(await screen.findByText('Estamos actualizando la lista.')).toBeInTheDocument();
      const whatsapp = screen.getByRole('link', { name: /Consultar por WhatsApp/ });
      expect(whatsapp.getAttribute('href')).toMatch(new RegExp(`^https://wa\\.me/${WA_PHONE}\\?text=`));
      // No fallback prices are invented
      expect(screen.queryAllByRole('tab')).toHaveLength(0);
      expect(screen.queryByText(/\$\s*\d/)).not.toBeInTheDocument();
    };

    it('shows the "updating" notice with WhatsApp when the published list is empty', async () => {
      mockPreciosFetch({ body: [] });
      render(<Prices comoPagina />);
      await avisoActualizando();
    });

    it('shows the same notice when the API request fails', async () => {
      mockPreciosFetch({ error: new TypeError('Failed to fetch') });
      render(<Prices comoPagina />);
      await avisoActualizando();
    });

    it('shows the same notice when the API answers with an error status', async () => {
      mockPreciosFetch({ ok: false, body: { error: 'boom' } });
      render(<Prices comoPagina />);
      await avisoActualizando();
    });

    it('hides the whole section when used inside another page', async () => {
      const fetchMock = mockPreciosFetch({ body: [] });
      const { container } = render(<Prices />);

      await expect.poll(() => fetchMock.mock.results.length).toBe(1);
      await expect.poll(() => container.querySelector('#precios')).toBeNull();
      expect(screen.queryByText('Estamos actualizando la lista.')).not.toBeInTheDocument();
    });
  });

  describe('service description (S13)', () => {
    it('shows the description under the service name in the list', async () => {
      mockPreciosFetch({ body: listaPublicada });
      render(<Prices comoPagina />);

      const kapping = await servicio(/Kapping/);
      expect(within(kapping).getByText('Baño de gel sobre la uña natural, dura hasta tres semanas.')).toBeInTheDocument();
    });

    it('renders no description line for a service whose description is null', async () => {
      mockPreciosFetch({ body: listaPublicada });
      render(<Prices comoPagina />);

      const semi = await servicio(/Esmaltado semipermanente/);
      // Only the name, the photo hint and the price: nothing in between
      expect(semi).toHaveAccessibleName(/^Esmaltado semipermanente\s*Ver foto\s*\$\s*9\.500,5$/);
    });

    it('renders no description line when an older snapshot has no description field', async () => {
      const sinCampo = [{ id: 9, nombre: 'Uñas', items: [{ id: 91, nombre: 'Soft gel', precio: 20000, imagenes: ['a.jpg'] }] }];
      mockPreciosFetch({ body: sinCampo });
      render(<Prices comoPagina />);

      const softGel = await servicio(/Soft gel/);
      expect(softGel).toHaveAccessibleName(/^Soft gel\s*Ver foto\s*\$\s*20\.000$/);
    });
  });
});
