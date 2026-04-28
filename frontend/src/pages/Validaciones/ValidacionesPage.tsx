import { useRef } from "react";
import { Button, Spinner } from "prometeo-design-system";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import { useValidaciones } from "../../features/validaciones/hooks/useValidaciones";
import ValidacionesTable from "../../features/validaciones/components/ValidacionesTable";
import ValidacionFormDialog, {
  type ValidacionFormDialogHandle,
} from "../../features/validaciones/components/ValidacionFormDialog";
import type { IValidacion } from "../../entities/Validacion/Validacion";
import { handleError } from "../../shared/utils/handleError";

const ValidacionesPage = () => {
  const { validaciones, isLoading, update } = useValidaciones();
  const dialogRef = useRef<ValidacionFormDialogHandle>(null);

  const onToggle = async (v: IValidacion) => {
    try {
      await update.mutateAsync({ id: v.id, payload: { activa: !v.activa } });
      toast.success(v.activa ? "Validación desactivada" : "Validación activada");
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Validaciones"
        subtitle="Checkpoints aplicados durante las rondas"
        actions={
          <Button
            label="Nueva validación"
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
        <ValidacionesTable
          validaciones={validaciones}
          onEdit={(v) => dialogRef.current?.openEdit(v)}
          onToggleActive={onToggle}
        />
      )}
      <ValidacionFormDialog ref={dialogRef} />
    </PageContainer>
  );
};

export default ValidacionesPage;
