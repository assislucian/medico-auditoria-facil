
import { FileWithStatus, ProcessMode } from '@/types/upload';
import { supabase } from '@/integrations/supabase/client';

/**
 * Salva os resultados da análise no banco de dados
 * @param files Arquivos processados
 * @param processMode Modo de processamento
 * @param extractedData Dados extraídos dos arquivos
 */
export async function saveAnalysisToDatabase(
  files: FileWithStatus[],
  processMode: ProcessMode, 
  extractedData: any
): Promise<boolean> {
  try {
    // Obter o ID do usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não está autenticado');
      return false;
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
      return false;
    }
    
    // 2. Inserir procedimentos relacionados
    if (extractedData.procedimentos && extractedData.procedimentos.length > 0) {
      const proceduresForInsert = extractedData.procedimentos.map((proc: any) => ({
        analysis_id: analysisData.id,
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
        .from('procedure_results')
        .insert(proceduresForInsert);
        
      if (proceduresError) {
        console.error('Erro ao inserir procedimentos:', proceduresError);
        return false;
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
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    return false;
  }
}
