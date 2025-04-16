
import { Button } from '@/components/ui/button';
import { FileUp, FileText, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FileType = 'guia' | 'demonstrativo';

type FileListProps = {
  files: { name: string; type: FileType; file: File }[];
  onRemove: (index: number) => void;
  disabled: boolean;
};

/**
 * FileList Component
 * 
 * Displays a list of uploaded files with their type (guia or demonstrativo) and
 * provides options to preview or remove each file.
 * 
 * @param files - Array of uploaded files with metadata
 * @param onRemove - Function to handle file removal
 * @param disabled - Whether the buttons are disabled (during processing)
 */
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
      <div className="space-y-2 max-h-60 overflow-auto pr-2">
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
                <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file.type === 'guia' ? 'Guia Médica' : 'Demonstrativo'} • {(file.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePreview(file.file)}
                disabled={disabled}
                title="Visualizar arquivo"
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
