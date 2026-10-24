import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { listaPublicada, mockPreciosFetch } from '../test/precios';

// Smooth scrolling needs a real browser; the page only has to start and stop it
vi.mock('lenis', () => ({
  default: class {
    raf() {}
    destroy() {}
  },
}));

describe('/precios route (S9)', () => {
  it('renders the price list page with header and footer', async () => {
    mockPreciosFetch({ body: listaPublicada });
    render(
      <MemoryRouter initialEntries={['/precios']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 2, name: /Lista de\s*Precios\./ })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Kapping/ })).toBeInTheDocument();
    expect(screen.getAllByRole('banner').length).toBeGreaterThan(0);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('sets the page title while open and restores it when leaving', async () => {
    mockPreciosFetch({ body: listaPublicada });
    document.title = 'Sol Cantero';
    const { unmount } = render(
      <MemoryRouter initialEntries={['/precios']}>
        <App />
      </MemoryRouter>,
    );

    expect(document.title).toBe('Lista de precios · Sol Cantero');
    await screen.findByRole('button', { name: /Kapping/ });
    unmount();
    expect(document.title).toBe('Sol Cantero');
  });

  it('shows the "updating" notice on its own page when nothing is published', async () => {
    mockPreciosFetch({ body: [] });
    render(
      <MemoryRouter initialEntries={['/precios']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Estamos actualizando la lista.')).toBeInTheDocument();
  });
});
