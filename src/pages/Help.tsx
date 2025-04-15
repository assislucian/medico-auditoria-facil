
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlayCircle, FileText, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type HelpArticle = {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
};

const faqItems = [
  {
    id: "item-1",
    question: "Como faço para enviar meus documentos para análise?",
    answer: "Para enviar seus documentos para análise, acesse a página \"Uploads\" no menu lateral. Você pode arrastar e soltar seus PDFs ou clicar para selecionar os arquivos. O sistema aceita PDFs de demonstrativos de pagamentos e guias TISS. Após o envio, aguarde o processamento que geralmente leva alguns minutos."
  },
  {
    id: "item-2",
    question: "Quais tabelas de referência são utilizadas pelo MedCheck?",
    answer: "O MedCheck utiliza principalmente a tabela CBHPM (Classificação Brasileira Hierarquizada de Procedimentos Médicos) em sua versão mais atualizada. Também utilizamos a TUSS (Terminologia Unificada da Saúde Suplementar) e, quando necessário, outras tabelas como AMB 92. Você pode configurar quais tabelas deseja utilizar como referência na página de Configurações."
  },
  {
    id: "item-3",
    question: "Como entender os relatórios gerados pelo sistema?",
    answer: "Os relatórios do MedCheck apresentam uma análise detalhada dos seus pagamentos. A seção \"Divergências\" mostra procedimentos com valores pagos diferentes do esperado conforme a tabela de referência. A coluna \"Valor Esperado\" indica o valor que deveria ser pago, e a coluna \"Diferença\" mostra quanto você deixou de receber. Os gráficos mostram tendências ao longo do tempo e distribuição por operadoras de saúde."
  },
  {
    id: "item-4",
    question: "Posso exportar meus relatórios para apresentar à operadora de saúde?",
    answer: "Sim, todos os relatórios gerados pelo MedCheck podem ser exportados em formato PDF ou Excel. Na página de Relatórios, após visualizar a análise, clique no botão \"Exportar\" no canto superior direito e escolha o formato desejado. Os relatórios exportados são formatados profissionalmente para apresentação às operadoras de saúde ou para seu controle pessoal."
  },
  {
    id: "item-5",
    question: "O sistema é seguro? Como meus dados são protegidos?",
    answer: "A segurança dos seus dados é nossa prioridade. O MedCheck utiliza criptografia de ponta a ponta para toda a transmissão de dados. Seus documentos são armazenados em servidores seguros com proteção contra acesso não autorizado. Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados) e não compartilhamos suas informações com terceiros sem sua autorização expressa."
  }
];

const guides = [
  {
    id: "guide-1",
    title: "Como criar sua conta no MedCheck",
    content: "Neste guia, você aprenderá como criar sua conta no MedCheck em poucos minutos. Começando pela página inicial, clique no botão 'Cadastrar' no canto superior direito. Preencha o formulário com suas informações pessoais e profissionais, incluindo seu número de CRM. Após finalizar o cadastro, você receberá um e-mail de confirmação. Clique no link de confirmação para ativar sua conta.",
    category: "primeiros-passos"
  },
  {
    id: "guide-2",
    title: "Configurando seu perfil profissional",
    content: "Configure seu perfil para aproveitar ao máximo o MedCheck. Na página de perfil, adicione sua especialidade médica, suas operadoras de saúde parceiras e as tabelas de remuneração que você utiliza. Essas informações são essenciais para que o sistema possa analisar corretamente seus pagamentos.",
    category: "primeiros-passos"
  },
  {
    id: "guide-3",
    title: "Como enviar seu primeiro documento",
    content: "Aprenda a enviar documentos para análise. Na página 'Uploads', clique em 'Novo Upload' ou arraste seus arquivos diretamente para a área indicada. O MedCheck aceita arquivos PDF de demonstrativos de pagamento e guias TISS. Após o envio, você pode acompanhar o status do processamento na mesma página.",
    category: "primeiros-passos"
  },
  {
    id: "guide-4",
    title: "Como interpretar o resultado da análise",
    content: "Esta é uma visão geral de como interpretar os resultados da análise do MedCheck. Na página de relatórios, você verá um resumo dos procedimentos analisados, com destaque para aqueles com divergências de pagamento. Cada procedimento mostra o valor pago pela operadora, o valor esperado conforme a tabela de referência e a diferença entre eles.",
    category: "analise"
  }
];

