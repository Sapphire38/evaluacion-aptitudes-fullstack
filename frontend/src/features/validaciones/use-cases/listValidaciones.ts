import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { IValidacion } from "../../../entities/Validacion/Validacion";

export const listValidaciones = async (
  fetcher: HttpAdapter
): Promise<IValidacion[]> => {
  const res = await fetcher.get<IResponse<IValidacion[]>>("/validacion");
  return res.data ?? [];
};
