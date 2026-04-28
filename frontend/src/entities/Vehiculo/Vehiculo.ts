export const TiposVehiculo = {
  CAMION: "Camion",
  AUTO: "Auto",
  MOTO: "Moto",
} as const;

export type TipoVehiculo = (typeof TiposVehiculo)[keyof typeof TiposVehiculo];

export const TiposResponsable = {
  USUARIO: "Usuario",
  AREA: "Area",
} as const;

export type TipoResponsable =
  (typeof TiposResponsable)[keyof typeof TiposResponsable];

export interface ResponsableVehiculo {
  id: string;
  tipo: TipoResponsable;
}

export interface IVehiculo {
  id: string;
  dominio: string;
  marca: string;
  modelo: string;
  tipo: TipoVehiculo;
  anoFabricacion: number;
  kilometraje: number;
  responsable: ResponsableVehiculo;
  activo: boolean;
  createdAt?: string;
}
