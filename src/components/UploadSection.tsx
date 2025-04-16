import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import FileDropZone from './upload/FileDropZone';
import FileList from './upload/FileList';
import UploadProgress from './upload/UploadProgress';
import ComparisonView from './ComparisonView';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FileType = 'guia' | 'demonstrativo';
type ProcessingStage = 'idle' | 'extracting' | 'analyzing' | 'comparing' | 'complete';
type FileStatus = 'valid' | 'invalid' | 'processing';

interface FileWithStatus {
  name: string;
  type: FileType;
  file: File;
  status?: FileStatus;
}

/**
 * UploadSection Component
 * 
 * Main component for handling file uploads, processing, and displaying results.
 * Manages the entire workflow from file selection to displaying comparison results.
 */
const UploadSection = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [processingMsg, setProcessingMsg] = useState('Preparando arquivos...');
  
  /**
   * Handles file selection from FileDropZone components
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Validate file types
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
      
      // Simulate file validation
      setTimeout(() => {
        const updatedFiles = fileArray.map(file => {
          // Randomly mark some files as invalid for demonstration
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
      
      setSelectedFiles([...selectedFiles, ...fileArray]);
      e.target.value = '';
    }
  };

  /**
   * Removes a file from the selected files list
   */
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    if (showComparison) {
      setShowComparison(false);
      toast.info("A comparação foi resetada devido à remoção de arquivos.");
    }
  };

  /**
   * Main processing function for analyzing the uploaded files
   * Simulates the extraction and processing of data from PDFs
   */
  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Selecione pelo menos um arquivo para upload');
      return;
    }

    // Verificar se temos pelo menos uma guia e um demonstrativo
    const hasGuia = selectedFiles.some(f => f.type === 'guia' && f.status !== 'invalid');
    const hasDemonstrativo = selectedFiles.some(f => f.type === 'demonstrativo' && f.status !== 'invalid');

    if (!hasGuia || !hasDemonstrativo) {
      toast.error('É necessário enviar pelo menos uma guia válida e um demonstrativo válido');
      return;
    }

    // Check if any files are invalid
    const invalidFiles = selectedFiles.filter(f => f.status === 'invalid');
    if (invalidFiles.length > 0) {
      toast.warning('Existem arquivos inválidos que serão ignorados na análise');
    }

    setUploading(true);
    setProgress(0);
    setProcessingStage('extracting');
    setShowComparison(false);
    
    try {
      // Simular estágio de extração de dados dos PDFs
      setProcessingMsg('Extraindo dados dos documentos...');
      for (let i = 1; i <= 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // Simular estágio de análise de procedimentos
      setProcessingStage('analyzing');
      setProcessingMsg('Identificando procedimentos e consultando tabela CBHPM 2015...');
      for (let i = 31; i <= 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // Simular estágio de comparação de valores
      setProcessingStage('comparing');
      setProcessingMsg('Comparando valores pagos com referência CBHPM e calculando diferenças...');
      for (let i = 61; i <= 95; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // Finalizar processamento
      setProgress(100);
      setProcessingStage('complete');
      setProcessingMsg('Processamento concluído com sucesso!');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Análise concluída com sucesso!', {
        icon: <CheckCircle className="h-4 w-4" />,
        description: 'Os resultados da comparação estão disponíveis abaixo.'
      });
      
      setShowComparison(true);
    } catch (error) {
      console.error('Erro no processamento:', error);
      toast.error('Erro ao processar os arquivos', {
        description: 'Por favor, tente novamente ou contate o suporte.'
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        setProcessingStage('idle');
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload de Documentos</CardTitle>
          <CardDescription>
            Envie suas guias médicas e demonstrativos para análise automática com referência CBHPM 2015
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileDropZone
              type="guia"
              onFileChange={(e) => handleFileChange(e, 'guia')}
              disabled={uploading}
              hasFiles={hasFile('guia')}
            />
            <FileDropZone
              type="demonstrativo"
              onFileChange={(e) => handleFileChange(e, 'demonstrativo')}
              disabled={uploading}
              hasFiles={hasFile('demonstrativo')}
            />
          </div>
          
          <FileList
            files={selectedFiles}
            onRemove={removeFile}
            disabled={uploading}
          />
          
          {uploading && (
            <div className="rounded-lg border p-4 bg-muted/30">
              <h5 className="font-medium flex items-center gap-2 mb-2">
                {processingStage === 'complete' ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Processamento concluído
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    Processando documentos
                  </span>
                )}
              </h5>
              <div className="text-sm text-muted-foreground mb-3">{processingMsg}</div>
              <UploadProgress
                progress={progress}
                show={true}
                stage={processingStage}
              />
            </div>
          )}
          
          {!uploading && selectedFiles.length > 0 && !hasGuiaDemonstrativoPair() && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 p-3 text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Lembrete:</span> Para realizar uma análise completa, você precisa enviar pelo menos 
                {!hasFile('guia') && " uma guia médica"} 
                {!hasFile('guia') && !hasFile('demonstrativo') && " e "} 
                {!hasFile('demonstrativo') && " um demonstrativo de pagamento"}.
              </div>
            </div>
          )}
          
          {selectedFiles.length > 0 && hasInvalidFiles() && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 p-3 text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Atenção:</span> Alguns arquivos podem estar em formato não reconhecido ou serem ilegíveis.
                Arquivos marcados como inválidos serão ignorados durante o processamento.
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              disabled={selectedFiles.length === 0 || uploading || !hasGuiaDemonstrativoPair()}
              onClick={processFiles}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : 'Analisar Documentos'}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedFiles([]);
                        setShowComparison(false);
                      }}
                      disabled={selectedFiles.length === 0 || uploading}
                    >
                      Limpar Arquivos
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove todos os arquivos selecionados</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {showComparison && <ComparisonView />}
    </div>
  );
  
  /**
   * Helper function to check if there's at least one file of the specified type
   */
  function hasFile(type: FileType): boolean {
    return selectedFiles.some(f => f.type === type);
  }
  
  /**
   * Helper function to check if we have at least one guia and one demonstrativo
   */
  function hasGuiaDemonstrativoPair(): boolean {
    const validGuias = selectedFiles.filter(f => f.type === 'guia' && f.status !== 'invalid').length > 0;
    const validDemos = selectedFiles.filter(f => f.type === 'demonstrativo' && f.status !== 'invalid').length > 0;
    return validGuias && validDemos;
  }
  
  /**
   * Helper function to check if any files are marked as invalid
   */
  function hasInvalidFiles(): boolean {
    return selectedFiles.some(f => f.status === 'invalid');
  }
};

export default UploadSection;
