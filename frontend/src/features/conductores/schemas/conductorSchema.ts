import { z } from "zod";

export const ConductorSchema = z.object({
  nombreCompleto: z.string().min(1, "Nombre requerido"),
  dni: z.string().min(7, "DNI inválido").max(8, "DNI inválido"),
  licenciaCategoria: z.string().min(1, "Categoría requerida"),
  licenciaFechaVencimiento: z.string().min(1, "Fecha requerida"),
  empresa: z.string().min(1, "Empresa requerida"),
  usuarioId: z.string().min(1, "Usuario requerido"),
  telefono: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /\S+@\S+\.\S+/.test(v), "Email inválido"),
});

export type ConductorSchemaType = z.infer<typeof ConductorSchema>;
