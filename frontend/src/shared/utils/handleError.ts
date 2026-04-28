import { toast } from "sonner";
import type { AppError } from "../../entities/errors/IErrors";

export const handleError = (error: unknown, fallback: string = "Ocurrió un error inesperado") => {
  const err = error as AppError;
  const message = err?.message || fallback;
  toast.error(message);
  return err;
};
