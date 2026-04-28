import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../../app/instances/axios.intance";
import { listValidaciones } from "../use-cases/listValidaciones";
import {
  createValidacion,
  type CreateValidacionPayload,
} from "../use-cases/createValidacion";
import {
  updateValidacion,
  type UpdateValidacionPayload,
} from "../use-cases/updateValidacion";

const KEY = ["validaciones"];

export const useValidaciones = () => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => listValidaciones(fetcher),
  });

  const create = useMutation({
    mutationFn: (payload: CreateValidacionPayload) =>
      createValidacion(fetcher, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateValidacionPayload }) =>
      updateValidacion(fetcher, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    validaciones: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create,
    update,
  };
};
