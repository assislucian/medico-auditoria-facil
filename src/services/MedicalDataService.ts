
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
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Note: This implementation is a temporary mock until the tables are created
      // For now, we'll create a row in analysis_results to track this payment statement
      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          file_name: `demonstrativo_${paymentStatement.periodo.replace(/\s+/g, '_')}`,
          file_type: 'demonstrativo',
          user_id: userId,
          summary: {
            totalProcedimentos: paymentStatement.totais.qtdProcedimentos,
            totalPago: paymentStatement.totais.total,
            totalGlosas: paymentStatement.totais.valorGlosas
          }
        })
        .select('id')
        .single();
        
      if (analysisError) throw new Error(analysisError.message);
      
      // Store the procedures in the procedures table
      // This is a simplified version until the proper schema is created
      const proceduresData = paymentStatement.procedimentos.map(proc => ({
        analysis_id: analysisData.id,
        user_id: userId,
        codigo: proc.codigoServico,
        procedimento: proc.descricaoServico,
        valor_pago: proc.valorLiberado,
        pago: proc.valorLiberado > 0,
        guia: proc.guia,
        beneficiario: proc.nome
      }));
      
      if (proceduresData.length > 0) {
        const { error: proceduresError } = await supabase
          .from('procedures')
          .insert(proceduresData);
          
        if (proceduresError) throw new Error(proceduresError.message);
      }
      
      return { success: true, id: analysisData.id };
      
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
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Get user profile for CRM data
      const userProfile = await this.getUserProfile(userId);

      // Note: This implementation is a temporary mock until the tables are created
      // For now, we'll create a row in analysis_results to track this guide
      const { data: analysisData, error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          file_name: `guia_${medicalGuide.numero}`,
          file_type: 'guia',
          numero: medicalGuide.numero,
          user_id: userId,
          summary: {
            totalProcedimentos: medicalGuide.procedimentos.length
          }
        })
        .select('id')
        .single();
        
      if (analysisError) throw new Error(analysisError.message);
      
      // Store each procedure as a row in the procedures table
      for (const proc of medicalGuide.procedimentos) {
        // Find the doctor who is the user
        const userCrm = userProfile?.crm;
        const userParticipation = userCrm ? 
          proc.participacoes.find(p => p.crm === userCrm) : 
          undefined;
        
        const { error: procError } = await supabase
          .from('procedures')
          .insert({
            analysis_id: analysisData.id,
            user_id: userId,
            codigo: proc.codigo,
            procedimento: proc.descricao,
            papel: userParticipation?.funcao || 'Não especificado',
            guia: medicalGuide.numero,
            beneficiario: medicalGuide.beneficiario.nome,
            doctors: proc.participacoes.map(p => ({
              code: p.crm,
              name: p.nome,
              role: p.funcao,
              startTime: p.dataInicio,
              endTime: p.dataFim,
              status: p.status
            }))
          });
          
        if (procError) throw new Error(procError.message);
      }
      
      return { success: true, id: analysisData.id };
      
    } catch (error: any) {
      console.error('Error saving medical guide:', error);
      return { success: false, error: error.message || 'Erro ao salvar guia médica' };
    }
  }
  
  /**
   * Get the current user's profile
   * @param userId User ID
   * @returns User profile
   */
  private static async getUserProfile(userId?: string): Promise<any> {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Exception in getUserProfile:', err);
      return null;
    }
  }
  
  /**
   * Retrieves all payment statements for the current user
   */
  static async getPaymentStatements(): Promise<PaymentStatementDetailed[]> {
    try {
      // This is a mock implementation until the proper tables are created
      const { data: analyses, error } = await supabase
        .from('analysis_results')
        .select(`
          *,
          procedures(*)
        `)
        .eq('file_type', 'demonstrativo')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our frontend model
      const statements: PaymentStatementDetailed[] = [];
      
      if (!analyses) return [];
      
      for (const analysis of analyses) {
        const procedures = analysis.procedures || [];
        
        const statement: PaymentStatementDetailed = {
          id: analysis.id,
          periodo: analysis.competencia || 'Período não especificado',
          nome: 'Nome do Médico', // We'd get this from profiles
          crm: 'CRM', // We'd get this from profiles
          cpf: 'CPF', // We'd get this from profiles
          procedimentos: Array.isArray(procedures) ? procedures.map((proc: any) => ({
            lote: proc.guia?.split('-')[0] || '',
            conta: proc.id,
            guia: proc.guia || '',
            data: new Date(proc.created_at).toLocaleDateString('pt-BR'),
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
          })) : [],
          totais: {
            consultas: 0,
            honorarios: this.sumProcedureValues(procedures, 'valor_pago'),
            total: this.sumProcedureValues(procedures, 'valor_pago'),
            qtdProcedimentos: Array.isArray(procedures) ? procedures.length : 0,
            glosas: this.countUnpaidProcedures(procedures),
            valorGlosas: this.calculateTotalGlosas(procedures)
          },
          glosas: []
        };
        
        statements.push(statement);
      }
      
      return statements;
      
    } catch (error) {
      console.error('Error fetching payment statements:', error);
      return [];
    }
  }
  
  // Helper methods to avoid await in non-async arrow functions
  private static sumProcedureValues(procedures: any[] | null, field: string): number {
    if (!procedures || !Array.isArray(procedures)) return 0;
    return procedures.reduce((sum: number, proc: any) => sum + (proc[field] || 0), 0);
  }
  
  private static countUnpaidProcedures(procedures: any[] | null): number {
    if (!procedures || !Array.isArray(procedures)) return 0;
    return procedures.filter((p: any) => !p.pago).length;
  }
  
  private static calculateTotalGlosas(procedures: any[] | null): number {
    if (!procedures || !Array.isArray(procedures)) return 0;
    return procedures.reduce((sum: number, proc: any) => 
      sum + ((proc.valor_cbhpm || 0) - (proc.valor_pago || 0)), 0);
  }
  
  /**
   * Retrieves all medical guides for the current user
   */
  static async getMedicalGuides(): Promise<MedicalGuideDetailed[]> {
    try {
      // This is a mock implementation until the proper tables are created
      const { data: analyses, error } = await supabase
        .from('analysis_results')
        .select(`
          *,
          procedures(*)
        `)
        .eq('file_type', 'guia')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match our frontend model
      const guides: MedicalGuideDetailed[] = [];
      
      if (!analyses) return [];
      
      for (const analysis of analyses) {
        const procedures = analysis.procedures || [];
        
        if (!Array.isArray(procedures)) continue;
        
        // Group procedures by guide number
        const proceduresByGuide: Record<string, any[]> = {};
        
        for (const proc of procedures) {
          if (!proceduresByGuide[proc.guia]) {
            proceduresByGuide[proc.guia] = [];
          }
          proceduresByGuide[proc.guia].push(proc);
        }
        
        // Create a guide for each unique guide number
        for (const guideNumber of Object.keys(proceduresByGuide)) {
          const procs = proceduresByGuide[guideNumber];
          
          const guide: MedicalGuideDetailed = {
            numero: guideNumber,
            dataExecucao: procs[0]?.created_at ? new Date(procs[0].created_at).toLocaleDateString('pt-BR') : '',
            beneficiario: {
              codigo: '',
              nome: procs[0]?.beneficiario || 'Beneficiário não especificado'
            },
            prestador: {
              codigo: '',
              nome: 'Prestador não especificado'
            },
            procedimentos: procs.map((proc: any) => ({
              codigo: proc.codigo,
              descricao: proc.procedimento,
              dataExecucao: proc.created_at ? new Date(proc.created_at).toLocaleDateString('pt-BR') : '',
              quantidade: 1,
              status: proc.pago ? 'Fechada' : 'Aberta',
              valorPago: proc.valor_pago,
              participacoes: proc.doctors ? proc.doctors.map((doctor: any) => ({
                funcao: doctor.role,
                crm: doctor.code,
                nome: doctor.name,
                dataInicio: doctor.startTime,
                dataFim: doctor.endTime,
                status: doctor.status
              })) : []
            }))
          };
          
          guides.push(guide);
        }
      }
      
      return guides;
      
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
      // Get the guide from analyses
      const { data: analysis, error: analysisError } = await supabase
        .from('analysis_results')
        .select(`
          *,
          procedures(*)
        `)
        .eq('id', guideId)
        .single();
        
      if (analysisError) throw analysisError;
      
      if (!analysis || !analysis.procedures) {
        throw new Error("Analysis or procedures not found");
      }
      
      const guideNumber = analysis.numero;
      const procedures = Array.isArray(analysis.procedures) ? analysis.procedures : [];
      
      // Find procedures from payment statements with matching guide number
      const { data: paymentProcs, error: paymentError } = await supabase
        .from('procedures')
        .select('*')
        .eq('guia', guideNumber)
        .neq('file_type', 'guia');
        
      if (paymentError) throw paymentError;
      
      // Transform guide data to our frontend model
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
        procedimentos: procedures.map((proc: any) => ({
          codigo: proc.codigo,
          descricao: proc.procedimento,
          dataExecucao: proc.created_at ? new Date(proc.created_at).toLocaleDateString('pt-BR') : '',
          quantidade: 1,
          status: proc.pago ? 'Fechada' : 'Aberta',
          valorPago: proc.valor_pago,
          participacoes: proc.doctors ? proc.doctors.map((doctor: any) => ({
            funcao: doctor.role,
            crm: doctor.code,
            nome: doctor.name,
            dataInicio: doctor.startTime,
            dataFim: doctor.endTime,
            status: doctor.status
          })) : []
        }))
      };
      
      // Transform payment procedures data to our frontend model
      const demonstrativoProcs: ProcedimentoDemonstrativo[] = paymentProcs ? paymentProcs.map((proc: any) => ({
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
      })) : [];
      
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
