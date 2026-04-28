import { useImperativeHandle, type Ref } from "react";
import DialogModal, { useDialogControl } from "prometeo-design-system/DialogModal";
import { Button } from "prometeo-design-system";
import { useRonda } from "../hooks/useRondas";

export interface RondaDetailDialogHandle {
  open: (id: string) => void;
  close: () => void;
}

interface Props {
  ref?: Ref<RondaDetailDialogHandle>;
}

const RondaDetailDialog = ({ ref }: Props) => {
  const dialog = useDialogControl<{ id: string }>();
  const ctx = dialog.getContext();
  const { data: ronda, isLoading } = useRonda(ctx?.id);

  useImperativeHandle(ref, () => ({
    open: (id: string) => dialog.open({ id }),
    close: dialog.close,
  }));

  return (
    <DialogModal ref={dialog.ref} size="large">
      {() => (
        <>
          <DialogModal.Header title="Detalle de ronda" />
          <DialogModal.Content>
            {isLoading || !ronda ? (
              <div className="py-8 text-center text-neutral-medium-default">
                Cargando...
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <section className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-neutral-medium-default">Fecha</span>
                    <div>{new Date(ronda.fechaHora).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-medium-default">Estado</span>
                    <div
                      className={
                        ronda.estado === "APTA"
                          ? "text-success-default-default font-semibold"
                          : "text-error-default-default font-semibold"
                      }
                    >
                      {ronda.estado} ({ronda.cumplimiento}%)
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-medium-default">Vehículo</span>
                    <div className="font-mono text-xs">{ronda.vehiculoId}</div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-medium-default">Conductor</span>
                    <div className="font-mono text-xs">{ronda.conductorId}</div>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-medium-default">Kilometraje</span>
                    <div>{ronda.kilometraje.toLocaleString()} km</div>
                  </div>
                  {ronda.observaciones && (
                    <div className="col-span-2">
                      <span className="text-xs text-neutral-medium-default">
                        Observaciones
                      </span>
                      <div>{ronda.observaciones}</div>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="prometeo-fonts-h5-bold mb-2">Validaciones</h3>
                  <div className="flex flex-col gap-1">
                    {ronda.validaciones.map((v) => (
                      <div
                        key={v.validacionId}
                        className="flex items-center justify-between border border-neutral-default-default rounded-md p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              v.cumplida
                                ? "text-success-default-default"
                                : "text-error-default-default"
                            }
                          >
                            {v.cumplida ? "✓" : "✗"}
                          </span>
                          <span>{v.nombre}</span>
                          {v.obligatoria && (
                            <span className="text-xs text-warning-default-default">
                              obligatoria
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-medium-default">
                          {v.relevancia}%
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="prometeo-fonts-h5-bold mb-2">Firma digital</h3>
                  <img
                    src={ronda.firmaDigital}
                    alt="Firma digital"
                    className="border border-neutral-default-default rounded-md max-w-full"
                  />
                </section>
              </div>
            )}
          </DialogModal.Content>
          <DialogModal.Footer>
            <div className="flex justify-end">
              <Button label="Cerrar" onClick={() => dialog.close()} />
            </div>
          </DialogModal.Footer>
        </>
      )}
    </DialogModal>
  );
};

export default RondaDetailDialog;
