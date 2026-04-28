import { useImperativeHandle, useState, type Ref } from "react";
import DialogModal, { useDialogControl } from "prometeo-design-system/DialogModal";
import { Button, Input } from "prometeo-design-system";
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
  const [editing, setEditing] = useState<IConductor | null>(null);
  const [values, setValues] = useState<ConductorSchemaType>(empty);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof ConductorSchemaType>(k: K, v: ConductorSchemaType[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setEditing(null);
      setValues(empty);
      dialog.open(null);
    },
    openEdit: (c: IConductor) => {
      setEditing(c);
      setValues({
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = ConductorSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    const contacto =
      values.telefono || values.email
        ? { telefono: values.telefono || undefined, email: values.email || undefined }
        : undefined;
    setSubmitting(true);
    try {
      if (editing) {
        await update.mutateAsync({
          id: editing.id,
          payload: {
            nombreCompleto: values.nombreCompleto,
            dni: values.dni,
            licenciaConducir: {
              categoria: values.licenciaCategoria,
              fechaVencimiento: values.licenciaFechaVencimiento,
            },
            empresa: values.empresa,
            contacto,
          },
        });
        toast.success("Conductor actualizado");
      } else {
        await create.mutateAsync({
          nombreCompleto: values.nombreCompleto,
          dni: values.dni,
          licenciaConducir: {
            categoria: values.licenciaCategoria,
            fechaVencimiento: values.licenciaFechaVencimiento,
          },
          empresa: values.empresa,
          usuarioId: values.usuarioId,
          contacto,
        });
        toast.success("Conductor creado");
      }
      dialog.close();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogModal
      ref={dialog.ref}
      size="medium"
      title={editing ? "Editar conductor" : "Crear conductor"}
    >
      <DialogModal.Content>
        <form id="conductor-form" onSubmit={submit} className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre completo"
            value={values.nombreCompleto}
            onChange={(e) => set("nombreCompleto", e.target.value)}
          />
          <Input label="DNI" value={values.dni} onChange={(e) => set("dni", e.target.value)} />
          <Input
            label="Categoría licencia"
            value={values.licenciaCategoria}
            onChange={(e) => set("licenciaCategoria", e.target.value)}
          />
          <Input
            label="Vencimiento (YYYY-MM-DD)"
            value={values.licenciaFechaVencimiento}
            onChange={(e) => set("licenciaFechaVencimiento", e.target.value)}
          />
          <Input
            label="Empresa"
            value={values.empresa}
            onChange={(e) => set("empresa", e.target.value)}
          />
          <Input
            label="ID usuario asociado"
            value={values.usuarioId}
            onChange={(e) => set("usuarioId", e.target.value)}
            disabled={!!editing}
          />
          <Input
            label="Teléfono (opcional)"
            value={values.telefono ?? ""}
            onChange={(e) => set("telefono", e.target.value)}
          />
          <Input
            label="Email (opcional)"
            type="email"
            value={values.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
          />
        </form>
      </DialogModal.Content>
      <DialogModal.Footer>
        <div className="flex justify-end gap-2">
          <Button label="Cancelar" variant="ghost" onClick={() => dialog.close()} />
          <Button
            type="submit"
            form="conductor-form"
            label={editing ? "Guardar" : "Crear"}
            isLoading={submitting}
          />
        </div>
      </DialogModal.Footer>
    </DialogModal>
  );
};

export default ConductorFormDialog;
