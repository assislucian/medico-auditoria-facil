
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchPaymentAudit, generateContestation } from '@/services/analysis/auditService';

export interface AuditData {
  guide_number: string;
  procedimento: string;
  codigo: string;
  role_name: string;
  expected_value: number;
  valor_pago: number;
  difference: number;
  participation_id: string;
  doctor_email: string;
}

export function useAudit(guideNumber?: string) {
  const [selectedParticipations, setSelectedParticipations] = useState<string[]>([]);
  
  // Fetch audit data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['audit', guideNumber],
    queryFn: () => guideNumber ? fetchPaymentAudit(guideNumber) : Promise.resolve([]),
    enabled: !!guideNumber
  });

  // Generate contestation mutation
  const { mutate: generateContestationDoc, isPending } = useMutation({
    mutationFn: (participationIds: string[]) => generateContestation(participationIds),
    onSuccess: (data) => {
      toast.success('Contestação gerada com sucesso!');
      if (data?.documentUrl) {
        window.open(data.documentUrl, '_blank');
      }
    },
    onError: (error) => {
      toast.error('Erro ao gerar contestação', {
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado'
      });
    }
  });

  // Function to toggle selection of a participation
  const toggleParticipation = (participationId: string) => {
    setSelectedParticipations(prev => 
      prev.includes(participationId)
        ? prev.filter(id => id !== participationId)
        : [...prev, participationId]
    );
  };

  // Generate contestation for selected participations
  const generateSelectedContestation = () => {
    if (selectedParticipations.length === 0) {
      toast.error('Selecione pelo menos um procedimento para contestar');
      return;
    }
    generateContestationDoc(selectedParticipations);
  };

  // Calculate summary statistics
  const summary = data ? {
    totalExpected: data.reduce((sum, item) => sum + (item.expected_value || 0), 0),
    totalPaid: data.reduce((sum, item) => sum + (item.valor_pago || 0), 0),
    totalDifference: data.reduce((sum, item) => sum + (item.difference || 0), 0),
    underPaidCount: data.filter(item => (item.difference || 0) < 0).length,
    overPaidCount: data.filter(item => (item.difference || 0) > 0).length,
    correctPaidCount: data.filter(item => (item.difference || 0) === 0).length
  } : null;
  
  return {
    data,
    isLoading,
    error,
    refetch,
    summary,
    selectedParticipations,
    toggleParticipation,
    generateContestation: generateSelectedContestation,
    isGeneratingContestation: isPending
  };
}
