import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import FileDropZone from './upload/FileDropZone';
import FileList from './upload/FileList';
import ComparisonView from './ComparisonView';
import UploadAlerts from './upload/UploadAlerts';
import ProcessingSection from './upload/ProcessingSection';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          {/* Explicação do processo */}
          <div className="text-sm text-muted-foreground mb-4">
            <p className="mb-2">
              <strong>Como funciona:</strong> Você pode enviar guias médicas, demonstrativos de pagamento, ou ambos.
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>Guias médicas:</strong> Contêm os procedimentos realizados e servem como comprovante do serviço.</li>
              <li><strong>Demonstrativos:</strong> Documentos de pagamento que detalham os valores pagos pelo plano de saúde.</li>
              <li><strong>Análise completa:</strong> Quando ambos são enviados, o sistema compara os valores pagos com a tabela CBHPM.</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileDropZone
              type="guia"
              onFileChange={handleFileChange}
              disabled={isUploading}
              hasFiles={hasFile('guia')}
            />
            <FileDropZone
              type="demonstrativo"
              onFileChange={handleFileChange}
              disabled={isUploading}
              hasFiles={hasFile('demonstrativo')}
            />
          </div>
          
          {/* Alertas explicativos baseados no que o usuário fez upload */}
          {showGuideAlert && (
            <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você enviou apenas demonstrativos. O sistema irá extrair os valores pagos, mas não poderá verificar 
                detalhes dos procedimentos ou comparar com a tabela CBHPM. Para uma análise completa, adicione também guias médicas.
              </AlertDescription>
            </Alert>
          )}
          
          {showDemonstrativoAlert && (
            <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você enviou apenas guias médicas. O sistema irá extrair os procedimentos realizados, mas não poderá 
                verificar os valores pagos ou detectar glosas. Para uma análise completa, adicione também demonstrativos de pagamento.
              </AlertDescription>
            </Alert>
          )}
          
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
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              disabled={files.length === 0 || isUploading || !hasValidFilesForProcessing()}
              onClick={processFilesHandler}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                hasGuiaDemonstrativoPair() ? 'Analisar e Comparar Documentos' : 'Processar Documentos'
              )}
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={resetFiles}
                      disabled={files.length === 0 || isUploading}
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
