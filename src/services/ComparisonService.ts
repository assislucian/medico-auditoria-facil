
import { supabase } from '@/integrations/supabase/client';
import { ComparisonResult, MedicalGuideDetailed, ProcedimentoDemonstrativo } from '@/types';

/**
 * Service responsible for comparing medical guides with payment statements
 */
export class ComparisonService {
  /**
   * Compares a medical guide with payment statements to find discrepancies
   * @param guideId ID of the medical guide to compare
   */
  static async compareGuideWithStatements(guideId: string): Promise<ComparisonResult | null> {
    try {
      // First, retrieve the analysis result with its procedures
      const { data: analysis, error: analysisError } = await supabase
        .from('analysis_results')
        .select(`
          *,
          procedures(*)
        `)
        .eq('id', guideId)
        .single();
        
      if (analysisError) throw analysisError;
      
      if (!analysis) {
        throw new Error("Analysis not found");
      }
      
      const guideNumber = analysis.numero;
      // Ensure procedures is properly handled as an array
      const procedures = Array.isArray(analysis.procedures) ? analysis.procedures : [];
      
      // Now get payment procedures linked to this guide number
      const { data: paymentProcs, error: paymentError } = await supabase
        .from('procedures')
        .select('*')
        .eq('guia', guideNumber)
        .neq('file_type', 'guia');
        
      if (paymentError) throw paymentError;
      
      // Transform the data into our domain models
      const guide: MedicalGuideDetailed = {
        numero: guideNumber,
        dataExecucao: procedures[0]?.created_at ? new Date(procedures[0].created_at).toLocaleDateString('pt-BR') : '',
        beneficiario: {
          codigo: '',
          nome: procedures[0]?.beneficiario || 'Beneficiário não especificado'
        },
        prestador: {
          codigo: '',
          nome: 'Prestador não especificado'
        },
        procedimentos: procedures.map((proc: any) => {
          // Safely handle doctor participations
          const safeParticipacoes = Array.isArray(proc.doctors) 
            ? proc.doctors.map((doctor: any) => ({
                funcao: doctor.role || '',
                crm: doctor.code || '',
                nome: doctor.name || '',
                dataInicio: doctor.startTime || '',
                dataFim: doctor.endTime || '',
                status: doctor.status || ''
              }))
            : [];
            
          return {
            codigo: proc.codigo,
            descricao: proc.procedimento,
            dataExecucao: proc.created_at ? new Date(proc.created_at).toLocaleDateString('pt-BR') : '',
            quantidade: 1,
            status: proc.pago ? 'Fechada' : 'Aberta',
            valorPago: proc.valor_pago || 0,
            participacoes: safeParticipacoes
          };
        })
      };
      
      // Ensure payment procedures array is handled safely
      const paymentProcsArray = Array.isArray(paymentProcs) ? paymentProcs : [];
      
      // Transform payment procedures to domain model
      const demonstrativoProcs: ProcedimentoDemonstrativo[] = paymentProcsArray.map((proc: any) => ({
        lote: proc.guia?.split('-')[0] || '',
        conta: proc.id,
        guia: proc.guia || '',
        data: proc.created_at ? new Date(proc.created_at).toLocaleDateString('pt-BR') : '',
        carteira: '',
        nome: proc.beneficiario || '',
        acomodacao: '',
        codigoServico: proc.codigo,
        descricaoServico: proc.procedimento,
        quantidade: 1,
        valorApresentado: proc.valor_cbhpm || 0,
        valorLiberado: proc.valor_pago || 0,
        proRata: 0,
        glosa: (proc.valor_cbhpm || 0) - (proc.valor_pago || 0),
        tipo: 'honorario'
      }));
      
      // Define the discrepancy type directly to avoid excessive type instantiation
      type SimpleDiscrepancy = {
        tipo: 'nao_pago' | 'pago_parcialmente' | 'funcao_incorreta' | 'outro';
        procedimentoGuia: {
          codigo: string;
          descricao: string;
          dataExecucao: string;
          quantidade: number;
          status: string;
          valorPago?: number;
          participacoes: Array<{
            funcao: string;
            crm: string;
            nome: string;
            dataInicio: string;
            dataFim: string;
            status: string;
          }>;
        };
        procedimentoDemonstrativo?: ProcedimentoDemonstrativo;
        descricao: string;
      };
      
      // Find discrepancies between the guide and payment statements
      const discrepancias: SimpleDiscrepancy[] = [];
      
      for (const procGuia of guide.procedimentos) {
        const matchingProcs = demonstrativoProcs.filter(
          p => p.codigoServico === procGuia.codigo
        );
        
        if (matchingProcs.length === 0) {
          discrepancias.push({
            tipo: 'nao_pago',
            procedimentoGuia: procGuia,
            descricao: `O procedimento ${procGuia.codigo} - ${procGuia.descricao} não foi encontrado em nenhum demonstrativo.`
          });
          continue;
        }
        
        const valorTotalPago = matchingProcs.reduce((sum, p) => sum + p.valorLiberado, 0);
        
        if (valorTotalPago === 0) {
          discrepancias.push({
            tipo: 'nao_pago',
            procedimentoGuia: procGuia,
            procedimentoDemonstrativo: matchingProcs[0],
            descricao: `O procedimento ${procGuia.codigo} - ${procGuia.descricao} não teve pagamento liberado.`
          });
        } else {
          const hasGlosa = matchingProcs.some(p => p.glosa > 0);
          
          if (hasGlosa) {
            const glosaProc = matchingProcs.find(p => p.glosa > 0);
            if (glosaProc) {
              discrepancias.push({
                tipo: 'pago_parcialmente',
                procedimentoGuia: procGuia,
                procedimentoDemonstrativo: glosaProc,
                descricao: `O procedimento ${procGuia.codigo} - ${procGuia.descricao} teve glosa aplicada.`
              });
            }
          }
        }
      }
      
      return {
        guia: guide,
        demonstrativo: demonstrativoProcs,
        discrepancias
      };
      
    } catch (error) {
      console.error('Error comparing guide with statements:', error);
      return null;
    }
  }
}
