
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { SideNav } from "@/components/SideNav";
import { SearchBar } from '@/components/help/SearchBar';
import { SearchResults } from '@/components/help/SearchResults';
import { HelpContent } from '@/components/help/HelpContent';
import { FAQSection } from '@/components/help/FAQSection';
import { GuidesList } from '@/components/help/GuidesList';
import { VideosList } from '@/components/help/VideosList';
import type { HelpArticle } from '@/types/help';
import { guides, videos } from '@/data/helpGuides';
import { fetchHelpArticles } from "../utils/supabase/supabaseHelpers";

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

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Pass the correct options format to fetchHelpArticles
      const articles = await fetchHelpArticles({published: true});
      setHelpArticles(articles);
    } catch (error) {
      console.error('Erro ao buscar artigos de ajuda:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    const results = helpArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const goToSupport = () => navigate('/support');

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
            
            <SearchBar 
              searchTerm={searchTerm}
              onSearch={handleSearch}
              onSearchTermChange={setSearchTerm}
            />
            
            {isSearching ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p>Buscando resultados...</p>
              </div>
            ) : (
              <SearchResults 
                results={searchResults}
                onClearResults={() => setSearchResults([])}
              />
            )}
            
            {searchResults.length === 0 && (
              <div className="space-y-12">
                <HelpContent 
                  onShowGuides={() => setActiveSection('guides')}
                  onShowVideos={() => setActiveSection('videos')}
                  onContactSupport={goToSupport}
                />
                
                {activeSection === 'guides' && (
                  <GuidesList 
                    guides={guides} 
                    onShowAll={() => setActiveSection(null)}
                  />
                )}
                
                {activeSection === 'videos' && (
                  <VideosList 
                    videos={videos}
                    onShowAll={() => setActiveSection(null)}
                  />
                )}
                
                {!activeSection && <FAQSection items={faqItems} />}
                
                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-medium mb-2">Não encontrou o que procurava?</h3>
                  <p className="text-muted-foreground mb-4">
                    Nossa equipe de suporte está pronta para ajudar com qualquer dúvida adicional.
                  </p>
                  <Button onClick={goToSupport}>Contatar Suporte</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
