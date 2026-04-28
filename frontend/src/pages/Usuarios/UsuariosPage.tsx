import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import RegisterUsuarioForm from "../../features/users/components/RegisterUsuarioForm";

const UsuariosPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Usuarios"
        subtitle="Registrá un nuevo usuario del sistema"
      />
      <div className="max-w-2xl">
        <RegisterUsuarioForm />
      </div>
    </PageContainer>
  );
};

export default UsuariosPage;
