import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../../app/instances/axios.intance";
import { listConductores } from "../use-cases/listConductores";
import {
  createConductor,
  type CreateConductorPayload,
} from "../use-cases/createConductor";
import {
  deactivateConductor,
  updateConductor,
  type UpdateConductorPayload,
} from "../use-cases/updateConductor";

const KEY = ["conductores"];

export const useConductores = () => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => listConductores(fetcher),
  });

  const create = useMutation({
    mutationFn: (payload: CreateConductorPayload) =>
      createConductor(fetcher, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateConductorPayload }) =>
      updateConductor(fetcher, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => deactivateConductor(fetcher, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    conductores: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
    deactivate,
  };
};
