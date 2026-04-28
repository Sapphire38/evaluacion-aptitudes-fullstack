import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IValidacion } from "../../../entities/Validacion/Validacion";
import type { TipoVehiculo } from "../../../entities/Vehiculo/Vehiculo";

export type UpdateValidacionPayload = Partial<{
  nombre: string;
  activa: boolean;
  relevancia: number;
  obligatoria: boolean;
  tiposVehiculos: TipoVehiculo[];
}>;

export const updateValidacion = async (
  fetcher: HttpAdapter,
  id: string,
  payload: UpdateValidacionPayload
): Promise<IValidacion> => {
  const res = await fetcher.put<IResponse<IValidacion>>(
    `/validacion/${id}`,
    payload
  );
  return res.data!;
};
