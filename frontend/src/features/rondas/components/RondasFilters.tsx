import { Button, Input } from "prometeo-design-system";
import { useState } from "react";
import NativeSelect from "../../../shared/components/ui/NativeSelect";
import { useVehiculos } from "../../vehiculos/hooks/useVehiculos";
import { useConductores } from "../../conductores/hooks/useConductores";
import type { ListRondasFilters } from "../use-cases/listRondas";

interface Props {
  onApply: (filters: ListRondasFilters) => void;
}

const RondasFilters = ({ onApply }: Props) => {
  const { vehiculos } = useVehiculos();
  const { conductores } = useConductores();

  const [vehiculoId, setVehiculoId] = useState("");
  const [conductorId, setConductorId] = useState("");
  const [fecha, setFecha] = useState("");

  const apply = () => {
    onApply({
      vehiculoId: vehiculoId || undefined,
      conductorId: conductorId || undefined,
      fecha: fecha ? new Date(fecha).toISOString() : undefined,
    });
  };

  const clear = () => {
    setVehiculoId("");
    setConductorId("");
    setFecha("");
    onApply({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
      <NativeSelect
        label="Vehículo"
        value={vehiculoId}
        onChange={setVehiculoId}
        options={[
          { label: "Todos", value: "" },
          ...vehiculos.map((v) => ({
            label: `${v.dominio} (${v.marca} ${v.modelo})`,
            value: v.id,
          })),
        ]}
      />
      <NativeSelect
        label="Conductor"
        value={conductorId}
        onChange={setConductorId}
        options={[
          { label: "Todos", value: "" },
          ...conductores.map((c) => ({
            label: c.nombreCompleto,
            value: c.id,
          })),
        ]}
      />
      <Input
        label="Fecha"
        type="text"
        placeholder="YYYY-MM-DD"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />
      <div className="flex gap-2">
        <Button label="Aplicar" onClick={apply} />
        <Button label="Limpiar" variant="ghost" onClick={clear} />
      </div>
    </div>
  );
};

export default RondasFilters;
