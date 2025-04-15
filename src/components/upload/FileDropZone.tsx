
import { Button } from '@/components/ui/button';
import { FileUp, AlertCircle, FileText } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FileDropZoneProps = {
  type: 'guia' | 'demonstrativo';
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
};

const FileDropZone = ({ type, onFileChange, disabled }: FileDropZoneProps) => {
  const isGuia = type === 'guia';
  const inputId = `${type}PdfInput`;

  return (
    <div className="flex flex-col items-center p-4 border border-dashed rounded-lg border-border hover:border-primary/50 transition-colors">
      <input
        type="file"
        id={inputId}
        className="hidden"
        accept=".pdf"
        multiple
        onChange={onFileChange}
        disabled={disabled}
      />
      {isGuia ? (
        <FileUp className="h-10 w-10 text-primary mb-2" />
      ) : (
        <FileText className="h-10 w-10 text-primary mb-2" />
      )}
      <label
        htmlFor={inputId}
        className="text-center cursor-pointer"
      >
        <span className="font-medium mb-1 block">
          {isGuia ? 'Guias Médicas' : 'Demonstrativos'}
        </span>
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
              {isGuia 
                ? 'Envie PDFs das guias TISS contendo os procedimentos realizados.'
                : 'Envie PDFs dos demonstrativos de pagamento do plano de saúde.'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FileDropZone;

