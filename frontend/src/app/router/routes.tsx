import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Home from "../../pages/Home/Home";
import Login from "../../pages/Login/Login";
import GenereciLayout from "../../shared/layout/GenereciLayout";
import VehiculosPage from "../../pages/Vehiculos/VehiculosPage";
import ConductoresPage from "../../pages/Conductores/ConductoresPage";
import ValidacionesPage from "../../pages/Validaciones/ValidacionesPage";
import RondasPage from "../../pages/Rondas/RondasPage";
import NuevaRondaPage from "../../pages/Rondas/NuevaRondaPage";
import UsuariosPage from "../../pages/Usuarios/UsuariosPage";
import RoleGuard from "../../shared/components/RoleGuard";
import { Roles } from "../../entities/roles/Role";

export default function RoutesWrapper() {
  const router = createBrowserRouter([
    { path: "/", Component: Login },
    {
      Component: GenereciLayout,
      children: [
        { path: "/home", Component: Home },
        {
          path: "/vehiculos",
          element: (
            <RoleGuard allowed={[Roles.ADMIN]}>
              <VehiculosPage />
            </RoleGuard>
          ),
        },
        {
          path: "/conductores",
          element: (
            <RoleGuard allowed={[Roles.ADMIN]}>
              <ConductoresPage />
            </RoleGuard>
          ),
        },
        {
          path: "/validaciones",
          element: (
            <RoleGuard allowed={[Roles.ADMIN]}>
              <ValidacionesPage />
            </RoleGuard>
          ),
        },
        {
          path: "/rondas",
          element: (
            <RoleGuard allowed={[Roles.ADMIN]}>
              <RondasPage />
            </RoleGuard>
          ),
        },
        {
          path: "/rondas/nueva",
          element: (
            <RoleGuard allowed={[Roles.ADMIN, Roles.CONDUCTOR]}>
              <NuevaRondaPage />
            </RoleGuard>
          ),
        },
        {
          path: "/usuarios",
          element: (
            <RoleGuard allowed={[Roles.ADMIN]}>
              <UsuariosPage />
            </RoleGuard>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
