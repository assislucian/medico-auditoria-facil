
import UploadSection from "@/components/UploadSection";
import { Card } from "@/components/ui/card";
import { MainLayout } from "@/components/layout/MainLayout";

const UploadsPage = () => {
  return (
    <MainLayout title="Upload de Documentos">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Upload de Documentos</h1>
          <p className="text-muted-foreground mt-1 max-w-3xl">
            Faça o upload dos seus demonstrativos e guias médicas para auditar os pagamentos.
            Nosso sistema irá extrair automaticamente os procedimentos e comparar com os valores recebidos.
          </p>
        </div>
          
        <div className="grid grid-cols-1 gap-6">
          <UploadSection />
            
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Instruções de Upload</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">O que enviar:</h3>
                <ul className="list-disc ml-6 text-muted-foreground space-y-1 mt-2">
                  <li>PDFs dos demonstrativos de pagamento (contracheques) recebidos dos planos de saúde</li>
                  <li>PDFs das guias TISS com os procedimentos realizados</li>
                </ul>
              </div>
                
              <div>
                <h3 className="font-medium text-lg">O que será analisado:</h3>
                <ul className="list-disc ml-6 text-muted-foreground space-y-1 mt-2">
                  <li>Se o procedimento foi efetivamente pago</li>
                  <li>Se o valor pago está de acordo com a tabela CBHPM 2015</li>
                  <li>Separação dos valores por papel: Cirurgião, 1º Auxiliar ou 2º Auxiliar</li>
                </ul>
              </div>
                
              <div>
                <h3 className="font-medium text-lg">Dicas:</h3>
                <ul className="list-disc ml-6 text-muted-foreground space-y-1 mt-2">
                  <li>Verifique se o PDF está legível antes do upload</li>
                  <li>Envie documentos do mesmo período para melhor comparação</li>
                  <li>Aguarde o processamento completo antes de fechar a página</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadsPage;
