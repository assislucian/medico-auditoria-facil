
import { useState } from 'react';
import { FileWithStatus, FileType, FileStatus, ProcessingStage } from '@/types/upload';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [processingMsg, setProcessingMsg] = useState('Preparando arquivos...');
  const [processingMode, setProcessingMode] = useState<'complete' | 'guia-only' | 'demonstrativo-only' | null>(null);
  const [crmRegistrado, setCrmRegistrado] = useState<string>('');

  // Carregar o CRM do usuário ao inicializar o hook
  useState(() => {
    loadUserCrm();
  });

  /**
   * Carrega o CRM do usuário a partir do perfil
   */
  const loadUserCrm = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('crm')
        .eq('id', user.id)
        .single();
      
      if (profile?.crm) {
        console.log('CRM carregado:', profile.crm);
        setCrmRegistrado(profile.crm);
      }
    } catch (error) {
      console.error('Erro ao carregar CRM:', error);
    }
  };

  /**
   * Verifica se há arquivos do tipo especificado
   */
  const hasFile = (type: FileType): boolean => {
    return selectedFiles.some(f => f.type === type);
  };

  /**
   * Verifica se há pelo menos uma guia e um demonstrativo válidos
   */
  const hasGuiaDemonstrativoPair = (): boolean => {
    const validGuias = selectedFiles.filter(f => f.type === 'guia' && f.status !== 'invalid').length > 0;
    const validDemos = selectedFiles.filter(f => f.type === 'demonstrativo' && f.status !== 'invalid').length > 0;
    return validGuias && validDemos;
  };

  /**
   * Verifica se há algum arquivo válido para processamento
   */
  const hasValidFilesForProcessing = (): boolean => {
    return selectedFiles.some(f => f.status !== 'invalid');
  };

  /**
   * Verifica se há algum arquivo inválido
   */
  const hasInvalidFiles = (): boolean => {
    return selectedFiles.some(f => f.status === 'invalid');
  };

  /**
   * Trata o upload de arquivos, validando e adicionando à lista
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Validar tipos de arquivo
      const invalidFiles = files.filter(file => file.type !== 'application/pdf');
      if (invalidFiles.length > 0) {
        toast.error('Por favor, envie apenas arquivos PDF');
        return;
      }

      const fileArray: FileWithStatus[] = files.map(file => ({
        name: file.name,
        type,
        file,
        status: 'processing' as FileStatus
      }));
      
      // Simular validação de arquivos
      setTimeout(() => {
        const updatedFiles = fileArray.map(file => {
          // Validação real do PDF - para demo, apenas verifica o nome
          const isValid = file.name.toLowerCase().includes('invalid') ? false : true;
          return { ...file, status: isValid ? 'valid' as FileStatus : 'invalid' as FileStatus };
        });
        
        setSelectedFiles(prev => {
          const newFiles = [...prev];
          updatedFiles.forEach(file => {
            const existingIndex = newFiles.findIndex(f => f.name === file.name && f.type === file.type);
            if (existingIndex >= 0) {
              newFiles[existingIndex] = file;
            } else {
              newFiles.push(file);
            }
          });
          return newFiles;
        });
        
        const invalidCount = updatedFiles.filter(f => f.status === 'invalid').length;
        if (invalidCount > 0) {
          toast.warning(`${invalidCount} ${invalidCount === 1 ? 'arquivo não pôde' : 'arquivos não puderam'} ser processado. Verifique o formato.`);
        }
      }, 1500);
      
      setSelectedFiles(prev => [...prev, ...fileArray]);
      e.target.value = '';
    }
  };

  /**
   * Remove um arquivo da lista
   */
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    if (showComparison) {
      setShowComparison(false);
      toast.info("A comparação foi resetada devido à remoção de arquivos.");
    }
  };

  /**
   * Limpa todos os arquivos
   */
  const resetFiles = () => {
    setSelectedFiles([]);
    setShowComparison(false);
    setProcessingMode(null);
  };

  /**
   * Determina o modo de processamento com base nos arquivos selecionados
   */
  const determineProcessingMode = (): 'complete' | 'guia-only' | 'demonstrativo-only' => {
    const hasValidGuias = selectedFiles.some(f => f.type === 'guia' && f.status === 'valid');
    const hasValidDemos = selectedFiles.some(f => f.type === 'demonstrativo' && f.status === 'valid');
    
    if (hasValidGuias && hasValidDemos) return 'complete';
    if (hasValidGuias) return 'guia-only';
    return 'demonstrativo-only';
  };

  return {
    uploading,
    setUploading,
    progress,
    setProgress,
    selectedFiles,
    setSelectedFiles,
    showComparison,
    setShowComparison,
    processingStage,
    setProcessingStage,
    processingMsg,
    setProcessingMsg,
    processingMode,
    setProcessingMode,
    crmRegistrado,
    setCrmRegistrado,
    hasFile,
    hasGuiaDemonstrativoPair,
    hasValidFilesForProcessing,
    hasInvalidFiles,
    handleFileChange,
    removeFile,
    resetFiles,
    determineProcessingMode
  };
}
