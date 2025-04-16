
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import FileDropZone from './upload/FileDropZone';
import FileList from './upload/FileList';
import ComparisonView from './ComparisonView';
import UploadAlerts from './upload/UploadAlerts';
import ProcessingSection from './upload/ProcessingSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import { processFiles } from '@/services/uploadService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * UploadSection Component
 * 
 * Main component for handling file uploads, processing, and displaying results.
 * Manages the entire workflow from file selection to displaying comparison results.
 */
const UploadSection = () => {
  const {
    uploading,
    setUploading,
    progress,
    setProgress,
    selectedFiles,
    showComparison,
    setShowComparison,
    processingStage,
    setProcessingStage,
    processingMsg,
    setProcessingMsg,
    hasFile,
    hasGuiaDemonstrativoPair,
    hasInvalidFiles,
    handleFileChange,
    removeFile,
    resetFiles
  } = useFileUpload();

  /**
   * Main processing function for analyzing the uploaded files
   * Simulates the extraction and processing of data from PDFs
   */
  const processFilesHandler = async () => {
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
    setShowComparison(false);
    
    const success = await processFiles(
      selectedFiles,
      setProgress,
      setProcessingStage,
      setProcessingMsg
    );
    
    if (success) {
      setShowComparison(true);
    }
    
    setTimeout(() => {
      setUploading(false);
      setProgress(0);
      setProcessingStage('idle');
    }, 1500);
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
              onFileChange={handleFileChange}
              disabled={uploading}
              hasFiles={hasFile('guia')}
            />
            <FileDropZone
              type="demonstrativo"
              onFileChange={handleFileChange}
              disabled={uploading}
              hasFiles={hasFile('demonstrativo')}
            />
          </div>
          
          <FileList
            files={selectedFiles}
            onRemove={removeFile}
            disabled={uploading}
          />
          
          <ProcessingSection
            uploading={uploading}
            progress={progress}
            processingStage={processingStage}
            processingMsg={processingMsg}
          />
          
          <UploadAlerts
            hasGuiaDemonstrativoPair={hasGuiaDemonstrativoPair()}
            hasInvalidFiles={hasInvalidFiles()}
            hasFile={hasFile}
          />
        </CardContent>
        <CardFooter>
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              disabled={selectedFiles.length === 0 || uploading || !hasGuiaDemonstrativoPair()}
              onClick={processFilesHandler}
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
                      onClick={resetFiles}
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
};

export default UploadSection;
