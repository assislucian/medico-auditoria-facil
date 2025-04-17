
import { FileWithStatus, ProcessMode } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';

/**
 * Salva os resultados da análise no banco de dados
 * @param files Arquivos processados
 * @param processMode Modo de processamento
 * @param extractedData Dados extraídos dos arquivos
 * @returns Objeto com sucesso e ID da análise
 */
export async function saveAnalysisToDatabase(
  files: FileWithStatus[],
  processMode: ProcessMode, 
  extractedData: any
): Promise<{success: boolean, analysisId: string | null}> {
  try {
    // Obter o ID do usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não está autenticado');
      return {success: false, analysisId: null};
    }
    
    // 1. Criar um registro de análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        user_id: user.id,
        file_name: files.map(f => f.name).join(', '),
        file_type: processMode,
        hospital: extractedData.demonstrativoInfo?.hospital || null,
        competencia: extractedData.demonstrativoInfo?.competencia || null,
        numero: extractedData.demonstrativoInfo?.numero || null,
        summary: {
          totalCBHPM: extractedData.totais?.valorCBHPM || 0,
          totalPago: extractedData.totais?.valorPago || 0,
          totalDiferenca: extractedData.totais?.diferenca || 0,
          procedimentosTotal: extractedData.procedimentos?.length || 0,
          procedimentosNaoPagos: extractedData.totais?.procedimentosNaoPagos || 0
        },
        status: 'processed'
      })
      .select('id')
      .single();
    
    if (analysisError) {
      console.error('Erro ao inserir análise:', analysisError);
      return {success: false, analysisId: null};
    }
    
    // 2. Inserir procedimentos relacionados
    if (extractedData.procedimentos && extractedData.procedimentos.length > 0) {
      const proceduresForInsert = extractedData.procedimentos.map((proc: any) => ({
        analysis_id: analysisData.id,
        user_id: user.id,  // Adicionando user_id para facilitar consultas
        codigo: proc.codigo,
        procedimento: proc.procedimento,
        papel: proc.papel,
        valor_cbhpm: proc.valorCBHPM,
        valor_pago: proc.valorPago,
        diferenca: proc.diferenca,
        pago: proc.pago,
        guia: proc.guia,
        beneficiario: proc.beneficiario,
        doctors: proc.doctors
      }));
      
      const { error: proceduresError } = await supabase
        .from('procedures')  // Usando a tabela procedures em vez de procedure_results
        .insert(proceduresForInsert);
        
      if (proceduresError) {
        console.error('Erro ao inserir procedimentos:', proceduresError);
        // Não falharemos toda a operação por erro em procedimentos
      }
    }
    
    // 3. Também criar um registro na tabela de histórico para exibição na lista
    const { error: historyError } = await supabase
      .from('analysis_history')
      .insert({
        user_id: user.id,
        type: processMode === 'complete' ? 'Guia + Demonstrativo' : 
              processMode === 'guia-only' ? 'Guia' : 'Demonstrativo',
        hospital: extractedData.demonstrativoInfo?.hospital || null,
        description: `${extractedData.demonstrativoInfo?.hospital || 'Hospital'} - ${extractedData.demonstrativoInfo?.competencia || 'Competência não informada'}`,
        procedimentos: extractedData.procedimentos?.length || 0,
        glosados: extractedData.totais?.procedimentosNaoPagos || 0,
        status: 'Analisado'
      });
      
    if (historyError) {
      console.error('Erro ao inserir no histórico:', historyError);
      // Não falharemos a operação se apenas o histórico falhar
    }
    
    return {success: true, analysisId: analysisData.id};
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    return {success: false, analysisId: null};
  }
}

/**
 * Recupera uma análise pelo ID
 * @param analysisId ID da análise
 * @returns Dados da análise ou null se não encontrado
 */
export async function getAnalysisById(analysisId: string) {
  try {
    // Buscar o registro de análise
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('id', analysisId)
      .single();
    
    if (analysisError || !analysisData) {
      console.error('Erro ao buscar análise:', analysisError);
      return null;
    }
    
    // Buscar os procedimentos relacionados
    const { data: proceduresData, error: proceduresError } = await supabase
      .from('procedures')
      .select('*')
      .eq('analysis_id', analysisId);
    
    if (proceduresError) {
      console.error('Erro ao buscar procedimentos:', proceduresError);
      return null;
    }

    // Acesso seguro ao objeto summary com tipagem correta
    const summary = analysisData.summary as Record<string, any> || {};
    
    // Formatar os dados no formato esperado pelo frontend
    return {
      demonstrativoInfo: {
        numero: analysisData.numero || `DM${Math.floor(Math.random() * 1000000)}`,
        competencia: analysisData.competencia || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        hospital: analysisData.hospital || 'Hospital não especificado',
        data: new Date(analysisData.created_at).toLocaleDateString('pt-BR'),
        beneficiario: proceduresData[0]?.beneficiario || 'Não especificado'
      },
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
      })),
      totais: {
        valorCBHPM: summary.totalCBHPM || 0,
        valorPago: summary.totalPago || 0,
        diferenca: summary.totalDiferenca || 0,
        procedimentosNaoPagos: summary.procedimentosNaoPagos || 0
      }
    };
  } catch (error) {
    console.error('Erro ao recuperar análise:', error);
    return null;
  }
}

/**
 * Recupera histórico de análises do usuário atual
 * @returns Lista de análises do usuário
 */
export async function getUserAnalysisHistory() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não está autenticado');
      return [];
    }
    
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar histórico:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
}
