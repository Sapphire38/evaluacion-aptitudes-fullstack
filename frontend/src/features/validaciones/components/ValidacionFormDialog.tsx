import { useImperativeHandle, useState, type Ref } from "react";
import DialogModal, { useDialogControl } from "prometeo-design-system/DialogModal";
import { Button, CheckBox, Input } from "prometeo-design-system";
import { toast } from "sonner";
import {
  TiposVehiculo,
  type TipoVehiculo,
} from "../../../entities/Vehiculo/Vehiculo";
import type { IValidacion } from "../../../entities/Validacion/Validacion";
import { useValidaciones } from "../hooks/useValidaciones";
import { handleError } from "../../../shared/utils/handleError";

export interface ValidacionFormDialogHandle {
  openCreate: () => void;
  openEdit: (v: IValidacion) => void;
  close: () => void;
}

interface FormValues {
  nombre: string;
  relevancia: number;
  obligatoria: boolean;
  activa: boolean;
  tiposVehiculos: TipoVehiculo[];
}

const empty: FormValues = {
  nombre: "",
  relevancia: 0,
  obligatoria: false,
  activa: true,
  tiposVehiculos: [],
};

interface Props {
  ref?: Ref<ValidacionFormDialogHandle>;
}

const ValidacionFormDialog = ({ ref }: Props) => {
  const dialog = useDialogControl<IValidacion | null>();
  const { create, update } = useValidaciones();
  const [editing, setEditing] = useState<IValidacion | null>(null);
  const [values, setValues] = useState<FormValues>(empty);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormValues>(k: K, v: FormValues[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setEditing(null);
      setValues(empty);
      dialog.open(null);
    },
    openEdit: (v: IValidacion) => {
      setEditing(v);
      setValues({
        nombre: v.nombre,
        relevancia: v.relevancia,
        obligatoria: v.obligatoria,
        activa: v.activa,
        tiposVehiculos: v.tiposVehiculos,
      });
      dialog.open(v);
    },
    close: dialog.close,
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.nombre) return toast.error("Nombre requerido");
    if (values.relevancia < 0 || values.relevancia > 100)
      return toast.error("Relevancia 0–100");
    if (!values.tiposVehiculos.length)
      return toast.error("Seleccioná al menos un tipo de vehículo");
    setSubmitting(true);
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload: values });
        toast.success("Validación actualizada");
      } else {
        await create.mutateAsync(values);
        toast.success("Validación creada");
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
      title={editing ? "Editar validación" : "Crear validación"}
    >
      <DialogModal.Content>
        <form id="validacion-form" onSubmit={submit} className="flex flex-col gap-4">
          <Input
            label="Nombre"
            value={values.nombre}
            onChange={(e) => set("nombre", e.target.value)}
          />
          <Input
            label="Relevancia (0-100)"
            type="number"
            value={String(values.relevancia)}
            onChange={(e) => set("relevancia", Number(e.target.value))}
          />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <CheckBox
                checked={values.obligatoria}
                onChange={(e) => set("obligatoria", e.target.checked)}
              />
              <span>Obligatoria</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <CheckBox
                checked={values.activa}
                onChange={(e) => set("activa", e.target.checked)}
              />
              <span>Activa</span>
            </label>
          </div>
          <div>
            <span className="prometeo-fonts-body-small mb-2 block">
              Tipos de vehículo
            </span>
            <div className="flex gap-4">
              {Object.values(TiposVehiculo).map((tipo) => {
                const checked = values.tiposVehiculos.includes(tipo);
                return (
                  <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                    <CheckBox
                      checked={checked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          set("tiposVehiculos", [...values.tiposVehiculos, tipo]);
                        } else {
                          set(
                            "tiposVehiculos",
                            values.tiposVehiculos.filter((t) => t !== tipo)
                          );
                        }
                      }}
                    />
                    <span>{tipo}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </form>
      </DialogModal.Content>
      <DialogModal.Footer>
        <div className="flex justify-end gap-2">
          <Button label="Cancelar" variant="ghost" onClick={() => dialog.close()} />
          <Button
            type="submit"
            form="validacion-form"
            label={editing ? "Guardar" : "Crear"}
            isLoading={submitting}
          />
        </div>
      </DialogModal.Footer>
    </DialogModal>
  );
};

export default ValidacionFormDialog;
