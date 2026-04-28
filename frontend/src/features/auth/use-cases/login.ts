import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { UsuarioResponseDto } from "../../../entities/Usuario/Usuario";

export interface LoginCredentials {
  email: string;
  password: string;
}

export type UseCaseLoginResponse = IResponse<{ usuario: UsuarioResponseDto }>;
export type UseCaseLoginResult = UseCaseLoginResponse;

export const useCaseLogin = async (
  fetcher: HttpAdapter,
  credentials: LoginCredentials
): Promise<UseCaseLoginResult> => {
  const response = await fetcher.post<UseCaseLoginResponse>(
    "/auth/login",
    credentials
  );
  return response;
};
