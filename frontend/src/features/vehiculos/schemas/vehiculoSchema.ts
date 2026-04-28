import { z } from "zod";
import {
  TiposResponsable,
  TiposVehiculo,
} from "../../../entities/Vehiculo/Vehiculo";

const tipoVehiculoValues = Object.values(TiposVehiculo) as [string, ...string[]];
const tipoResponsableValues = Object.values(TiposResponsable) as [
  string,
  ...string[],
];

export const VehiculoSchema = z.object({
  dominio: z.string().min(1, "Dominio requerido"),
  marca: z.string().min(1, "Marca requerida"),
  modelo: z.string().min(1, "Modelo requerido"),
  tipo: z.enum(tipoVehiculoValues, "Tipo requerido"),
  anoFabricacion: z
    .number({ message: "Año requerido" })
    .min(1900, "Año inválido")
    .max(new Date().getFullYear() + 1, "Año inválido"),
  kilometraje: z.number({ message: "Kilometraje requerido" }).min(0, "Inválido"),
  responsableId: z.string().min(1, "Responsable requerido"),
  responsableTipo: z.enum(tipoResponsableValues, "Tipo de responsable requerido"),
});

export type VehiculoSchemaType = z.infer<typeof VehiculoSchema>;
