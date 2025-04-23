
export interface TourStep {
  title: string;
  description: string;
  path: string;
}

export const tourSteps: TourStep[] = [
  {
    title: "Bem-vindo ao Dashboard",
    description: "Aqui você encontra uma visão geral dos seus pagamentos e glosas.",
    path: "/dashboard"
  },
  {
    title: "Envie seus Documentos",
    description: "Clique em 'Uploads' no menu lateral para enviar seus contracheques e guias.",
    path: "/uploads"
  },
  {
    title: "Acompanhe seu Histórico",
    description: "Visualize todas as suas análises anteriores e seus resultados.",
    path: "/history"
  },
  {
    title: "Configure seu Perfil",
    description: "Personalize suas informações e preferências de notificação.",
    path: "/profile"
  }
];
