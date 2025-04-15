
import { Helmet } from 'react-helmet-async';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Help = () => {
  return (
    <>
      <Helmet>
        <title>Ajuda | MedCheck</title>
      </Helmet>
      <div className="flex min-h-screen bg-background">
        <SideNav className="hidden md:flex" />
        <div className="flex-1">
          <Navbar isLoggedIn={true} />
          <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Central de Ajuda</h1>
            
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                className="pl-10" 
                placeholder="Pesquisar por dúvidas frequentes..."
                type="search"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Primeiros Passos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Conheça o básico para começar a usar o MedCheck.</p>
                  <Button variant="outline" className="w-full">Ver Guias</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Tutoriais em Vídeo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Aprenda com nossos vídeos explicativos passo a passo.</p>
                  <Button variant="outline" className="w-full">Assistir Agora</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Suporte Técnico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Entre em contato com nossa equipe de suporte.</p>
                  <Button variant="outline" className="w-full">Contatar Suporte</Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Encontre respostas para as dúvidas mais comuns sobre o MedCheck
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">
                      Como faço para enviar meus documentos para análise?
                    </AccordionTrigger>
                    <AccordionContent>
                      Para enviar seus documentos para análise, acesse a página "Uploads" no menu lateral.
                      Você pode arrastar e soltar seus PDFs ou clicar para selecionar os arquivos. 
                      O sistema aceita PDFs de demonstrativos de pagamentos e guias TISS.
                      Após o envio, aguarde o processamento que geralmente leva alguns minutos.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">
                      Quais tabelas de referência são utilizadas pelo MedCheck?
                    </AccordionTrigger>
                    <AccordionContent>
                      O MedCheck utiliza principalmente a tabela CBHPM (Classificação Brasileira Hierarquizada de Procedimentos Médicos)
                      em sua versão mais atualizada. Também utilizamos a TUSS (Terminologia Unificada da Saúde Suplementar) e,
                      quando necessário, outras tabelas como AMB 92. Você pode configurar quais tabelas deseja utilizar como referência
                      na página de Configurações.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">
                      Como entender os relatórios gerados pelo sistema?
                    </AccordionTrigger>
                    <AccordionContent>
                      Os relatórios do MedCheck apresentam uma análise detalhada dos seus pagamentos.
                      A seção "Divergências" mostra procedimentos com valores pagos diferentes do esperado conforme a tabela de referência.
                      A coluna "Valor Esperado" indica o valor que deveria ser pago, e a coluna "Diferença" mostra quanto você deixou de receber.
                      Os gráficos mostram tendências ao longo do tempo e distribuição por operadoras de saúde.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left">
                      Posso exportar meus relatórios para apresentar à operadora de saúde?
                    </AccordionTrigger>
                    <AccordionContent>
                      Sim, todos os relatórios gerados pelo MedCheck podem ser exportados em formato PDF ou Excel.
                      Na página de Relatórios, após visualizar a análise, clique no botão "Exportar" no canto superior direito
                      e escolha o formato desejado. Os relatórios exportados são formatados profissionalmente para
                      apresentação às operadoras de saúde ou para seu controle pessoal.
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left">
                      O sistema é seguro? Como meus dados são protegidos?
                    </AccordionTrigger>
                    <AccordionContent>
                      A segurança dos seus dados é nossa prioridade. O MedCheck utiliza criptografia de ponta a ponta
                      para toda a transmissão de dados. Seus documentos são armazenados em servidores seguros com proteção
                      contra acesso não autorizado. Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados)
                      e não compartilhamos suas informações com terceiros sem sua autorização expressa.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium mb-2">Não encontrou o que procurava?</h3>
              <p className="text-muted-foreground mb-4">
                Nossa equipe de suporte está pronta para ajudar com qualquer dúvida adicional.
              </p>
              <Button>Contatar Suporte</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