const videos = [
  {
    id: "video-1",
    title: "Introdução ao MedCheck",
    description: "Uma visão geral das funcionalidades do MedCheck em 5 minutos",
    url: "https://www.youtube.com/watch?v=example1",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "video-2",
    title: "Como fazer upload de documentos",
    description: "Tutorial passo a passo para enviar seus demonstrativos",
    url: "https://www.youtube.com/watch?v=example2",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "video-3",
    title: "Entendendo seus relatórios",
    description: "Como interpretar os resultados da análise e tomar ações",
    url: "https://www.youtube.com/watch?v=example3",
    thumbnail: "/placeholder.svg"
  }
];

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Este efeito será executado quando o componente for montado 
    // Simula a recuperação de artigos de ajuda do banco de dados
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulação de busca nos FAQs e guias
    const results: HelpArticle[] = [];
    
    // Busca nos FAQs
    faqItems.forEach(item => {
      if (
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        results.push({
          id: item.id,
          title: item.question,
          content: item.answer,
          category: "faq",
          tags: ["ajuda", "faq"]
        });
      }
    });
    
    // Busca nos guias
    guides.forEach(guide => {
      if (
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.content.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        results.push({
          id: guide.id,
          title: guide.title,
          content: guide.content,
          category: "guia",
          tags: [guide.category]
        });
      }
    });
    
    setSearchResults(results);
    
    // Registrar busca (em uma aplicação real, isso enviaria para o banco de dados)
    console.log("Pesquisa realizada:", searchTerm);
    
    setIsSearching(false);
  };

  const goToSupport = () => {
    navigate('/support');
  };

  const showGuides = () => {
    setActiveSection('guides');
  };
  
  const showVideos = () => {
    setActiveSection('videos');
  };

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
            
            <form onSubmit={handleSearch} className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                className="pl-10" 
                placeholder="Pesquisar por dúvidas frequentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
              />
            </form>
            
            {isSearching ? (
              <div className="text-center py-8">
                <p>Buscando resultados...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="mb-10">
                <h2 className="text-xl font-medium mb-4">Resultados da pesquisa</h2>
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <Card key={result.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{result.title}</CardTitle>
                        <CardDescription>Categoria: {result.category === 'faq' ? 'Perguntas Frequentes' : 'Guia'}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{result.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchResults([])}
                >
                  Limpar resultados
                </Button>
              </div>
            ) : null}
            
            {(searchResults.length === 0 || activeSection === null) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Primeiros Passos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Conheça o básico para começar a usar o MedCheck.</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={showGuides}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Ver Guias
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tutoriais em Vídeo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Aprenda com nossos vídeos explicativos passo a passo.</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={showVideos}
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Assistir Agora
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Suporte Técnico</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Entre em contato com nossa equipe de suporte.</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={goToSupport}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Contatar Suporte
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {activeSection === 'guides' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Guias de Ajuda</h2>
                  <Button variant="outline" onClick={() => setActiveSection(null)}>Voltar</Button>
                </div>
                
                <div className="space-y-4">
                  {guides.map((guide) => (
                    <Card key={guide.id}>
                      <CardHeader>
                        <CardTitle>{guide.title}</CardTitle>
                        <CardDescription>
                          {guide.category === 'primeiros-passos' ? 'Primeiros Passos' : 'Análise'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{guide.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'videos' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Tutoriais em Vídeo</h2>
                  <Button variant="outline" onClick={() => setActiveSection(null)}>Voltar</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlayCircle className="h-16 w-16 text-primary/70 hover:text-primary transition-colors cursor-pointer" />
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {!activeSection && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Perguntas Frequentes</CardTitle>
                  <CardDescription>
                    Encontre respostas para as dúvidas mais comuns sobre o MedCheck
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item) => (
                      <AccordionItem key={item.id} value={item.id}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
            
            {!activeSection && (
              <div className="bg-primary/5 rounded-lg p-6 text-center">
                <h3 className="text-xl font-medium mb-2">Não encontrou o que procurava?</h3>
                <p className="text-muted-foreground mb-4">
                  Nossa equipe de suporte está pronta para ajudar com qualquer dúvida adicional.
                </p>
                <Button onClick={goToSupport}>Contatar Suporte</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
