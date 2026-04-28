import type { TipoVehiculo } from "../Vehiculo/Vehiculo";

export interface IValidacion {
  id: string;
  nombre: string;
  activa: boolean;
  relevancia: number;
  obligatoria: boolean;
  tiposVehiculos: TipoVehiculo[];
  createdAt?: string;
}
