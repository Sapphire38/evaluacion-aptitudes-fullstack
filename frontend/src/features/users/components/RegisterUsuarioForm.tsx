import { useState } from "react";
import { Button, Input } from "prometeo-design-system";
import { toast } from "sonner";
import { fetcher } from "../../../app/instances/axios.intance";
import {
  registerUsuario,
  type RegisterUsuarioPayload,
} from "../use-cases/registerUsuario";
import NativeSelect from "../../../shared/components/ui/NativeSelect";
import { Roles } from "../../../entities/roles/Role";
import { handleError } from "../../../shared/utils/handleError";

const empty: RegisterUsuarioPayload = {
  nombreCompleto: "",
  dni: "",
  rol: Roles.CONDUCTOR,
  area: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterUsuarioForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [values, setValues] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof RegisterUsuarioPayload>(
    key: K,
    value: RegisterUsuarioPayload[K]
  ) => setValues((p) => ({ ...p, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (values.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setSubmitting(true);
    try {
      await registerUsuario(fetcher, values);
      toast.success("Usuario creado");
      setValues(empty);
      onSuccess?.();
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-4">
      <Input
        label="Nombre completo"
        value={values.nombreCompleto}
        onChange={(e) => update("nombreCompleto", e.target.value)}
      />
      <Input
        label="DNI"
        value={values.dni}
        onChange={(e) => update("dni", e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={values.email}
        onChange={(e) => update("email", e.target.value)}
      />
      <NativeSelect
        label="Rol"
        value={values.rol}
        onChange={(v) => update("rol", v)}
        options={Object.values(Roles).map((r) => ({ label: r, value: r }))}
      />
      <Input
        label="Área"
        value={values.area}
        onChange={(e) => update("area", e.target.value)}
      />
      <div />
      <Input
        label="Contraseña"
        type="password"
        value={values.password}
        onChange={(e) => update("password", e.target.value)}
      />
      <Input
        label="Confirmar contraseña"
        type="password"
        value={values.confirmPassword}
        onChange={(e) => update("confirmPassword", e.target.value)}
      />
      <div className="col-span-2 flex justify-end">
        <Button type="submit" label="Crear usuario" isLoading={submitting} />
      </div>
    </form>
  );
};

export default RegisterUsuarioForm;
