import { useImperativeHandle, useRef, type Ref } from "react";
import DialogModal, { useDialogControl } from "prometeo-design-system/DialogModal";
import { Button, Input } from "prometeo-design-system";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import type { IConductor } from "../../../entities/Conductor/Conductor";
import { useConductores } from "../hooks/useConductores";
import {
  ConductorSchema,
  type ConductorSchemaType,
} from "../schemas/conductorSchema";
import { handleError } from "../../../shared/utils/handleError";

export interface ConductorFormDialogHandle {
  openCreate: () => void;
  openEdit: (c: IConductor) => void;
  close: () => void;
}

const empty: ConductorSchemaType = {
  nombreCompleto: "",
  dni: "",
  licenciaCategoria: "",
  licenciaFechaVencimiento: "",
  empresa: "",
  usuarioId: "",
  telefono: "",
  email: "",
};

interface Props {
  ref?: Ref<ConductorFormDialogHandle>;
}

const ConductorFormDialog = ({ ref }: Props) => {
  const dialog = useDialogControl<IConductor | null>();
  const { create, update } = useConductores();
  const editingRef = useRef<IConductor | null>(null);

  const form = useForm({
    defaultValues: empty,
    onSubmit: async ({ value }) => {
      const parsed = ConductorSchema.safeParse(value);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
        return;
      }
      const contacto =
        value.telefono || value.email
          ? { telefono: value.telefono || undefined, email: value.email || undefined }
          : undefined;
      try {
        if (editingRef.current) {
          await update.mutateAsync({
            id: editingRef.current.id,
            payload: {
              nombreCompleto: value.nombreCompleto,
              dni: value.dni,
              licenciaConducir: {
                categoria: value.licenciaCategoria,
                fechaVencimiento: value.licenciaFechaVencimiento,
              },
              empresa: value.empresa,
              contacto,
            },
          });
          toast.success("Conductor actualizado");
        } else {
          await create.mutateAsync({
            nombreCompleto: value.nombreCompleto,
            dni: value.dni,
            licenciaConducir: {
              categoria: value.licenciaCategoria,
              fechaVencimiento: value.licenciaFechaVencimiento,
            },
            empresa: value.empresa,
            usuarioId: value.usuarioId,
            contacto,
          });
          toast.success("Conductor creado");
        }
        dialog.close();
      } catch (e) {
        handleError(e);
      }
    },
  });

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      editingRef.current = null;
      form.reset(empty);
      dialog.open(null);
    },
    openEdit: (c: IConductor) => {
      editingRef.current = c;
      form.reset({
        nombreCompleto: c.nombreCompleto,
        dni: c.dni,
        licenciaCategoria: c.licenciaConducir.categoria,
        licenciaFechaVencimiento: c.licenciaConducir.fechaVencimiento.slice(0, 10),
        empresa: c.empresa,
        usuarioId: c.usuarioId,
        telefono: c.contacto?.telefono ?? "",
        email: c.contacto?.email ?? "",
      });
      dialog.open(c);
    },
    close: dialog.close,
  }));

  return (
    <DialogModal ref={dialog.ref} size="medium">
      {(ctx) => (
        <>
          <DialogModal.Header
            title={ctx ? "Editar conductor" : "Crear conductor"}
          />
          <DialogModal.Content>
            <form
              id="conductor-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="grid grid-cols-2 gap-4"
            >
              <form.Field name="nombreCompleto">
                {(f) => (
                  <Input
                    label="Nombre completo"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="dni">
                {(f) => (
                  <Input
                    label="DNI"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="licenciaCategoria">
                {(f) => (
                  <Input
                    label="Categoría licencia"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="licenciaFechaVencimiento">
                {(f) => (
                  <Input
                    label="Vencimiento licencia"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="empresa">
                {(f) => (
                  <Input
                    label="Empresa"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="usuarioId">
                {(f) => (
                  <Input
                    label="ID usuario asociado"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    disabled={!!ctx}
                  />
                )}
              </form.Field>
              <form.Field name="telefono">
                {(f) => (
                  <Input
                    label="Teléfono (opcional)"
                    value={f.state.value ?? ""}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="email">
                {(f) => (
                  <Input
                    label="Email (opcional)"
                    type="email"
                    value={f.state.value ?? ""}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
            </form>
          </DialogModal.Content>
          <DialogModal.Footer>
            <div className="flex justify-end gap-2">
              <Button
                label="Cancelar"
                variant="ghost"
                onClick={() => dialog.close()}
              />
              <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    form="conductor-form"
                    label={ctx ? "Guardar" : "Crear"}
                    disabled={!canSubmit}
                    isLoading={isSubmitting}
                  />
                )}
              </form.Subscribe>
            </div>
          </DialogModal.Footer>
        </>
      )}
    </DialogModal>
  );
};

export default ConductorFormDialog;
