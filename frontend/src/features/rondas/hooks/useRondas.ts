import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "../../../app/instances/axios.intance";
import {
  getRonda,
  listRondas,
  type ListRondasFilters,
} from "../use-cases/listRondas";
import {
  createRonda,
  getValidacionesParaVehiculo,
  type CreateRondaPayload,
} from "../use-cases/createRonda";

const KEY = "rondas";

export const useRondas = (filters: ListRondasFilters) => {
  const enabled = Boolean(
    filters.conductorId || filters.vehiculoId || filters.fecha
  );
  return useQuery({
    queryKey: [KEY, filters],
    queryFn: () => listRondas(fetcher, filters),
    enabled,
  });
};

export const useRonda = (id: string | undefined) => {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => getRonda(fetcher, id!),
    enabled: !!id,
  });
};

export const useValidacionesParaVehiculo = (vehiculoId: string | undefined) => {
  return useQuery({
    queryKey: ["validaciones-vehiculo", vehiculoId],
    queryFn: () => getValidacionesParaVehiculo(fetcher, vehiculoId!),
    enabled: !!vehiculoId,
  });
};

export const useCreateRonda = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRondaPayload) => createRonda(fetcher, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};
