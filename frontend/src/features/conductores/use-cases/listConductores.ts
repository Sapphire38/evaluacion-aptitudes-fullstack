import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IConductor } from "../../../entities/Conductor/Conductor";

export const listConductores = async (
  fetcher: HttpAdapter
): Promise<IConductor[]> => {
  const res = await fetcher.get<IResponse<IConductor[]>>("/conductor");
  return res.data ?? [];
};
