
/**
 * historyService.ts
 * 
 * Serviço para gerenciamento do histórico de análises.
 * Busca, filtra e exporta registros históricos de análises feitas.
 */

import { supabase } from '@/integrations/supabase/client';
import { HistoryItem, HistoryFilters } from '@/components/history/data';
import { toast } from 'sonner';
import { format, parse, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Busca dados do histórico de análises do usuário
 * @returns Array de itens do histórico
 */
export async function fetchHistoryData(): Promise<HistoryItem[]> {
  try {
    console.log('Buscando dados do histórico...');
    
    // Verifica a autenticação do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      throw new Error('Autenticação necessária para acessar o histórico');
    }
    
    // Buscar dados do histórico no Supabase
    const { data: historyData, error: historyError } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (historyError) {
      console.error('Erro ao buscar histórico:', historyError);
      throw historyError;
    }
    
    console.log('Dados brutos do histórico:', historyData);
    
    // Transformar dados do Supabase para o formato da UI
    const transformedData: HistoryItem[] = historyData.map(item => ({
      id: item.id,
      date: format(new Date(item.date), 'dd/MM/yyyy'),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
    
    console.log('Dados transformados do histórico:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Erro no serviço de histórico:', error);
    toast.error('Erro ao carregar histórico');
    return [];
  }
}

/**
 * Busca histórico com filtros aplicados
 * @param searchTerm Termo para busca textual
 * @param startDate Data inicial (formato YYYY-MM-DD)
 * @param endDate Data final (formato YYYY-MM-DD)
 * @param status Status para filtrar
 * @returns Array de itens do histórico filtrados
 */
export async function searchHistory(
  searchTerm?: string,
  startDate?: string,
  endDate?: string,
  status?: string
): Promise<HistoryItem[]> {
  try {
    console.log('Buscando histórico com filtros:', { searchTerm, startDate, endDate, status });
    
    // Verifica a autenticação do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      throw new Error('Autenticação necessária para acessar o histórico');
    }
    
    // Iniciar consulta base
    let query = supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id);
    
    // Aplicar filtros
    if (searchTerm) {
      query = query.or(`description.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%,hospital.ilike.%${searchTerm}%`);
    }
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      // Adiciona um dia à data final para incluir todo o dia
      const nextDay = new Date(endDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query = query.lt('date', nextDay.toISOString().split('T')[0]);
    }
    
    if (status && status !== 'todos') {
      query = query.eq('status', status);
    }
    
    // Executar consulta
    const { data: historyData, error: historyError } = await query.order('date', { ascending: false });
    
    if (historyError) {
      console.error('Erro ao buscar histórico com filtros:', historyError);
      throw historyError;
    }
    
    console.log('Dados filtrados do histórico:', historyData);
    
    // Transformar dados do Supabase para o formato da UI
    const transformedData: HistoryItem[] = historyData.map(item => ({
      id: item.id,
      date: format(new Date(item.date), 'dd/MM/yyyy'),
      type: item.type,
      description: item.description,
      procedimentos: item.procedimentos || 0,
      glosados: item.glosados || 0,
      status: item.status
    }));
    
    console.log('Dados transformados e filtrados do histórico:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Erro na busca de histórico com filtros:', error);
    toast.error('Erro ao filtrar histórico');
    return [];
  }
}

/**
 * Busca detalhes de uma análise pelo ID
 * @param analysisId ID da análise
 * @returns Dados detalhados da análise
 */
export async function fetchAnalysisDetails(analysisId: string) {
  try {
    console.log('Buscando detalhes da análise:', analysisId);
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Erro de autenticação:', authError);
      throw new Error('Autenticação necessária para acessar os detalhes');
    }
    
    // Buscar dados da análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();
    
    if (analysisError) {
      console.error('Erro ao buscar análise:', analysisError);
      throw analysisError;
    }
    
    // Buscar procedimentos relacionados
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      console.error('Erro ao buscar procedimentos:', proceduresError);
      throw proceduresError;
    }
    
    console.log('Detalhes da análise recuperados:', { analysis: analysisData, procedures: proceduresData });
    
    // Retornar dados combinados
    return {
      analysis: analysisData,
      procedures: proceduresData
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da análise:', error);
    toast.error('Erro ao carregar detalhes');
    return null;
  }
}

/**
 * Formatar data no formato brasileiro
 * @param dateString String da data para formatar
 * @returns Data formatada ou string original se inválida
 */
export function formatDateBR(dateString: string): string {
  try {
    if (!dateString) return '';
    
    // Tenta interpretar como ISO date
    const date = new Date(dateString);
    
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    }
    
    // Tenta interpretar outros formatos comuns
    const formats = ['yyyy-MM-dd', 'dd/MM/yyyy', 'MM/dd/yyyy'];
    
    for (const formatStr of formats) {
      const parsedDate = parse(dateString, formatStr, new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
      }
    }
    
    return dateString; // Retorna original se não conseguir formatar
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString;
  }
}

/**
 * Exporta os dados de histórico para Excel
 * @param items Itens do histórico para exportar
 * @param filename Nome do arquivo a ser exportado
 */
export function exportToExcel(items: HistoryItem[], filename: string = 'historico-analises') {
  try {
    // Importação dinâmica do xlsx
    import('xlsx').then(XLSX => {
      // Preparar dados para exportação
      const exportData = items.map(item => ({
        Data: item.date,
        Tipo: item.type,
        Descrição: item.description,
        Procedimentos: item.procedimentos,
        Glosados: item.glosados,
        Status: item.status
      }));
      
      // Criar workbook e adicionar worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Histórico');
      
      // Exportar para Excel
      XLSX.writeFile(wb, `${filename}.xlsx`);
      
      toast.success('Histórico exportado com sucesso', {
        description: `O arquivo ${filename}.xlsx foi baixado`
      });
    }).catch(error => {
      console.error('Erro ao carregar biblioteca xlsx:', error);
      toast.error('Erro ao exportar histórico');
    });
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    toast.error('Erro ao exportar histórico');
  }
}
