export const EstadosConductor = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
} as const;

export type EstadoConductor =
  (typeof EstadosConductor)[keyof typeof EstadosConductor];

export interface LicenciaConducir {
  categoria: string;
  fechaVencimiento: string;
}

export interface ContactoConductor {
  telefono?: string;
  email?: string;
}

export interface IConductor {
  id: string;
  nombreCompleto: string;
  dni: string;
  licenciaConducir: LicenciaConducir;
  contacto?: ContactoConductor;
  empresa: string;
  estado: EstadoConductor;
  usuarioId: string;
  createdAt?: string;
}
