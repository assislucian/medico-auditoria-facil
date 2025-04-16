
import { Button } from '@/components/ui/button';
import { FileUp, FileText, Trash2 } from 'lucide-react';

type FileType = 'guia' | 'demonstrativo';

type FileListProps = {
  files: { name: string; type: FileType; file: File }[];
  onRemove: (index: number) => void;
  disabled: boolean;
};

const FileList = ({ files, onRemove, disabled }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Arquivos selecionados ({files.length})</h4>
      <div className="space-y-2 max-h-60 overflow-auto pr-2">
        {files.map((file, index) => (
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
              onClick={() => onRemove(index)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Remover arquivo</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;

