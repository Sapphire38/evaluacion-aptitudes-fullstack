import type { HttpAdapter } from "../../../app/adapters/http.adapter";
import type { IResponse } from "../../../entities/response/IResponse";
import type { UsuarioResponseDto } from "../../../entities/Usuario/Usuario";

export interface RegisterUsuarioPayload {
  nombreCompleto: string;
  dni: string;
  rol: string;
  area: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUsuario = async (
  fetcher: HttpAdapter,
  payload: RegisterUsuarioPayload
): Promise<UsuarioResponseDto> => {
  const res = await fetcher.post<IResponse<UsuarioResponseDto>>(
    "/usuario",
    payload
  );
  return res.data!;
};
