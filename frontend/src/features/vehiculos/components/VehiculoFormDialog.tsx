import { useImperativeHandle, useState, type Ref } from "react";
import DialogModal, { useDialogControl } from "prometeo-design-system/DialogModal";
import { Button, Input } from "prometeo-design-system";
import { toast } from "sonner";
import {
  TiposResponsable,
  TiposVehiculo,
  type IVehiculo,
} from "../../../entities/Vehiculo/Vehiculo";
import { useVehiculos } from "../hooks/useVehiculos";
import {
  VehiculoSchema,
  type VehiculoSchemaType,
} from "../schemas/vehiculoSchema";
import { handleError } from "../../../shared/utils/handleError";
import NativeSelect from "../../../shared/components/ui/NativeSelect";

export interface VehiculoFormDialogHandle {
  openCreate: () => void;
  openEdit: (vehiculo: IVehiculo) => void;
  close: () => void;
}

const emptyValues: VehiculoSchemaType = {
  dominio: "",
  marca: "",
  modelo: "",
  tipo: TiposVehiculo.AUTO,
  anoFabricacion: new Date().getFullYear(),
  kilometraje: 0,
  responsableId: "",
  responsableTipo: TiposResponsable.USUARIO,
};

const tipoOptions = Object.values(TiposVehiculo).map((t) => ({ label: t, value: t }));
const respOptions = Object.values(TiposResponsable).map((t) => ({ label: t, value: t }));

interface Props {
  ref?: Ref<VehiculoFormDialogHandle>;
}

const VehiculoFormDialog = ({ ref }: Props) => {
  const dialog = useDialogControl<IVehiculo | null>();
  const { create, update } = useVehiculos();
  const [editing, setEditing] = useState<IVehiculo | null>(null);
  const [values, setValues] = useState<VehiculoSchemaType>(emptyValues);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof VehiculoSchemaType>(k: K, v: VehiculoSchemaType[K]) =>
    setValues((p) => ({ ...p, [k]: v }));

  useImperativeHandle(ref, () => ({
    openCreate: () => {
      setEditing(null);
      setValues(emptyValues);
      dialog.open(null);
    },
    openEdit: (v: IVehiculo) => {
      setEditing(v);
      setValues({
        dominio: v.dominio,
        marca: v.marca,
        modelo: v.modelo,
        tipo: v.tipo,
        anoFabricacion: v.anoFabricacion,
        kilometraje: v.kilometraje,
        responsableId: v.responsable.id,
        responsableTipo: v.responsable.tipo,
      });
      dialog.open(v);
    },
    close: dialog.close,
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = VehiculoSchema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }
    const payload = {
      dominio: values.dominio,
      marca: values.marca,
      modelo: values.modelo,
      tipo: values.tipo,
      anoFabricacion: values.anoFabricacion,
      kilometraje: values.kilometraje,
      responsable: { id: values.responsableId, tipo: values.responsableTipo },
    };
    setSubmitting(true);
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, payload });
        toast.success("Vehículo actualizado");
      } else {
        await create.mutateAsync({ ...payload, activo: true });
        toast.success("Vehículo creado");
      }
      dialog.close();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DialogModal ref={dialog.ref} size="medium" title={editing ? "Editar vehículo" : "Crear vehículo"}>
      <DialogModal.Content>
        <form id="vehiculo-form" onSubmit={submit} className="grid grid-cols-2 gap-4">
          <Input label="Dominio" value={values.dominio} onChange={(e) => set("dominio", e.target.value)} />
          <Input label="Marca" value={values.marca} onChange={(e) => set("marca", e.target.value)} />
          <Input label="Modelo" value={values.modelo} onChange={(e) => set("modelo", e.target.value)} />
          <NativeSelect
            label="Tipo"
            options={tipoOptions}
            value={values.tipo}
            onChange={(v) => set("tipo", v as VehiculoSchemaType["tipo"])}
          />
          <Input
            label="Año fabricación"
            type="number"
            value={String(values.anoFabricacion)}
            onChange={(e) => set("anoFabricacion", Number(e.target.value))}
          />
          <Input
            label="Kilometraje"
            type="number"
            value={String(values.kilometraje)}
            onChange={(e) => set("kilometraje", Number(e.target.value))}
          />
          <NativeSelect
            label="Tipo responsable"
            options={respOptions}
            value={values.responsableTipo}
            onChange={(v) => set("responsableTipo", v as VehiculoSchemaType["responsableTipo"])}
          />
          <Input
            label="ID responsable"
            value={values.responsableId}
            onChange={(e) => set("responsableId", e.target.value)}
          />
        </form>
      </DialogModal.Content>
      <DialogModal.Footer>
        <div className="flex justify-end gap-2">
          <Button label="Cancelar" variant="ghost" onClick={() => dialog.close()} />
          <Button
            type="submit"
            form="vehiculo-form"
            label={editing ? "Guardar" : "Crear"}
            isLoading={submitting}
          />
        </div>
      </DialogModal.Footer>
    </DialogModal>
  );
};

export default VehiculoFormDialog;
