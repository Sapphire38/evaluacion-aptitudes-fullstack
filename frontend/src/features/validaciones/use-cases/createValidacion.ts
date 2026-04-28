import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IValidacion } from "../../../entities/Validacion/Validacion";
import type { TipoVehiculo } from "../../../entities/Vehiculo/Vehiculo";

export interface CreateValidacionPayload {
  nombre: string;
  activa?: boolean;
  relevancia: number;
  obligatoria: boolean;
  tiposVehiculos: TipoVehiculo[];
}

export const createValidacion = async (
  fetcher: HttpAdapter,
  payload: CreateValidacionPayload
): Promise<IValidacion> => {
  const res = await fetcher.post<IResponse<IValidacion>>("/validacion", payload);
  return res.data!;
};
