import { fetcher } from "../../../app/instances/axios.intance";
import type { IResponse } from "../../../entities/response/IResponse";

export const logoutUseCase = async (): Promise<boolean> => {
  try {
    await fetcher.post<IResponse<unknown>>("/auth/logout");
    return true;
  } catch {
    return false;
  }
};
