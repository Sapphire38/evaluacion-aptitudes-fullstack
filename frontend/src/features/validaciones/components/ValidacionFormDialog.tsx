import { useImperativeHandle, useRef, type Ref } from "react";
import DialogModal, { useDialogControl } from "prometeo-design-system/DialogModal";
import { Button, CheckBox, Input } from "prometeo-design-system";
import { useForm } from "@tanstack/react-form";
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
  const editingRef = useRef<IValidacion | null>(null);

  const form = useForm({
    defaultValues: empty,
    onSubmit: async ({ value }) => {
      if (!value.nombre) return toast.error("Nombre requerido");
      if (value.relevancia < 0 || value.relevancia > 100)
        return toast.error("Relevancia 0–100");
      if (!value.tiposVehiculos.length)
        return toast.error("Seleccioná al menos un tipo de vehículo");
      try {
        if (editingRef.current) {
          await update.mutateAsync({
            id: editingRef.current.id,
            payload: value,
          });
          toast.success("Validación actualizada");
        } else {
          await create.mutateAsync(value);
          toast.success("Validación creada");
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
    openEdit: (v: IValidacion) => {
      editingRef.current = v;
      form.reset({
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

  return (
    <DialogModal ref={dialog.ref} size="medium">
      {(ctx) => (
        <>
          <DialogModal.Header
            title={ctx ? "Editar validación" : "Crear validación"}
          />
          <DialogModal.Content>
            <form
              id="validacion-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <form.Field name="nombre">
                {(f) => (
                  <Input
                    label="Nombre"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                  />
                )}
              </form.Field>
              <form.Field name="relevancia">
                {(f) => (
                  <Input
                    label="Relevancia (0-100)"
                    type="number"
                    value={String(f.state.value)}
                    onChange={(e) => f.handleChange(Number(e.target.value))}
                  />
                )}
              </form.Field>

              <div className="flex gap-6">
                <form.Field name="obligatoria">
                  {(f) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <CheckBox
                        checked={f.state.value}
                        onChange={(e) => f.handleChange(e.target.checked)}
                      />
                      <span>Obligatoria</span>
                    </label>
                  )}
                </form.Field>
                <form.Field name="activa">
                  {(f) => (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <CheckBox
                        checked={f.state.value}
                        onChange={(e) => f.handleChange(e.target.checked)}
                      />
                      <span>Activa</span>
                    </label>
                  )}
                </form.Field>
              </div>

              <form.Field name="tiposVehiculos">
                {(f) => (
                  <div>
                    <span className="prometeo-fonts-body-small mb-2 block">
                      Tipos de vehículo
                    </span>
                    <div className="flex gap-4">
                      {Object.values(TiposVehiculo).map((tipo) => {
                        const checked = f.state.value.includes(tipo);
                        return (
                          <label
                            key={tipo}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CheckBox
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  f.handleChange([...f.state.value, tipo]);
                                } else {
                                  f.handleChange(
                                    f.state.value.filter((t) => t !== tipo)
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
                    form="validacion-form"
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

export default ValidacionFormDialog;
