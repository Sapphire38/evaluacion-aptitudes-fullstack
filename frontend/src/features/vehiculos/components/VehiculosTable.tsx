import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "prometeo-design-system/Table";
import { Button } from "prometeo-design-system";
import type { IVehiculo } from "../../../entities/Vehiculo/Vehiculo";
import { Pencil, PowerOff } from "lucide-react";

interface Props {
  vehiculos: IVehiculo[];
  onEdit: (v: IVehiculo) => void;
  onDeactivate: (v: IVehiculo) => void;
}

const VehiculosTable = ({ vehiculos, onEdit, onDeactivate }: Props) => {
  if (!vehiculos.length) {
    return (
      <div className="text-center py-8 text-neutral-medium-default">
        No hay vehículos registrados
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dominio</TableHead>
          <TableHead>Marca / Modelo</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Año</TableHead>
          <TableHead>Kilometraje</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vehiculos.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-medium">{v.dominio}</TableCell>
            <TableCell>
              {v.marca} {v.modelo}
            </TableCell>
            <TableCell>{v.tipo}</TableCell>
            <TableCell>{v.anoFabricacion}</TableCell>
            <TableCell>{v.kilometraje.toLocaleString()} km</TableCell>
            <TableCell>
              {v.responsable.tipo}: {v.responsable.id}
            </TableCell>
            <TableCell>
              <span
                className={
                  v.activo
                    ? "text-success-default-default"
                    : "text-error-default-default"
                }
              >
                {v.activo ? "Activo" : "Inactivo"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="ghost"
                  icon={<Pencil size={16} />}
                  onClick={() => onEdit(v)}
                />
                {v.activo && (
                  <Button
                    size="small"
                    variant="ghost"
                    icon={<PowerOff size={16} />}
                    onClick={() => onDeactivate(v)}
                  />
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VehiculosTable;
