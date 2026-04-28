import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IRonda } from "../../../entities/Ronda/Ronda";
import type { IValidacion } from "../../../entities/Validacion/Validacion";

export interface CreateRondaPayload {
  vehiculoId: string;
  conductorId: string;
  kilometraje: number;
  observaciones?: string;
  firmaDigital: string;
  validaciones: Array<{
    validacionId: string;
    cumplida: boolean;
    observaciones?: string;
  }>;
}

export const createRonda = async (
  fetcher: HttpAdapter,
  payload: CreateRondaPayload
): Promise<IRonda> => {
  const res = await fetcher.post<IResponse<IRonda>>("/ronda", payload);
  return res.data!;
};

export const getValidacionesParaVehiculo = async (
  fetcher: HttpAdapter,
  vehiculoId: string
): Promise<IValidacion[]> => {
  const res = await fetcher.get<IResponse<IValidacion[]>>(
    `/ronda/validaciones/${vehiculoId}`
  );
  return res.data ?? [];
};
