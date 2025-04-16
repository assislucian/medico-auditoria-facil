
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import FileDropZone from './upload/FileDropZone';
import FileList from './upload/FileList';
import UploadProgress from './upload/UploadProgress';
import ComparisonView from './ComparisonView';

type FileType = 'guia' | 'demonstrativo';
type ProcessingStage = 'idle' | 'extracting' | 'analyzing' | 'comparing' | 'complete';

/**
 * UploadSection Component
 * 
 * Main component for handling file uploads, processing, and displaying results.
 * Manages the entire workflow from file selection to displaying comparison results.
 */
const UploadSection = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<{name: string, type: FileType, file: File}[]>([]);
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

      const fileArray = files.map(file => ({
        name: file.name,
        type,
        file
      }));
      
      setSelectedFiles([...selectedFiles, ...fileArray]);
      e.target.value = '';
    }
  };

  /**
   * Removes a file from the selected files list
   */
  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setShowComparison(false);
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
    const hasGuia = selectedFiles.some(f => f.type === 'guia');
    const hasDemonstrativo = selectedFiles.some(f => f.type === 'demonstrativo');

    if (!hasGuia || !hasDemonstrativo) {
      toast.error('É necessário enviar pelo menos uma guia e um demonstrativo');
      return;
    }

    setUploading(true);
    setProgress(0);
    setProcessingStage('extracting');
    
    try {
      // Simular estágio de extração de dados dos PDFs
      setProcessingMsg('Extraindo dados dos documentos...');
      for (let i = 0; i <= 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i * 8);
      }
      
      // Simular estágio de análise de procedimentos
      setProcessingStage('analyzing');
      setProcessingMsg('Identificando procedimentos na tabela CBHPM...');
      for (let i = 3; i <= 6; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i * 10);
      }
      
      // Simular estágio de comparação de valores
      setProcessingStage('comparing');
      setProcessingMsg('Comparando valores pagos com referência CBHPM...');
      for (let i = 6; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i * 10);
      }
      
      setProcessingStage('complete');
      toast.success('Arquivos analisados com sucesso!');
      setShowComparison(true);
    } catch (error) {
      toast.error('Erro ao processar os arquivos');
      console.error('Erro no processamento:', error);
    } finally {
      setUploading(false);
      setProgress(0);
      setProcessingStage('idle');
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
            />
            <FileDropZone
              type="demonstrativo"
              onFileChange={(e) => handleFileChange(e, 'demonstrativo')}
              disabled={uploading}
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
                  'Processamento concluído'
                ) : (
                  <>
                    <span className="animate-pulse inline-block h-2 w-2 rounded-full bg-medblue-500"></span>
                    Processando documentos
                  </>
                )}
              </h5>
              <div className="text-sm text-muted-foreground mb-3">{processingMsg}</div>
              <UploadProgress
                progress={progress}
                show={true}
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
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={selectedFiles.length === 0 || uploading || !hasGuiaDemonstrativoPair()}
            onClick={processFiles}
          >
            {uploading ? 'Processando...' : 'Analisar Documentos'}
          </Button>
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
    return hasFile('guia') && hasFile('demonstrativo');
  }
};

export default UploadSection;
