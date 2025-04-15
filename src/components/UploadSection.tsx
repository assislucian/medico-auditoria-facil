
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, AlertCircle, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FileType = 'guia' | 'demonstrativo';

const UploadSection = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<{name: string, type: FileType}[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: FileType) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files).map(file => ({
        name: file.name,
        type
      }));
      
      setSelectedFiles([...selectedFiles, ...fileArray]);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const simulateUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error('Selecione pelo menos um arquivo para upload');
      return;
    }

    setUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            toast.success('Arquivos enviados com sucesso!');
            setSelectedFiles([]);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upload de Documentos</CardTitle>
        <CardDescription>
          Envie suas guias médicas e demonstrativos para análise automática
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 border border-dashed rounded-lg border-border hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="guiaPdfInput"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={(e) => handleFileChange(e, 'guia')}
              disabled={uploading}
            />
            <FileUp className="h-10 w-10 text-primary mb-2" />
            <label
              htmlFor="guiaPdfInput"
              className="text-center cursor-pointer"
            >
              <span className="font-medium mb-1 block">Guias Médicas</span>
              <span className="text-sm text-muted-foreground">
                Arraste ou clique para selecionar PDFs
              </span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="sr-only">Informações</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Envie PDFs das guias TISS contendo os procedimentos realizados.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex flex-col items-center p-4 border border-dashed rounded-lg border-border hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="demonstrativoPdfInput"
              className="hidden"
              accept=".pdf"
              multiple
              onChange={(e) => handleFileChange(e, 'demonstrativo')}
              disabled={uploading}
            />
            <FileText className="h-10 w-10 text-primary mb-2" />
            <label
              htmlFor="demonstrativoPdfInput"
              className="text-center cursor-pointer"
            >
              <span className="font-medium mb-1 block">Demonstrativos</span>
              <span className="text-sm text-muted-foreground">
                Arraste ou clique para selecionar PDFs
              </span>
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="sr-only">Informações</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Envie PDFs dos demonstrativos de pagamento do plano de saúde.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Selected files list */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Arquivos selecionados ({selectedFiles.length})</h4>
            <div className="space-y-2 max-h-60 overflow-auto pr-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 bg-secondary/50 rounded-md"
                >
                  <div className="flex items-center">
                    <div className={`p-1.5 rounded mr-2 ${file.type === 'guia' ? 'bg-medblue-600/20' : 'bg-green-600/20'}`}>
                      {file.type === 'guia' ? (
                        <FileUp className="h-4 w-4 text-medblue-400" />
                      ) : (
                        <FileText className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    <div className="truncate max-w-[200px] sm:max-w-xs">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type === 'guia' ? 'Guia Médica' : 'Demonstrativo'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Remover arquivo</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Upload progress */}
        {uploading && (
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Enviando arquivos...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={selectedFiles.length === 0 || uploading}
          onClick={simulateUpload}
        >
          {uploading ? 'Enviando...' : 'Enviar Documentos'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UploadSection;
