import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "prometeo-design-system/Table";
import { Button } from "prometeo-design-system";
import type { IConductor } from "../../../entities/Conductor/Conductor";
import { Pencil, PowerOff } from "lucide-react";

interface Props {
  conductores: IConductor[];
  onEdit: (c: IConductor) => void;
  onDeactivate: (c: IConductor) => void;
}

const ConductoresTable = ({ conductores, onEdit, onDeactivate }: Props) => {
  if (!conductores.length) {
    return (
      <div className="text-center py-8 text-neutral-medium-default">
        No hay conductores registrados
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>DNI</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Licencia</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {conductores.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.nombreCompleto}</TableCell>
            <TableCell>{c.dni}</TableCell>
            <TableCell>{c.empresa}</TableCell>
            <TableCell>{c.licenciaConducir.categoria}</TableCell>
            <TableCell>
              {new Date(c.licenciaConducir.fechaVencimiento).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <span
                className={
                  c.estado === "Activo"
                    ? "text-success-default-default"
                    : "text-error-default-default"
                }
              >
                {c.estado}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="ghost"
                  icon={<Pencil size={16} />}
                  onClick={() => onEdit(c)}
                />
                {c.estado === "Activo" && (
                  <Button
                    size="small"
                    variant="ghost"
                    icon={<PowerOff size={16} />}
                    onClick={() => onDeactivate(c)}
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

export default ConductoresTable;
