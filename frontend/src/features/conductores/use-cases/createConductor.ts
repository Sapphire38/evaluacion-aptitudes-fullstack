import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IConductor } from "../../../entities/Conductor/Conductor";

export interface CreateConductorPayload {
  nombreCompleto: string;
  dni: string;
  licenciaConducir: { categoria: string; fechaVencimiento: string };
  contacto?: { telefono?: string; email?: string };
  empresa: string;
  usuarioId: string;
}

export const createConductor = async (
  fetcher: HttpAdapter,
  payload: CreateConductorPayload
): Promise<IConductor> => {
  const res = await fetcher.post<IResponse<IConductor>>("/conductor", payload);
  return res.data!;
};
