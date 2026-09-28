import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { TeamsPage } from './teams-page';

vi.mock('../lib/api-client', () => ({
  teamsControllerFindAll: vi.fn().mockResolvedValue({
    data: {
      data: [{ id: 'team-1', name: 'Squad Plataforma', description: null, ownerId: 'u1' }],
      meta: { page: 1, pageSize: 50, total: 1, totalPages: 1 },
    },
  }),
  teamsControllerCreate: vi.fn(),
  teamsControllerRemove: vi.fn(),
}));

describe('TeamsPage', () => {
  it('mostra os times carregados', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <TeamsPage />
      </QueryClientProvider>,
    );

    expect(await screen.findByText('Squad Plataforma')).toBeInTheDocument();
  });
});
