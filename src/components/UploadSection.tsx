
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import FileDropZone from './upload/FileDropZone';
import FileList from './upload/FileList';
import UploadProgress from './upload/UploadProgress';
import ComparisonView from './ComparisonView';

type FileType = 'guia' | 'demonstrativo';

const UploadSection = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<{name: string, type: FileType, file: File}[]>([]);
  const [showComparison, setShowComparison] = useState(false);

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

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setShowComparison(false);
  };

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
    
    try {
      // Simular o processamento dos arquivos
      for (let i = 0; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i * 10);
      }

      toast.success('Arquivos analisados com sucesso!');
      setShowComparison(true);
    } catch (error) {
      toast.error('Erro ao processar os arquivos');
      console.error('Erro no processamento:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Upload de Documentos</CardTitle>
          <CardDescription>
            Envie suas guias médicas e demonstrativos para análise automática
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
          
          <UploadProgress
            progress={progress}
            show={uploading}
          />
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={selectedFiles.length === 0 || uploading}
            onClick={processFiles}
          >
            {uploading ? 'Processando...' : 'Analisar Documentos'}
          </Button>
        </CardFooter>
      </Card>

      {showComparison && <ComparisonView />}
    </div>
  );
};

export default UploadSection;

