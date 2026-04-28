import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useUser } from "../../features/users/hooks/useUser";
import { Roles, type TipoRol } from "../../entities/roles/Role";

interface Props {
  allowed: TipoRol[];
  fallback?: string;
  children: ReactNode;
}

const RoleGuard = ({ allowed, fallback = "/home", children }: Props) => {
  const { usuario, loading } = useUser();
  if (loading) return null;
  if (!usuario) return <Navigate to="/" replace />;
  const rol = (usuario.rol as TipoRol) ?? Roles.CONDUCTOR;
  if (!allowed.includes(rol)) return <Navigate to={fallback} replace />;
  return <>{children}</>;
};

export default RoleGuard;
