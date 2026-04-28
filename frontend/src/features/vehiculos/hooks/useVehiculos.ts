import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../../app/instances/axios.intance";
import { listVehiculos } from "../use-cases/listVehiculos";
import {
  createVehiculo,
  type CreateVehiculoPayload,
} from "../use-cases/createVehiculo";
import {
  deactivateVehiculo,
  updateVehiculo,
  type UpdateVehiculoPayload,
} from "../use-cases/updateVehiculo";

const KEY = ["vehiculos"];

export const useVehiculos = () => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: KEY,
    queryFn: () => listVehiculos(fetcher),
  });

  const create = useMutation({
    mutationFn: (payload: CreateVehiculoPayload) =>
      createVehiculo(fetcher, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVehiculoPayload }) =>
      updateVehiculo(fetcher, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => deactivateVehiculo(fetcher, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });

  return {
    vehiculos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    create,
    update,
    deactivate,
  };
};
