import { useDispatch } from "react-redux";
import authActions from "../../../app/providers/auth/authActions";
import { logout } from "../../../app/providers/auth/auth.Slice";
import type { AppDispatch } from "../../../app/store/store";
import type { LoginCredentials } from "../use-cases/login";
import { logoutUseCase } from "../use-cases/logout";

export const useAuth = () => {
  const dispatcher = useDispatch<AppDispatch>();

  const handleLogin = async (values: LoginCredentials) => {
    const result = await dispatcher(
      authActions.login({
        email: values.email,
        password: values.password,
      })
    ).unwrap();
    return {
      usuario: result.data!.usuario,
    };
  };

  const logoutUser = async (): Promise<boolean> => {
    try {
      const ok = await logoutUseCase();
      dispatcher(logout());
      return ok;
    } catch {
      dispatcher(logout());
      return false;
    }
  };


  return { handleLogin, logoutUser };

};
