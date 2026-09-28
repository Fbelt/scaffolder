import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TeamsService } from './teams.service';

describe('TeamsService', () => {
  const user = { id: 'user-1', role: 'USER' };
  const outro = { id: 'user-2', role: 'USER' };
  const admin = { id: 'admin-1', role: 'ADMIN' };
  const team = { id: 'team-1', name: 'Squad', ownerId: 'user-1', deletedAt: null };

  let prisma: any;
  let service: TeamsService;

  beforeEach(() => {
    prisma = {
      team: { create: vi.fn(), findMany: vi.fn(), findFirst: vi.fn(), count: vi.fn(), update: vi.fn() },
    };
    service = new TeamsService(prisma);
  });

  it('cria o time com o usuário como dono', async () => {
    prisma.team.create.mockResolvedValue(team);
    await service.create(user.id, { name: 'Squad' });
    expect(prisma.team.create).toHaveBeenCalledWith({ data: { name: 'Squad', ownerId: 'user-1' } });
  });

  it('usuário comum só lista os próprios times', async () => {
    prisma.team.count.mockResolvedValue(1);
    prisma.team.findMany.mockResolvedValue([team]);
    await service.findAll(user, {});
    expect(prisma.team.findMany.mock.calls[0][0].where).toEqual({ deletedAt: null, ownerId: 'user-1' });
  });

  it('admin lista times de todos', async () => {
    prisma.team.count.mockResolvedValue(1);
    prisma.team.findMany.mockResolvedValue([team]);
    await service.findAll(admin, {});
    expect(prisma.team.findMany.mock.calls[0][0].where).toEqual({ deletedAt: null });
  });

  it('bloqueia acesso ao time de outro usuário', async () => {
    prisma.team.findFirst.mockResolvedValue(team);
    await expect(service.findById(outro, 'team-1')).rejects.toThrow(ForbiddenException);
  });

  it('retorna 404 se o time não existe', async () => {
    prisma.team.findFirst.mockResolvedValue(null);
    await expect(service.findById(user, 'x')).rejects.toThrow(NotFoundException);
  });

  it('remove com soft delete', async () => {
    prisma.team.findFirst.mockResolvedValue(team);
    await service.remove(user, 'team-1');
    expect(prisma.team.update).toHaveBeenCalledWith({
      where: { id: 'team-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});
