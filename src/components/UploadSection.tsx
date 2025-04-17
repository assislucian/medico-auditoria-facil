
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ComparisonView from './ComparisonView';
import UploadAlerts from './upload/UploadAlerts';
import ProcessingSection from './upload/ProcessingSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import FileList from './upload/FileList';
import UploadInstructions from './upload/UploadInstructions';
import UploadDropzoneArea from './upload/UploadDropzoneArea';
import UploadActionButtons from './upload/UploadActionButtons';
import UploadContextAlerts from './upload/UploadContextAlerts';

/**
 * UploadSection Component
 * 
 * Componente principal para gestão de uploads, processamento e exibição de resultados.
 * Gerencia todo o fluxo desde a seleção de arquivos até a exibição dos resultados de comparação.
 */
const UploadSection = () => {
  const {
    isUploading,
    progress,
    files,
    showComparison,
    processingStage,
    processingMsg,
    hasFile,
    hasGuiaDemonstrativoPair,
    hasValidFilesForProcessing,
    hasInvalidFiles,
    handleFileChange,
    removeFile,
    resetFiles,
    processUploadedFiles,
    setShowComparison
  } = useFileUpload();

  /**
   * Função principal de processamento para analisar os arquivos enviados
   * Processa os dados dos PDFs e salva no Supabase
   */
  const processFilesHandler = async () => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo para upload');
      return;
    }

    if (!hasValidFilesForProcessing()) {
      toast.error('Não há arquivos válidos para processar');
      return;
    }

    // Verificar se há arquivos inválidos
    const invalidFiles = files.filter(f => f.status === 'invalid');
    if (invalidFiles.length > 0) {
      toast.warning('Existem arquivos inválidos que serão ignorados na análise');
    }

    setShowComparison(false);
    
    const success = await processUploadedFiles();
    
    if (!success) {
      toast.error('Ocorreu um erro durante o processamento');
    }
  };

  // Determinar se deve mostrar alertas explicando o processo
  const showGuideAlert = !hasFile('guia') && hasFile('demonstrativo');
  const showDemonstrativoAlert = hasFile('guia') && !hasFile('demonstrativo');

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
          <UploadInstructions />
          
          <UploadDropzoneArea 
            handleFileChange={handleFileChange}
            isUploading={isUploading}
            hasFile={hasFile}
          />
          
          <UploadContextAlerts 
            showGuideAlert={showGuideAlert}
            showDemonstrativoAlert={showDemonstrativoAlert}
          />
          
          <FileList
            files={files}
            onRemove={removeFile}
            disabled={isUploading}
          />
          
          <ProcessingSection
            uploading={isUploading}
            progress={progress}
            processingStage={processingStage}
            processingMsg={processingMsg}
          />
          
          <UploadAlerts
            hasGuiaDemonstrativoPair={hasGuiaDemonstrativoPair()}
            hasInvalidFiles={hasInvalidFiles()}
            hasFile={hasFile}
            hasValidFilesForProcessing={hasValidFilesForProcessing()}
          />
        </CardContent>
        <CardFooter>
          <UploadActionButtons 
            isUploading={isUploading}
            filesLength={files.length}
            hasGuiaDemonstrativoPair={hasGuiaDemonstrativoPair()}
            hasValidFilesForProcessing={hasValidFilesForProcessing()}
            onProcess={processFilesHandler}
            onReset={resetFiles}
          />
        </CardFooter>
      </Card>

      {showComparison && <ComparisonView />}
    </div>
  );
};

export default UploadSection;
