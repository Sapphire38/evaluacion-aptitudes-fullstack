import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IVehiculo } from "../../../entities/Vehiculo/Vehiculo";

export const listVehiculos = async (
  fetcher: HttpAdapter
): Promise<IVehiculo[]> => {
  const res = await fetcher.get<IResponse<IVehiculo[]>>("/vehiculo");
  return res.data ?? [];
};
