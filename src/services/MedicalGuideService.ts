
import { supabase } from '@/integrations/supabase/client';
import { MedicalGuideDetailed } from '@/types';
import { getUserProfile } from './utils';

/**
 * Service responsible for handling medical guide processing
 */
export class MedicalGuideService {
  /**
   * Extracts data from a medical guide PDF
   * @param file PDF file containing medical guide
   * @returns Processed medical guide or error
   */
  static async processMedicalGuide(file: File): Promise<{ data?: MedicalGuideDetailed, error?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
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
   * Saves a processed medical guide to the database
   */
  static async saveMedicalGuide(medicalGuide: MedicalGuideDetailed): Promise<{ success: boolean, id?: string, error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const userProfile = await getUserProfile(userId);
      
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
      
      for (const proc of medicalGuide.procedimentos) {
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
   * Retrieves all medical guides for the current user
   */
  static async getMedicalGuides(): Promise<MedicalGuideDetailed[]> {
    try {
      const { data: analyses, error } = await supabase
        .from('analysis_results')
        .select(`
          *,
          procedures(*)
        `)
        .eq('file_type', 'guia')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      const guides: MedicalGuideDetailed[] = [];
      
      if (!analyses) return [];
      
      for (const analysis of analyses) {
        const procedures = analysis.procedures || [];
        
        if (!Array.isArray(procedures)) continue;
        
        const proceduresByGuide: Record<string, any[]> = {};
        
        for (const proc of procedures) {
          if (!proceduresByGuide[proc.guia]) {
            proceduresByGuide[proc.guia] = [];
          }
          proceduresByGuide[proc.guia].push(proc);
        }
        
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
            procedimentos: procs.map((proc: any) => {
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
          
          guides.push(guide);
        }
      }
      
      return guides;
      
    } catch (error) {
      console.error('Error fetching medical guides:', error);
      return [];
    }
  }
}
