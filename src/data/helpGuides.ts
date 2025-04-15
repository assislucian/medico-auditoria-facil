import { Guide, VideoTutorial } from '@/types/help';

export const guides: Guide[] = [
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

export const videos: VideoTutorial[] = [
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
