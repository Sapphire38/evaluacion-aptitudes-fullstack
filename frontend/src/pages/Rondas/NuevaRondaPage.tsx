import PageContainer from "../../shared/components/PageContainer";
import PageHeader from "../../shared/components/PageHeader";
import RondaForm from "../../features/rondas/components/RondaForm";

const NuevaRondaPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Nueva ronda"
        subtitle="Registrá los checkpoints y la firma del conductor"
      />
      <RondaForm />
    </PageContainer>
  );
};

export default NuevaRondaPage;
