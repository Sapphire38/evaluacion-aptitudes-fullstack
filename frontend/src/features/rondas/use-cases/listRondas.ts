import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IRonda } from "../../../entities/Ronda/Ronda";

export interface ListRondasFilters {
  conductorId?: string;
  vehiculoId?: string;
  fecha?: string;
}

export const listRondas = async (
  fetcher: HttpAdapter,
  filters: ListRondasFilters
): Promise<IRonda[]> => {
  const res = await fetcher.get<IResponse<IRonda[]>>("/ronda", {
    params: filters,
  });
  return res.data ?? [];
};

export const getRonda = async (
  fetcher: HttpAdapter,
  id: string
): Promise<IRonda> => {
  const res = await fetcher.get<IResponse<IRonda>>(`/ronda/${id}`);
  return res.data!;
};
