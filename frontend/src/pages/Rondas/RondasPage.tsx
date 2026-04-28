import { useRef, useState } from "react";
import { Button, Spinner } from "prometeo-design-system";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import { useRondas } from "../../features/rondas/hooks/useRondas";
import RondasFilters from "../../features/rondas/components/RondasFilters";
import RondasTable from "../../features/rondas/components/RondasTable";
import RondaDetailDialog, {
  type RondaDetailDialogHandle,
} from "../../features/rondas/components/RondaDetailDialog";
import type { ListRondasFilters } from "../../features/rondas/use-cases/listRondas";

const RondasPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ListRondasFilters>({});
  const { data: rondas = [], isLoading, isFetching } = useRondas(filters);
  const detailRef = useRef<RondaDetailDialogHandle>(null);

  const hasFilters = Boolean(
    filters.conductorId || filters.vehiculoId || filters.fecha
  );

  return (
    <PageContainer>
      <PageHeader
        title="Rondas"
        subtitle="Historial de rondas registradas"
        actions={
          <Button
            label="Nueva ronda"
            icon={<Plus size={16} />}
            onClick={() => navigate("/rondas/nueva")}
          />
        }
      />
      <RondasFilters onApply={setFilters} />
      {!hasFilters ? (
        <div className="text-center py-8 text-neutral-medium-default">
          Aplicá un filtro (vehículo, conductor o fecha) para ver rondas.
        </div>
      ) : isLoading || isFetching ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <RondasTable
          rondas={rondas}
          onView={(r) => detailRef.current?.open(r.id)}
        />
      )}
      <RondaDetailDialog ref={detailRef} />
    </PageContainer>
  );
};

export default RondasPage;
