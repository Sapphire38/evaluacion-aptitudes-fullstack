import { Outlet, useNavigate } from "react-router";
import AuthWrapper from "../components/AuthWrapper";
import { Spinner } from "prometeo-design-system";
import PyrionLayout, { type PyrionLayoutProps } from "prometeo-design-system/PyrionLayout";
import Logout from "prometeo-design-system/Icons/Logout";
import { useUser } from "../../features/users/hooks/useUser";
import { useMemo } from "react";
import { buildLinks } from "./LayoutLinks";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Roles, type TipoRol } from "../../entities/roles/Role";
import { toast } from "sonner";

type AppMetadata = Record<string, never>;
type NotificationsMetadata = Record<string, never>;

const GenereciLayout = () => {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const { logoutUser } = useAuth();

  const rol = (usuario?.rol as TipoRol) ?? Roles.CONDUCTOR;
  const links = useMemo(() => buildLinks(usuario?.rol as TipoRol | undefined), [usuario]);

  const state: PyrionLayoutProps<AppMetadata, NotificationsMetadata>["state"] =
    useMemo(
      () => ({
        company: { name: "Selene Soluciones" },
        enabled_systems: [
          {
            _id: "evaluacion-aptitudes",
            name: "Evaluación Aptitudes",
            url: "/",
            thumbnail:
              "https://s3.altelabs.com/api/v1/buckets/alte-dev-public/objects/download?preview=true&prefix=logologistica.png&version_id=null",
            coverImage:
              "https://s3.altelabs.com/api/v1/buckets/alte-dev-public/objects/download?preview=true&prefix=logologistica.png&version_id=null",
          },
        ],
        user: { _id: usuario?.id ?? "", name: usuario?.nombreCompleto ?? "" },
      }),
      [usuario]
    );

  const handleLogout = () => {
    logoutUser();
    toast.success("Sesión cerrada");
    navigate("/", { replace: true });
  };

  const actions: PyrionLayoutProps<AppMetadata, NotificationsMetadata>["actions"] = [
    {
      id: "logout",
      title: "Cerrar sesión",
      icon: Logout,
      onClick: handleLogout,
    },
  ];

  return (
    <AuthWrapper
      fallbackFunction={() => navigate("/")}
      fallbackComponent={
        <div className="flex items-center justify-center w-screen h-screen">
          <Spinner />
        </div>
      }
    >
      <div className="bg-neutral-strong-default w-screen prometeo-fonts-body-medium h-dvh max-h-dvh overflow-hidden">
        <PyrionLayout<AppMetadata, NotificationsMetadata>
          currentSystemId="evaluacion-aptitudes"
          state={state}
          links={links}
          actions={actions}
          onLinkClick={(path) => navigate(path)}
          options={{
            userCardOptions: { secondarySlot: "company.name" },
          }}
        >
          <Outlet />
        </PyrionLayout>
        <span className="hidden">{rol}</span>
      </div>
    </AuthWrapper>
  );
};

export default GenereciLayout;
