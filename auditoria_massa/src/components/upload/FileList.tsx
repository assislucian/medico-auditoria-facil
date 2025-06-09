
import { Button } from '@/components/ui/button';
import { FileUp, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { FileType, FileStatus, FileWithStatus } from '@/types/upload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FileListProps = {
  files: FileWithStatus[];
  onRemove: (index: number) => void;
  disabled: boolean;
};

const FileList = ({ files, onRemove, disabled }: FileListProps) => {
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  
  if (files.length === 0) return null;

  const handlePreview = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setPreviewFile(fileUrl);
  };

  const closePreview = () => {
    if (previewFile) {
      URL.revokeObjectURL(previewFile);
      setPreviewFile(null);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Arquivos selecionados ({files.length})</h4>
      <div className="space-y-2 max-h-72 overflow-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className={`flex items-center justify-between p-2 rounded-md 
            ${file.type === 'guia' ? 'bg-medblue-600/5' : 'bg-green-600/5'}`}
          >
            <div className="flex items-center">
              <div className={`p-1.5 rounded mr-2 ${file.type === 'guia' ? 'bg-medblue-600/20' : 'bg-green-600/20'}`}>
                {file.type === 'guia' ? (
                  <FileUp className="h-4 w-4 text-medblue-400" />
                ) : (
                  <FileText className="h-4 w-4 text-green-400" />
                )}
              </div>
              <div className="truncate max-w-[140px] sm:max-w-[200px] md:max-w-xs">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                  {file.status === 'invalid' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Formato não reconhecido ou ilegível</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">
                    {file.type === 'guia' ? 'Guia Médica' : 'Demonstrativo'} • {(file.file.size / 1024).toFixed(1)} KB
                  </p>
                  {file.status === 'processing' && (
                    <Badge variant="outline" className="text-[10px] py-0 h-4">
                      Processando
                    </Badge>
                  )}
                  {file.status === 'valid' && (
                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      Válido
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePreview(file.file)}
                disabled={disabled}
                title="Visualizar arquivo"
                type="button"
              >
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Visualizar {file.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                disabled={disabled}
                title="Remover arquivo"
                type="button"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Remover {file.name}</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!previewFile} onOpenChange={() => closePreview()}>
        <DialogContent className="max-w-3xl h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Visualização do documento</DialogTitle>
          </DialogHeader>
          {previewFile && (
            <iframe
              src={previewFile}
              className="w-full h-full"
              title="Visualização do PDF"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileList;
