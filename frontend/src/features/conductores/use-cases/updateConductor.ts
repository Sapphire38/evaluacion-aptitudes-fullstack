import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IConductor } from "../../../entities/Conductor/Conductor";

export type UpdateConductorPayload = Partial<{
  nombreCompleto: string;
  dni: string;
  licenciaConducir: { categoria: string; fechaVencimiento: string };
  contacto: { telefono?: string; email?: string };
  empresa: string;
}>;

export const updateConductor = async (
  fetcher: HttpAdapter,
  id: string,
  payload: UpdateConductorPayload
): Promise<IConductor> => {
  const res = await fetcher.put<IResponse<IConductor>>(`/conductor/${id}`, payload);
  return res.data!;
};

export const deactivateConductor = async (
  fetcher: HttpAdapter,
  id: string
): Promise<void> => {
  await fetcher.patch<IResponse<unknown>>(`/conductor/${id}/desactivar`);
};
