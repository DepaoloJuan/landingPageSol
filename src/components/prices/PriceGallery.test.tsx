import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Prices } from '../sections/Prices';
import { PriceGallery } from './PriceGallery';
import { WA_PHONE } from '../../lib/constants';
import { listaPublicada, mockPreciosFetch } from '../../test/precios';

const KAPPING_DESC = 'Baño de gel sobre la uña natural, dura hasta tres semanas.';
const LIFTING_DESC = 'Curvatura natural que dura entre seis y ocho semanas.';

// Opens the viewer the way a client does: tapping a service in the list
async function abrirServicio(nombre: RegExp) {
  const user = userEvent.setup();
  mockPreciosFetch({ body: listaPublicada });
  render(<Prices comoPagina />);
  await user.click(await screen.findByRole('button', { name: nombre }));
  const visor = screen.getByRole('dialog', { name: 'Fotos de los servicios' });
  return { user, visor };
}

// The service the viewer is showing, read from its "n / total" counter
function servicioActual(visor: HTMLElement) {
  const contador = within(visor).getByText(/^\d+ \/ \d+$/);
  const posicion = Number(contador.textContent!.split(' / ')[0]);
  return within(visor).getAllByRole('region')[posicion - 1];
}

describe('PriceGallery (photo viewer, S9)', () => {
  it('is closed until a service is tapped', async () => {
    mockPreciosFetch({ body: listaPublicada });
    render(<Prices comoPagina />);
    await screen.findByRole('button', { name: /Kapping/ });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens on the tapped service with its photos, price, counter and booking link', async () => {
    const { visor } = await abrirServicio(/Kapping/);

    expect(within(visor).getByText('1 / 3')).toBeInTheDocument();
    const actual = servicioActual(visor);
    expect(actual).toHaveAccessibleName('Kapping');
    expect(within(actual).getByText('Manos')).toBeInTheDocument();
    expect(within(actual).getByText(/^\$\s*15\.000$/)).toBeInTheDocument();
    expect(within(actual).getAllByRole('img').map(img => img.getAttribute('src'))).toEqual([
      'https://cdn.test/kapping-1.jpg',
      'https://cdn.test/kapping-2.jpg',
    ]);
    expect(within(actual).getByRole('img', { name: 'Kapping, foto 2' })).toBeInTheDocument();

    const reservar = within(actual).getByRole('link', { name: /Reservar/ });
    expect(reservar).toHaveAttribute(
      'href',
      `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hola Sol, me gustaría reservar un turno para Kapping.')}`,
    );
  });

  it('starts at the position of the tapped service in the list', async () => {
    const { visor } = await abrirServicio(/Lifting de pestañas/);

    expect(within(visor).getByText('3 / 3')).toBeInTheDocument();
    expect(servicioActual(visor)).toHaveAccessibleName('Lifting de pestañas');
    expect(within(visor).getByRole('button', { name: 'Servicio siguiente' })).toBeDisabled();
  });

  it('moves to the next and previous service with the arrows', async () => {
    const { user, visor } = await abrirServicio(/Kapping/);
    const anterior = within(visor).getByRole('button', { name: 'Servicio anterior' });
    const siguiente = within(visor).getByRole('button', { name: 'Servicio siguiente' });
    expect(anterior).toBeDisabled();

    await user.click(siguiente);
    expect(within(visor).getByText('2 / 3')).toBeInTheDocument();
    expect(servicioActual(visor)).toHaveAccessibleName('Esmaltado semipermanente');
    expect(anterior).toBeEnabled();

    await user.click(siguiente);
    expect(within(visor).getByText('3 / 3')).toBeInTheDocument();
    expect(siguiente).toBeDisabled();

    await user.click(anterior);
    expect(within(visor).getByText('2 / 3')).toBeInTheDocument();
  });

  it('moves between services with the keyboard arrows', async () => {
    const { user, visor } = await abrirServicio(/Kapping/);

    await user.keyboard('{ArrowDown}');
    expect(within(visor).getByText('2 / 3')).toBeInTheDocument();
    await user.keyboard('{ArrowUp}');
    expect(within(visor).getByText('1 / 3')).toBeInTheDocument();
  });

  it('only goes through the services of the selected tab', async () => {
    const user = userEvent.setup();
    mockPreciosFetch({ body: listaPublicada });
    render(<Prices comoPagina />);
    await user.click(await screen.findByRole('tab', { name: 'Pestañas' }));
    await user.click(await screen.findByRole('button', { name: /Lifting de pestañas/ }));

    const visor = screen.getByRole('dialog');
    expect(within(visor).getByText('1 / 1')).toBeInTheDocument();
    expect(within(visor).getAllByRole('region')).toHaveLength(1);
  });

  it('closes with the close button', async () => {
    const { user, visor } = await abrirServicio(/Kapping/);

    await user.click(within(visor).getByRole('button', { name: 'Cerrar' }));

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('closes with Escape', async () => {
    const { user } = await abrirServicio(/Kapping/);

    await user.keyboard('{Escape}');

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('closes when tapping outside the card but not when tapping the card', async () => {
    const { user, visor } = await abrirServicio(/Kapping/);
    const actual = servicioActual(visor);

    await user.click(within(actual).getByRole('heading', { name: 'Kapping' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(actual);
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('locks the page scroll while open and restores it on close', async () => {
    const { user, visor } = await abrirServicio(/Kapping/);
    expect(document.body.style.overflow).toBe('hidden');

    await user.click(within(visor).getByRole('button', { name: 'Cerrar' }));

    await expect.poll(() => document.body.style.overflow).toBe('');
  });

  describe('service description (S13)', () => {
    it('shows the full description of the current service', async () => {
      const { visor } = await abrirServicio(/Kapping/);

      expect(within(servicioActual(visor)).getByText(KAPPING_DESC)).toBeInTheDocument();
    });

    it('shows the description of the new current service after moving on', async () => {
      const { user, visor } = await abrirServicio(/Esmaltado semipermanente/);
      expect(within(visor).getByText('2 / 3')).toBeInTheDocument();
      expect(within(servicioActual(visor)).queryByText(KAPPING_DESC)).not.toBeInTheDocument();
      expect(within(servicioActual(visor)).queryByText(LIFTING_DESC)).not.toBeInTheDocument();

      await user.click(within(visor).getByRole('button', { name: 'Servicio siguiente' }));

      expect(within(visor).getByText('3 / 3')).toBeInTheDocument();
      expect(within(servicioActual(visor)).getByText(LIFTING_DESC)).toBeInTheDocument();
    });

    it('renders no description paragraph for a service without one', async () => {
      render(
        <PriceGallery
          servicios={[{ item: { id: 1, nombre: 'Soft gel', descripcion: null, precio: 20000, imagenes: ['a.jpg'] }, categoria: 'Uñas' }]}
          inicio={0}
          onCerrar={() => {}}
        />,
      );

      const tarjeta = screen.getByRole('region', { name: 'Soft gel' });
      // The category and the price are the only paragraphs: no description paragraph
      const textos = Array.from(tarjeta.querySelectorAll('p')).map(p => p.textContent);
      expect(textos).toHaveLength(2);
      expect(textos[0]).toBe('Uñas');
      expect(textos[1]).toMatch(/^\$\s*20\.000$/);
    });
  });
});
