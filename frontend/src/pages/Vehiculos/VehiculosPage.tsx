import { useRef } from "react";
import { Button, Spinner } from "prometeo-design-system";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import { useVehiculos } from "../../features/vehiculos/hooks/useVehiculos";
import VehiculosTable from "../../features/vehiculos/components/VehiculosTable";
import VehiculoFormDialog, {
  type VehiculoFormDialogHandle,
} from "../../features/vehiculos/components/VehiculoFormDialog";
import type { IVehiculo } from "../../entities/Vehiculo/Vehiculo";
import { handleError } from "../../shared/utils/handleError";

const VehiculosPage = () => {
  const { vehiculos, isLoading, deactivate } = useVehiculos();
  const dialogRef = useRef<VehiculoFormDialogHandle>(null);

  const onDeactivate = async (v: IVehiculo) => {
    if (!confirm(`¿Desactivar vehículo ${v.dominio}?`)) return;
    try {
      await deactivate.mutateAsync(v.id);
      toast.success("Vehículo desactivado");
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Vehículos"
        subtitle="Administrá la flota de vehículos del sistema"
        actions={
          <Button
            label="Nuevo vehículo"
            icon={<Plus size={16} />}
            onClick={() => dialogRef.current?.openCreate()}
          />
        }
      />
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <VehiculosTable
          vehiculos={vehiculos}
          onEdit={(v) => dialogRef.current?.openEdit(v)}
          onDeactivate={onDeactivate}
        />
      )}
      <VehiculoFormDialog ref={dialogRef} />
    </PageContainer>
  );
};

export default VehiculosPage;
