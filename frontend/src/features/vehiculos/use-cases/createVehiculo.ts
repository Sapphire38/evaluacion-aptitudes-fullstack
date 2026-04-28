import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IVehiculo } from "../../../entities/Vehiculo/Vehiculo";

export interface CreateVehiculoPayload {
  dominio: string;
  marca: string;
  modelo: string;
  tipo: string;
  anoFabricacion: number;
  kilometraje: number;
  responsable: { id: string; tipo: string };
  activo?: boolean;
}

export const createVehiculo = async (
  fetcher: HttpAdapter,
  payload: CreateVehiculoPayload
): Promise<IVehiculo> => {
  const res = await fetcher.post<IResponse<IVehiculo>>("/vehiculo", payload);
  return res.data!;
};
