import { useNavigate } from "react-router";
import {
  ListChecks,
  History,
  UserPlus,
  User,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useUser } from "../../features/users/hooks/useUser";
import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import type { TipoRol } from "../../entities/roles/Role";

interface Card {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  roles: TipoRol[];
}

const cards: Card[] = [
  {
    title: "Rondas",
    description: "Historial y registro de rondas",
    path: "/rondas",
    icon: History,
    roles: ["ADMIN"],
  },
  {
    title: "Nueva ronda",
    description: "Iniciar el registro de una ronda",
    path: "/rondas/nueva",
    icon: History,
    roles: ["ADMIN", "CONDUCTOR"],
  },
  {
    title: "Vehículos",
    description: "Administrar la flota",
    path: "/vehiculos",
    icon: Truck,
    roles: ["ADMIN"],
  },
  {
    title: "Conductores",
    description: "Gestionar conductores",
    path: "/conductores",
    icon: User,
    roles: ["ADMIN"],
  },
  {
    title: "Validaciones",
    description: "Configurar checkpoints",
    path: "/validaciones",
    icon: ListChecks,
    roles: ["ADMIN"],
  },
  {
    title: "Usuarios",
    description: "Registrar usuarios del sistema",
    path: "/usuarios",
    icon: UserPlus,
    roles: ["ADMIN"],
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { usuario } = useUser();
  const rol = (usuario?.rol as TipoRol) ?? "CONDUCTOR";
  const visible = cards.filter((c) => c.roles.includes(rol));

  return (
    <PageContainer>
      <PageHeader
        title={`Bienvenido, ${usuario?.nombreCompleto ?? ""}`}
        subtitle="Sistema de evaluación de aptitudes"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.path}
              onClick={() => navigate(c.path)}
              className="flex flex-col items-start gap-2 p-5 rounded-md border border-neutral-default-default bg-neutral-default-default hover:border-primary-default-default hover:bg-neutral-default-hover transition text-left"
            >
              <Icon size={28} className="text-primary-default-default" />
              <h2 className="prometeo-fonts-h4-bold">{c.title}</h2>
              <p className="prometeo-fonts-body-small text-neutral-medium-default">
                {c.description}
              </p>
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default Home;
