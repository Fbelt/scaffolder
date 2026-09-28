-- Migration: 20260928_teams_module
-- Description: Módulo Teams com ownership, nome único por proprietário e soft delete (remoção lógica)

-- Consulta 001: Criação da tabela teams
CREATE TABLE "teams" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" UUID NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- Consulta 002: Índices para consultas por dono e soft delete
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");
CREATE INDEX "teams_deletedAt_idx" ON "teams"("deletedAt");

-- Consulta 003: Foreign key para o perfil do usuário
ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
