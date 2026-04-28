import type { PyrionLayoutProps } from "prometeo-design-system/PyrionLayout";
import Home from "prometeo-design-system/Icons/Home";
import CheckList from "prometeo-design-system/Icons/CheckList";
import HistoryActivity from "prometeo-design-system/Icons/HistoryActivity";
import UserAdd from "prometeo-design-system/Icons/UserAdd";
import UserPerson from "prometeo-design-system/Icons/UserPerson";
import Boards from "prometeo-design-system/Icons/Boards";
import { Roles, type TipoRol } from "../../entities/roles/Role";

type LinkDef = NonNullable<PyrionLayoutProps<unknown, unknown>["links"]>[number];

export const buildLinks = (rol: TipoRol | undefined): LinkDef[] => {
  const all: Array<LinkDef & { roles: TipoRol[] }> = [
    { title: "Inicio", path: "/home", icon: Home, roles: [Roles.ADMIN, Roles.CONDUCTOR] },
    { title: "Rondas", path: "/rondas", icon: HistoryActivity, roles: [Roles.ADMIN] },
    { title: "Nueva ronda", path: "/rondas/nueva", icon: HistoryActivity, roles: [Roles.CONDUCTOR] },
    { title: "Vehículos", path: "/vehiculos", icon: Boards, roles: [Roles.ADMIN] },
    { title: "Conductores", path: "/conductores", icon: UserPerson, roles: [Roles.ADMIN] },
    { title: "Validaciones", path: "/validaciones", icon: CheckList, roles: [Roles.ADMIN] },
    { title: "Usuarios", path: "/usuarios", icon: UserAdd, roles: [Roles.ADMIN] },
  ];
  if (!rol) return all.map(({ roles, ...rest }) => { void roles; return rest; });
  return all
    .filter((l) => l.roles.includes(rol))
    .map(({ roles, ...rest }) => { void roles; return rest; });
};
