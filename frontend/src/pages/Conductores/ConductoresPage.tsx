import { useRef } from "react";
import { Button, Spinner } from "prometeo-design-system";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import { useConductores } from "../../features/conductores/hooks/useConductores";
import ConductoresTable from "../../features/conductores/components/ConductoresTable";
import ConductorFormDialog, {
  type ConductorFormDialogHandle,
} from "../../features/conductores/components/ConductorFormDialog";
import type { IConductor } from "../../entities/Conductor/Conductor";
import { handleError } from "../../shared/utils/handleError";

const ConductoresPage = () => {
  const { conductores, isLoading, deactivate } = useConductores();
  const dialogRef = useRef<ConductorFormDialogHandle>(null);

  const onDeactivate = async (c: IConductor) => {
    if (!confirm(`¿Desactivar conductor ${c.nombreCompleto}?`)) return;
    try {
      await deactivate.mutateAsync(c.id);
      toast.success("Conductor desactivado");
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Conductores"
        subtitle="Administrá los conductores habilitados"
        actions={
          <Button
            label="Nuevo conductor"
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
        <ConductoresTable
          conductores={conductores}
          onEdit={(c) => dialogRef.current?.openEdit(c)}
          onDeactivate={onDeactivate}
        />
      )}
      <ConductorFormDialog ref={dialogRef} />
    </PageContainer>
  );
};

export default ConductoresPage;
