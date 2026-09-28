import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './create-team.dto';
import { ListTeamsQueryDto } from './list-teams-query.dto';
import { UpdateTeamDto } from './update-team.dto';

interface UserContext {
  id: string;
  role: string;
}

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreateTeamDto) {
    return this.prisma.team.create({ data: { ...dto, ownerId } });
  }

  async findAll(user: UserContext, query: ListTeamsQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;

    // Usuário comum só vê os próprios times; ADMIN vê todos
    const where: Prisma.TeamWhereInput = { deletedAt: null };
    if (user.role !== 'ADMIN') where.ownerId = user.id;
    if (query.search) where.name = { contains: query.search, mode: 'insensitive' };

    const [total, data] = await Promise.all([
      this.prisma.team.count({ where }),
      this.prisma.team.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { data, meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) || 1 } };
  }

  async findById(user: UserContext, id: string) {
    const team = await this.prisma.team.findFirst({ where: { id, deletedAt: null } });
    if (!team) throw new NotFoundException('Time não encontrado.');
    if (user.role !== 'ADMIN' && team.ownerId !== user.id) {
      throw new ForbiddenException('Você não tem acesso a este time.');
    }
    return team;
  }

  async update(user: UserContext, id: string, dto: UpdateTeamDto) {
    await this.findById(user, id);
    return this.prisma.team.update({ where: { id }, data: dto });
  }

  async remove(user: UserContext, id: string) {
    await this.findById(user, id);
    // Remoção lógica
    await this.prisma.team.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
