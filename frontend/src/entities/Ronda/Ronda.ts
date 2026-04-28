export const EstadosRonda = {
  APTA: "APTA",
  NO_APTA: "NO_APTA",
} as const;

export type EstadoRonda = (typeof EstadosRonda)[keyof typeof EstadosRonda];

export interface ItemValidacionRonda {
  validacionId: string;
  nombre: string;
  relevancia: number;
  obligatoria: boolean;
  cumplida: boolean;
  observaciones?: string;
}

export interface IRonda {
  id: string;
  fechaHora: string;
  kilometraje: number;
  vehiculoId: string;
  conductorId: string;
  observaciones?: string;
  validaciones: ItemValidacionRonda[];
  cumplimiento: number;
  estado: EstadoRonda;
  firmaDigital: string;
  createdAt?: string;
}
