
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
import { useState } from 'react';
import { Link } from 'react-router-dom';

const UploadSection = () => {
  const {
    isUploading,
    progress,
    files,
    hasFile,
    hasGuiaDemonstrativoPair,
    hasValidFilesForProcessing,
    hasInvalidFiles,
    removeFile,
    resetFiles,
    processUploadedFiles,
    showComparison,
    processingStage,
    processingMsg,
  } = useFileUpload();

  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handler para os dropzones
  const handleFileChangeByType = async (type, fileList) => {
    setError(null);
    await useFileUpload().handleFileChangeByType(type, fileList);
  };

  const handleProcess = async () => {
    setError(null);

    if (!hasFile('guia') && !hasFile('demonstrativo')) {
      setError('Selecione pelo menos um tipo de arquivo antes de processar.');
      toast.error('Selecione pelo menos um tipo de documento');
      return;
    }
    const ok = await processUploadedFiles();
    setShowSuccess(ok);
    if (!ok) {
      setError('Erro ao processar os arquivos.');
    }
  };

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
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
              {error}
            </div>
          )}
          <UploadInstructions />
          <UploadDropzoneArea
            handleFileChangeByType={handleFileChangeByType}
            isUploading={isUploading}
            hasFile={hasFile}
          />

          <UploadContextAlerts
            showGuideAlert={showGuideAlert}
            showDemonstrativoAlert={showDemonstrativoAlert}
          />

          <FileList files={files} onRemove={removeFile} disabled={isUploading} />

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
            onProcess={handleProcess}
            onReset={resetFiles}
          />
        </CardFooter>
      </Card>
      {showSuccess && (
        <div className="mt-4 rounded border border-green-300 bg-green-50 text-green-800 px-4 py-3 text-sm flex flex-col gap-2">
          <span>Processamento concluído com sucesso.</span>
          <Link to="/compare" className="underline font-medium text-green-800">Ver Comparativo</Link>
        </div>
      )}
      {showComparison && <ComparisonView />}
    </div>
  );
};

export default UploadSection;
