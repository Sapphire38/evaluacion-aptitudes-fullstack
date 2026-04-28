import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "prometeo-design-system/Table";
import { Button } from "prometeo-design-system";
import { Pencil, Power } from "lucide-react";
import type { IValidacion } from "../../../entities/Validacion/Validacion";

interface Props {
  validaciones: IValidacion[];
  onEdit: (v: IValidacion) => void;
  onToggleActive: (v: IValidacion) => void;
}

const ValidacionesTable = ({ validaciones, onEdit, onToggleActive }: Props) => {
  if (!validaciones.length) {
    return (
      <div className="text-center py-8 text-neutral-medium-default">
        No hay validaciones registradas
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Relevancia</TableHead>
          <TableHead>Obligatoria</TableHead>
          <TableHead>Tipos vehículo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {validaciones.map((v) => (
          <TableRow key={v.id}>
            <TableCell className="font-medium">{v.nombre}</TableCell>
            <TableCell>{v.relevancia}%</TableCell>
            <TableCell>
              {v.obligatoria ? (
                <span className="text-warning-default-default font-semibold">Sí</span>
              ) : (
                "No"
              )}
            </TableCell>
            <TableCell>{v.tiposVehiculos.join(", ")}</TableCell>
            <TableCell>
              <span
                className={
                  v.activa
                    ? "text-success-default-default"
                    : "text-error-default-default"
                }
              >
                {v.activa ? "Activa" : "Inactiva"}
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
                <Button
                  size="small"
                  variant="ghost"
                  icon={<Power size={16} />}
                  onClick={() => onToggleActive(v)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ValidacionesTable;
