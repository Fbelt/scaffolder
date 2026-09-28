import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/state-feedback';
import { teamsControllerCreate, teamsControllerFindAll, teamsControllerRemove } from '../lib/api-client';
import type { PaginatedTeamsResponseDto } from '../lib/api-client/models';

const formSchema = z.object({
  name: z.string().min(3, 'Mínimo de 3 caracteres.').max(100, 'Máximo de 100 caracteres.'),
});

type FormValues = z.infer<typeof formSchema>;

export function TeamsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await teamsControllerFindAll({ page: 1, pageSize: 50 });
      return res.data as PaginatedTeamsResponseDto;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '' },
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => teamsControllerCreate(values),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teamsControllerRemove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  });

  const teams = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Times</h1>

      <form onSubmit={handleSubmit((values) => createMutation.mutate(values))} className="flex gap-2 items-start">
        <Input placeholder="Nome do time" {...register('name')} error={errors.name?.message} />
        <Button type="submit" isLoading={createMutation.isPending}>Criar</Button>
      </form>

      {isLoading ? (
        <LoadingState message="Carregando times..." />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : teams.length === 0 ? (
        <EmptyState title="Nenhum time ainda" description="Crie seu primeiro time acima." />
      ) : (
        <div className="space-y-2">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <span>{team.name}</span>
                <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(team.id)}>
                  Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
