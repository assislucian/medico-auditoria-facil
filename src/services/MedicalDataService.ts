
import { supabase } from '@/integrations/supabase/client';
import { 
  PaymentStatementDetailed, 
  MedicalGuideDetailed,
  ComparisonResult,
  ProcedimentoDemonstrativo,
  ProcedimentoGuia
} from '@/types';

/**
 * Service responsible for handling medical data processing
 */
export class MedicalDataService {
  /**
   * Extracts data from a payment statement PDF
   * @param file PDF file containing payment statement
   * @returns Processed payment statement or error
   */
  static async processPaymentStatement(file: File): Promise<{ data?: PaymentStatementDetailed, error?: string }> {
    try {
      // Create form data for the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the Supabase edge function to process the payment statement
      const { data, error } = await supabase.functions.invoke('process-payment-statement', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      return { data: data as PaymentStatementDetailed };
      
    } catch (error: any) {
      console.error('Error processing payment statement:', error);
      return { error: error.message || 'Erro ao processar demonstrativo de pagamento' };
    }
  }
  
  /**
   * Extracts data from a medical guide PDF
   * @param file PDF file containing medical guide
   * @returns Processed medical guide or error
   */
  static async processMedicalGuide(file: File): Promise<{ data?: MedicalGuideDetailed, error?: string }> {
    try {
      // Create form data for the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Call the Supabase edge function to process the medical guide
      const { data, error } = await supabase.functions.invoke('process-medical-guide', {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      return { data: data as MedicalGuideDetailed };
      
    } catch (error: any) {
      console.error('Error processing medical guide:', error);
      return { error: error.message || 'Erro ao processar guia médica' };
    }
  }
  
  /**
   * Saves a processed payment statement to the database
   * @param paymentStatement Processed payment statement
   * @returns Result of the save operation
   */
  static async savePaymentStatement(paymentStatement: PaymentStatementDetailed): Promise<{ success: boolean, id?: string, error?: string }> {
    try {
      // First, save the payment statement header
      const { data: statementData, error: statementError } = await supabase
        .from('payment_statements')
        .insert({
          periodo: paymentStatement.periodo,
          nome: paymentStatement.nome,
          crm: paymentStatement.crm,
          cpf: paymentStatement.cpf,
          total_consultas: paymentStatement.totais.consultas,
          total_honorarios: paymentStatement.totais.honorarios,
          total_geral: paymentStatement.totais.total,
          qtd_procedimentos: paymentStatement.totais.qtdProcedimentos,
          qtd_glosas: paymentStatement.totais.glosas,
          valor_glosas: paymentStatement.totais.valorGlosas
        })
        .select('id')
        .single();
        
      if (statementError) throw new Error(statementError.message);
      
      const statementId = statementData.id;
      
      // Then save all procedures
      const proceduresData = paymentStatement.procedimentos.map(proc => ({
        statement_id: statementId,
        lote: proc.lote,
        conta: proc.conta,
        guia: proc.guia,
        data: proc.data,
        carteira: proc.carteira,
        nome: proc.nome,
        acomodacao: proc.acomodacao,
        codigo_servico: proc.codigoServico,
        descricao_servico: proc.descricaoServico,
        quantidade: proc.quantidade,
        valor_apresentado: proc.valorApresentado,
        valor_liberado: proc.valorLiberado,
        pro_rata: proc.proRata,
        glosa: proc.glosa,
        tipo: proc.tipo
      }));
      
      const { error: proceduresError } = await supabase
        .from('statement_procedures')
        .insert(proceduresData);
        
      if (proceduresError) throw new Error(proceduresError.message);
      
      // Finally, save glosas if any
      if (paymentStatement.glosas && paymentStatement.glosas.length > 0) {
        const glosaData = paymentStatement.glosas.map(glosa => ({
          statement_id: statementId,
          conta: glosa.conta,
          guia: glosa.guia,
          data: glosa.data,
          nome: glosa.nome,
          codigo_servico: glosa.codigoServico,
          descricao_servico: glosa.descricaoServico,
          codigo: glosa.codigo,
          descricao: glosa.descricao,
          valor: glosa.valor
        }));
        
        const { error: glosaError } = await supabase
          .from('statement_glosas')
          .insert(glosaData);
          
        if (glosaError) throw new Error(glosaError.message);
      }
      
      return { success: true, id: statementId };
      
    } catch (error: any) {
      console.error('Error saving payment statement:', error);
      return { success: false, error: error.message || 'Erro ao salvar demonstrativo de pagamento' };
    }
  }
  
  /**
   * Saves a processed medical guide to the database
   * @param medicalGuide Processed medical guide
   * @returns Result of the save operation
   */
  static async saveMedicalGuide(medicalGuide: MedicalGuideDetailed): Promise<{ success: boolean, id?: string, error?: string }> {
    try {
      // First, save the guide header
      const { data: guideData, error: guideError } = await supabase
        .from('medical_guides')
        .insert({
          numero: medicalGuide.numero,
          data_execucao: medicalGuide.dataExecucao,
          beneficiario_codigo: medicalGuide.beneficiario.codigo,
          beneficiario_nome: medicalGuide.beneficiario.nome,
          prestador_codigo: medicalGuide.prestador.codigo,
          prestador_nome: medicalGuide.prestador.nome
        })
        .select('id')
        .single();
        
      if (guideError) throw new Error(guideError.message);
      
      const guideId = guideData.id;
      
      // Then save all procedures
      for (const proc of medicalGuide.procedimentos) {
        // Save procedure
        const { data: procData, error: procError } = await supabase
          .from('guide_procedures')
          .insert({
            guide_id: guideId,
            codigo: proc.codigo,
            descricao: proc.descricao,
            data_execucao: proc.dataExecucao,
            quantidade: proc.quantidade,
            status: proc.status,
            valor_pago: proc.valorPago
          })
          .select('id')
          .single();
          
        if (procError) throw new Error(procError.message);
        
        // Save all participations for this procedure
        const participations = proc.participacoes.map(part => ({
          procedure_id: procData.id,
          funcao: part.funcao,
          crm: part.crm,
          nome: part.nome,
          data_inicio: part.dataInicio,
          data_fim: part.dataFim,
          status: part.status
        }));
        
        const { error: partError } = await supabase
          .from('guide_participations')
          .insert(participations);
          
        if (partError) throw new Error(partError.message);
      }
      
      return { success: true, id: guideId };
      
    } catch (error: any) {
      console.error('Error saving medical guide:', error);
      return { success: false, error: error.message || 'Erro ao salvar guia médica' };
    }
  }
  
  /**
   * Retrieves all payment statements for the current user
   */
  static async getPaymentStatements(): Promise<PaymentStatementDetailed[]> {
    try {
      const { data, error } = await supabase
        .from('payment_statements')
        .select(`
          *,
          statement_procedures(*),
          statement_glosas(*)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our frontend model
      return data.map(statement => ({
        id: statement.id,
        periodo: statement.periodo,
        nome: statement.nome,
        crm: statement.crm,
        cpf: statement.cpf,
        procedimentos: statement.statement_procedures.map((proc: any) => ({
          lote: proc.lote,
          conta: proc.conta,
          guia: proc.guia,
          data: proc.data,
          carteira: proc.carteira,
          nome: proc.nome,
          acomodacao: proc.acomodacao,
          codigoServico: proc.codigo_servico,
          descricaoServico: proc.descricao_servico,
          quantidade: proc.quantidade,
          valorApresentado: proc.valor_apresentado,
          valorLiberado: proc.valor_liberado,
          proRata: proc.pro_rata,
          glosa: proc.glosa,
          tipo: proc.tipo
        })),
        totais: {
          consultas: statement.total_consultas,
          honorarios: statement.total_honorarios,
          total: statement.total_geral,
          qtdProcedimentos: statement.qtd_procedimentos,
          glosas: statement.qtd_glosas,
          valorGlosas: statement.valor_glosas
        },
        glosas: statement.statement_glosas.map((glosa: any) => ({
          conta: glosa.conta,
          guia: glosa.guia,
          data: glosa.data,
          nome: glosa.nome,
          codigoServico: glosa.codigo_servico,
          descricaoServico: glosa.descricao_servico,
          codigo: glosa.codigo,
          descricao: glosa.descricao,
          valor: glosa.valor
        }))
      }));
      
    } catch (error) {
      console.error('Error fetching payment statements:', error);
      return [];
    }
  }
  
  /**
   * Retrieves all medical guides for the current user
   */
  static async getMedicalGuides(): Promise<MedicalGuideDetailed[]> {
    try {
      const { data, error } = await supabase
        .from('medical_guides')
        .select(`
          *,
          guide_procedures(
            *,
            guide_participations(*)
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our frontend model
      return data.map(guide => ({
        numero: guide.numero,
        dataExecucao: guide.data_execucao,
        beneficiario: {
          codigo: guide.beneficiario_codigo,
          nome: guide.beneficiario_nome
        },
        prestador: {
          codigo: guide.prestador_codigo,
          nome: guide.prestador_nome
        },
        procedimentos: guide.guide_procedures.map((proc: any) => ({
          codigo: proc.codigo,
          descricao: proc.descricao,
          dataExecucao: proc.data_execucao,
          quantidade: proc.quantidade,
          status: proc.status,
          valorPago: proc.valor_pago,
          participacoes: proc.guide_participations.map((part: any) => ({
            funcao: part.funcao,
            crm: part.crm,
            nome: part.nome,
            dataInicio: part.data_inicio,
            dataFim: part.data_fim,
            status: part.status
          }))
        }))
      }));
      
    } catch (error) {
      console.error('Error fetching medical guides:', error);
      return [];
    }
  }
  
  /**
   * Compares a medical guide with payment statements to find discrepancies
   * @param guideId ID of the medical guide to compare
   */
  static async compareGuideWithStatements(guideId: string): Promise<ComparisonResult | null> {
    try {
      // First get the guide with all its procedures and participations
      const { data: guideData, error: guideError } = await supabase
        .from('medical_guides')
        .select(`
          *,
          guide_procedures(
            *,
            guide_participations(*)
          )
        `)
        .eq('id', guideId)
        .single();
        
      if (guideError) throw guideError;
      
      // Transform guide data to our frontend model
      const guide: MedicalGuideDetailed = {
        numero: guideData.numero,
        dataExecucao: guideData.data_execucao,
        beneficiario: {
          codigo: guideData.beneficiario_codigo,
          nome: guideData.beneficiario_nome
        },
        prestador: {
          codigo: guideData.prestador_codigo,
          nome: guideData.prestador_nome
        },
        procedimentos: guideData.guide_procedures.map((proc: any) => ({
          codigo: proc.codigo,
          descricao: proc.descricao,
          dataExecucao: proc.data_execucao,
          quantidade: proc.quantidade,
          status: proc.status,
          valorPago: proc.valor_pago,
          participacoes: proc.guide_participations.map((part: any) => ({
            funcao: part.funcao,
            crm: part.crm,
            nome: part.nome,
            dataInicio: part.data_inicio,
            dataFim: part.data_fim,
            status: part.status
          }))
        }))
      };
      
      // Now fetch all statements that might have procedures related to this guide
      const { data: stmtProcs, error: stmtError } = await supabase
        .from('statement_procedures')
        .select(`
          *,
          payment_statements(*)
        `)
        .eq('guia', guide.numero);
        
      if (stmtError) throw stmtError;
      
      // Transform statement procedures data to our frontend model
      const demonstrativoProcs: ProcedimentoDemonstrativo[] = stmtProcs.map((proc: any) => ({
        lote: proc.lote,
        conta: proc.conta,
        guia: proc.guia,
        data: proc.data,
        carteira: proc.carteira,
        nome: proc.nome,
        acomodacao: proc.acomodacao,
        codigoServico: proc.codigo_servico,
        descricaoServico: proc.descricao_servico,
        quantidade: proc.quantidade,
        valorApresentado: proc.valor_apresentado,
        valorLiberado: proc.valor_liberado,
        proRata: proc.pro_rata,
        glosa: proc.glosa,
        tipo: proc.tipo
      }));
      
      // Now compare procedures to find discrepancies
      const discrepancias = [];
      
      for (const procGuia of guide.procedimentos) {
        // Find matching procedures in the payment statement
        const matchingProcs = demonstrativoProcs.filter(
          p => p.codigoServico === procGuia.codigo
        );
        
        if (matchingProcs.length === 0) {
          // Procedure not found in any payment statement
          discrepancias.push({
            tipo: 'nao_pago' as const,
            procedimentoGuia: procGuia,
            descricao: `O procedimento ${procGuia.codigo} - ${procGuia.descricao} não foi encontrado em nenhum demonstrativo.`
          });
          continue;
        }
        
        // Check if the procedure was paid correctly
        const valorTotalPago = matchingProcs.reduce((sum, p) => sum + p.valorLiberado, 0);
        
        // Here we would check against CBHPM value, but for now we'll just check if any payment was made
        if (valorTotalPago === 0) {
          discrepancias.push({
            tipo: 'nao_pago' as const,
            procedimentoGuia: procGuia,
            procedimentoDemonstrativo: matchingProcs[0],
            descricao: `O procedimento ${procGuia.codigo} - ${procGuia.descricao} não teve pagamento liberado.`
          });
        } else {
          // TODO: Compare with CBHPM value to check if payment was correct
          // For now, we'll just check if the procedure has any glosa
          const hasGlosa = matchingProcs.some(p => p.glosa > 0);
          
          if (hasGlosa) {
            discrepancias.push({
              tipo: 'pago_parcialmente' as const,
              procedimentoGuia: procGuia,
              procedimentoDemonstrativo: matchingProcs.find(p => p.glosa > 0),
              descricao: `O procedimento ${procGuia.codigo} - ${procGuia.descricao} teve glosa aplicada.`
            });
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
