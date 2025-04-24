
import { supabase } from '@/integrations/supabase/client';
import { HistoryItem } from '@/components/history/data';
import { toast } from 'sonner';

/**
 * Busca o histórico de análises do usuário
 */
export async function fetchHistoryData(): Promise<HistoryItem[]> {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não está autenticado');
      toast.error('Você precisa estar autenticado para acessar o histórico');
      return [];
    }
    
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar histórico:', error);
      toast.error('Erro ao carregar histórico de análises');
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      date: formatDate(item.date),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
  } catch (error) {
    console.error('Erro ao processar histórico:', error);
    toast.error('Erro ao processar dados do histórico');
    return [];
  }
}

/**
 * Busca histórico filtrado por texto e datas
 */
export async function searchHistory(
  searchTerm: string,
  startDate?: string,
  endDate?: string
): Promise<HistoryItem[]> {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não está autenticado');
      toast.error('Você precisa estar autenticado para pesquisar o histórico');
      return [];
    }
    
    // Construir a query
    let query = supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id);
    
    // Adicionar filtro de texto se fornecido
    if (searchTerm && searchTerm.trim() !== '') {
      query = query.or(`description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%,hospital.ilike.%${searchTerm}%`);
    }
    
    // Adicionar filtros de data se fornecidos
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      // Adicionar um dia para incluir o dia final completo
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lt('date', nextDay.toISOString());
    }
    
    // Executar a query com ordenação
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao pesquisar histórico:', error);
      toast.error('Erro ao pesquisar histórico de análises');
      return [];
    }
    
    return data.map((item: any) => ({
      id: item.id,
      date: formatDate(item.date),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
  } catch (error) {
    console.error('Erro ao processar pesquisa de histórico:', error);
    toast.error('Erro ao processar pesquisa do histórico');
    return [];
  }
}

/**
 * Busca os detalhes de uma análise específica
 */
export async function fetchAnalysisDetails(analysisId: string) {
  try {
    // Verificar se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não está autenticado');
      toast.error('Você precisa estar autenticado para acessar detalhes da análise');
      return null;
    }
    
    // Buscar os dados da análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id) // Garantir que o usuário só veja suas próprias análises
      .single();
    
    if (analysisError) {
      console.error('Erro ao buscar detalhes da análise:', analysisError);
      toast.error('Erro ao carregar detalhes da análise');
      return null;
    }
    
    // Buscar os procedimentos relacionados
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId)
      .eq('user_id', user.id); // Garantir que o usuário só veja seus próprios procedimentos
    
    if (proceduresError) {
      console.error('Erro ao buscar procedimentos:', proceduresError);
      toast.error('Erro ao carregar procedimentos da análise');
      return null;
    }
    
    return {
      ...analysisData,
      procedimentos: proceduresData.map((proc: any) => ({
        id: proc.id,
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel,
        valorCBHPM: proc.valor_cbhpm,
        valorPago: proc.valor_pago,
        diferenca: proc.diferenca,
        pago: proc.pago,
        guia: proc.guia,
        beneficiario: proc.beneficiario,
        doctors: proc.doctors || []
      }))
    };
  } catch (error) {
    console.error('Erro ao processar detalhes da análise:', error);
    toast.error('Erro ao processar detalhes da análise');
    return null;
  }
}

/**
 * Formata a data para o formato DD/MM/AAAA
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString || '';
  }
}
