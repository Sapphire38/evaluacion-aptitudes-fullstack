import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "prometeo-design-system/Table";
import { Button } from "prometeo-design-system";
import { Eye } from "lucide-react";
import type { IRonda } from "../../../entities/Ronda/Ronda";

interface Props {
  rondas: IRonda[];
  onView: (r: IRonda) => void;
}

const RondasTable = ({ rondas, onView }: Props) => {
  if (!rondas.length) {
    return (
      <div className="text-center py-8 text-neutral-medium-default">
        No hay rondas para los filtros seleccionados
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Vehículo</TableHead>
          <TableHead>Conductor</TableHead>
          <TableHead>Kilometraje</TableHead>
          <TableHead>Cumplimiento</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rondas.map((r) => (
          <TableRow key={r.id}>
            <TableCell>
              {new Date(r.fechaHora).toLocaleString()}
            </TableCell>
            <TableCell className="font-mono text-xs">{r.vehiculoId}</TableCell>
            <TableCell className="font-mono text-xs">{r.conductorId}</TableCell>
            <TableCell>{r.kilometraje.toLocaleString()} km</TableCell>
            <TableCell>{r.cumplimiento}%</TableCell>
            <TableCell>
              <span
                className={
                  r.estado === "APTA"
                    ? "text-success-default-default font-semibold"
                    : "text-error-default-default font-semibold"
                }
              >
                {r.estado}
              </span>
            </TableCell>
            <TableCell>
              <Button
                size="small"
                variant="ghost"
                icon={<Eye size={16} />}
                onClick={() => onView(r)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RondasTable;
