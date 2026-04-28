import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IVehiculo } from "../../../entities/Vehiculo/Vehiculo";

export type UpdateVehiculoPayload = Partial<{
  dominio: string;
  marca: string;
  modelo: string;
  tipo: string;
  anoFabricacion: number;
  kilometraje: number;
  responsable: { id: string; tipo: string };
}>;

export const updateVehiculo = async (
  fetcher: HttpAdapter,
  id: string,
  payload: UpdateVehiculoPayload
): Promise<IVehiculo> => {
  const res = await fetcher.put<IResponse<IVehiculo>>(`/vehiculo/${id}`, payload);
  return res.data!;
};

export const deactivateVehiculo = async (
  fetcher: HttpAdapter,
  id: string
): Promise<void> => {
  await fetcher.patch<IResponse<{ id: string }>>(`/vehiculo/${id}/desactivar`);
};
