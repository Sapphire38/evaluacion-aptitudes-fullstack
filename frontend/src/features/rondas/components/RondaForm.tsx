import { useMemo, useRef, useState } from "react";
import { Button, CheckBox, Input, Spinner } from "prometeo-design-system";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useVehiculos } from "../../vehiculos/hooks/useVehiculos";
import { useConductores } from "../../conductores/hooks/useConductores";
import {
  useCreateRonda,
  useValidacionesParaVehiculo,
} from "../hooks/useRondas";
import SignaturePad, {
  type SignaturePadHandle,
} from "../../../shared/components/SignaturePad";
import NativeSelect from "../../../shared/components/ui/NativeSelect";
import { handleError } from "../../../shared/utils/handleError";
import { useUser } from "../../users/hooks/useUser";

interface ValidacionResp {
  cumplida: boolean;
  observaciones: string;
}

const RondaForm = () => {
  const navigate = useNavigate();
  const { usuario } = useUser();

  const { vehiculos, isLoading: vehiculosLoading } = useVehiculos();
  const { conductores, isLoading: conductoresLoading } = useConductores();

  const [vehiculoId, setVehiculoId] = useState("");
  const [conductorId, setConductorId] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [respuestas, setRespuestas] = useState<Record<string, ValidacionResp>>(
    {}
  );

  const { data: validaciones = [], isLoading: validacionesLoading } =
    useValidacionesParaVehiculo(vehiculoId);

  const create = useCreateRonda();
  const sigRef = useRef<SignaturePadHandle>(null);

  const vehiculosActivos = useMemo(
    () => vehiculos.filter((v) => v.activo),
    [vehiculos]
  );
  const conductoresActivos = useMemo(
    () => conductores.filter((c) => c.estado === "Activo"),
    [conductores]
  );

  const conductoresVisibles = useMemo(() => {
    if (usuario?.rol === "CONDUCTOR") {
      return conductoresActivos.filter((c) => c.usuarioId === usuario.id);
    }
    return conductoresActivos;
  }, [conductoresActivos, usuario]);

  const setRespuesta = (
    id: string,
    field: keyof ValidacionResp,
    value: boolean | string
  ) => {
    setRespuestas((prev) => ({
      ...prev,
      [id]: {
        cumplida: prev[id]?.cumplida ?? false,
        observaciones: prev[id]?.observaciones ?? "",
        [field]: value,
      },
    }));
  };

  const cumplimiento = useMemo(() => {
    return validaciones.reduce((acc, v) => {
      return respuestas[v.id]?.cumplida ? acc + v.relevancia : acc;
    }, 0);
  }, [validaciones, respuestas]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiculoId || !conductorId) {
      toast.error("Seleccioná vehículo y conductor");
      return;
    }
    const km = Number(kilometraje);
    if (!Number.isFinite(km) || km < 0) {
      toast.error("Kilometraje inválido");
      return;
    }
    const firma = sigRef.current?.toBase64();
    if (!firma) {
      toast.error("La firma digital es obligatoria");
      return;
    }
    if (!validaciones.length) {
      toast.error("No hay validaciones activas para este vehículo");
      return;
    }
    const payload = {
      vehiculoId,
      conductorId,
      kilometraje: km,
      observaciones: observaciones || undefined,
      firmaDigital: firma,
      validaciones: validaciones.map((v) => ({
        validacionId: v.id,
        cumplida: respuestas[v.id]?.cumplida ?? false,
        observaciones: respuestas[v.id]?.observaciones || undefined,
      })),
    };
    try {
      const ronda = await create.mutateAsync(payload);
      toast.success(
        `Ronda registrada — estado: ${ronda.estado} (${ronda.cumplimiento}%)`
      );
      navigate("/rondas");
    } catch (err) {
      handleError(err);
    }
  };

  const vehiculoOptions = [
    { label: "Seleccionar vehículo...", value: "" },
    ...vehiculosActivos.map((v) => ({
      label: `${v.dominio} — ${v.marca} ${v.modelo} (${v.tipo})`,
      value: v.id,
    })),
  ];
  const conductorOptions = [
    { label: "Seleccionar conductor...", value: "" },
    ...conductoresVisibles.map((c) => ({
      label: `${c.nombreCompleto} (DNI ${c.dni})`,
      value: c.id,
    })),
  ];

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NativeSelect
          label="Vehículo"
          options={vehiculoOptions}
          value={vehiculoId}
          onChange={setVehiculoId}
          disabled={vehiculosLoading}
        />
        <NativeSelect
          label="Conductor"
          options={conductorOptions}
          value={conductorId}
          onChange={setConductorId}
          disabled={conductoresLoading}
        />
        <Input
          label="Kilometraje"
          type="number"
          value={kilometraje}
          onChange={(e) => setKilometraje(e.target.value)}
        />
        <label className="flex flex-col gap-1">
          <span className="prometeo-fonts-body-small">Observaciones (opcional)</span>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            className="bg-neutral-default-default border border-neutral-default-default rounded-md px-3 py-2 text-neutral-strong-default focus:outline-none focus:ring-2 focus:ring-primary-default-default"
          />
        </label>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="prometeo-fonts-h4-bold">Checkpoints</h2>
          {vehiculoId && validaciones.length > 0 && (
            <span className="prometeo-fonts-body-small text-neutral-medium-default">
              Cumplimiento estimado:{" "}
              <span
                className={
                  cumplimiento >= 85
                    ? "text-success-default-default font-semibold"
                    : "text-warning-default-default font-semibold"
                }
              >
                {cumplimiento}%
              </span>
            </span>
          )}
        </div>
        {!vehiculoId && (
          <p className="text-neutral-medium-default">
            Seleccioná un vehículo para cargar las validaciones aplicables.
          </p>
        )}
        {validacionesLoading && <Spinner />}
        {vehiculoId && !validacionesLoading && validaciones.length === 0 && (
          <p className="text-warning-default-default">
            No hay validaciones activas para este tipo de vehículo.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {validaciones.map((v) => {
            const r = respuestas[v.id] ?? { cumplida: false, observaciones: "" };
            return (
              <div
                key={v.id}
                className="border border-neutral-default-default rounded-md p-3 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <label className="flex items-start gap-2 cursor-pointer flex-1">
                    <CheckBox
                      checked={r.cumplida}
                      onChange={(e) =>
                        setRespuesta(v.id, "cumplida", e.target.checked)
                      }
                    />
                    <div>
                      <div className="font-medium">
                        {v.nombre}
                        {v.obligatoria && (
                          <span className="ml-2 text-warning-default-default text-xs">
                            obligatoria
                          </span>
                        )}
                      </div>
                      <div className="prometeo-fonts-body-small text-neutral-medium-default">
                        Relevancia: {v.relevancia}%
                      </div>
                    </div>
                  </label>
                </div>
                <Input
                  label="Observaciones"
                  value={r.observaciones}
                  onChange={(e) =>
                    setRespuesta(v.id, "observaciones", e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="prometeo-fonts-h4-bold">Firma digital</h2>
        <SignaturePad ref={sigRef} />
      </section>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          label="Cancelar"
          onClick={() => navigate(-1)}
        />
        <Button
          type="submit"
          label="Registrar ronda"
          isLoading={create.isPending}
        />
      </div>
    </form>
  );
};

export default RondaForm;
