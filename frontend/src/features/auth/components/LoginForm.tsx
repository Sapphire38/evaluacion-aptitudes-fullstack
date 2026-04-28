import { Button, Input } from "prometeo-design-system"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useForm } from "@tanstack/react-form"
import { useAuth } from "../hooks/useAuth"
import { LoginSchema, type LoginSchemaType } from "../schemas/validateLogin"
import type { AppError } from "../../../entities/errors/IErrors"

const LoginForm = () => {
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        } as LoginSchemaType,
        onSubmit: async ({ value }) => {
            const validation = LoginSchema.safeParse(value);
            if (!validation.success) {
                return;
            }

            try {
                const { usuario } = await handleLogin({
                    email: value.email,
                    password: value.password
                })
                navigate("/home", { replace: true })
                toast.success(`Bienvenido ${usuario.nombreCompleto}`)
            } catch (error: unknown) {
                const errorResponse = error as AppError;
                toast.error(` ${errorResponse.message}. `, {
                    description: `Login no autorizado`,
                })
            }
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            noValidate
            className="flex items-center justify-center gap-6 flex-col bg-neutral-default-default"
        >
            <form.Field
                name="email"
                validators={{
                    onChange: ({ value }) => {
                        const result = LoginSchema.shape.email.safeParse(value);
                        if (!result.success) {
                            return result.error.issues[0]?.message;
                        }
                        return undefined;
                    },
                }}
            >
                {(field) => (
                        <Input
                            type="email"
                            label="Correo electrónico"
                            placeholder=""
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            variant={field.state.meta.errors.length > 0 ? "error" : "default"}
                            helperComponent={typeof field.state.meta.errors[0] === "string" ? field.state.meta.errors[0] : undefined}
                            className="w-full"
                        />
                )}
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onChange: ({ value }) => {
                        const result = LoginSchema.shape.password.safeParse(value);
                        if (!result.success) {
                            return result.error.issues[0]?.message;
                        }
                        return undefined;
                    },
                }}
            >
                {(field) => (
                        <Input
                            type="password"
                            label="Contraseña"
                            iconPosition="right"
                            placeholder=""
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            variant={field.state.meta.errors.length > 0 ? "error" : "default"}
                            helperComponent={typeof field.state.meta.errors[0] === "string" ? field.state.meta.errors[0] : undefined}
                            className="w-full"
                        />
                )}
            </form.Field>

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
                {([canSubmit, isSubmitting]) => (
                    <Button
                        type="submit"
                        label="Iniciar sesión"
                        className="w-full"
                        disabled={!canSubmit}
                        isLoading={isSubmitting}
                    />
                )}
            </form.Subscribe>
        </form>
    )
}

export default LoginForm