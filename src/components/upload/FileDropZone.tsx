
import { Button } from '@/components/ui/button';
import { FileUp, AlertCircle, FileText, Info } from 'lucide-react';
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
  hasFiles?: boolean;
};

/**
 * FileDropZone Component
 * 
 * Provides a drop zone for users to upload PDF documents, either medical guides (TISS)
 * or payment statements from health insurance companies.
 * 
 * @param type - The type of document to upload ('guia' or 'demonstrativo')
 * @param onFileChange - Function to handle file selection change events
 * @param disabled - Whether the component is disabled (e.g., during uploads)
 * @param hasFiles - Whether files of this type have already been added
 */
const FileDropZone = ({ type, onFileChange, disabled, hasFiles = false }: FileDropZoneProps) => {
  const isGuia = type === 'guia';
  const inputId = `${type}PdfInput`;

  return (
    <div 
      className={`flex flex-col items-center p-4 border border-dashed rounded-lg 
      ${disabled ? 'bg-muted/30 border-muted cursor-not-allowed' : 'hover:border-primary/50 transition-colors border-border cursor-pointer'} 
      ${isGuia ? 'hover:bg-medblue-600/5' : 'hover:bg-green-600/5'}
      ${hasFiles ? (isGuia ? 'bg-medblue-600/10' : 'bg-green-600/10') : ''}
      `}
      onClick={() => {
        if (!disabled) {
          document.getElementById(inputId)?.click();
        }
      }}
    >
      <input
        type="file"
        id={inputId}
        className="hidden"
        accept=".pdf"
        multiple
        onChange={onFileChange}
        disabled={disabled}
        aria-label={isGuia ? "Selecionar guias médicas em PDF" : "Selecionar demonstrativos em PDF"}
      />
      {isGuia ? (
        <FileUp className={`h-10 w-10 ${hasFiles ? 'text-medblue-600' : 'text-primary'} mb-2`} />
      ) : (
        <FileText className={`h-10 w-10 ${hasFiles ? 'text-green-600' : 'text-primary'} mb-2`} />
      )}
      <label
        htmlFor={inputId}
        className="text-center cursor-pointer"
      >
        <span className={`font-medium mb-1 block ${disabled ? 'text-muted-foreground' : ''}`}>
          {isGuia ? 'Guias TISS' : 'Demonstrativos de Pagamento'}
        </span>
        <span className="text-sm text-muted-foreground">
          {hasFiles ? 'Clique para adicionar mais' : 'Arraste ou clique para selecionar PDFs'}
        </span>
      </label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mt-2"
              tabIndex={0}
              type="button"
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Informações sobre {isGuia ? 'guias' : 'demonstrativos'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center" className="max-w-xs">
            <p>
              {isGuia 
                ? 'Envie PDFs das guias TISS contendo os procedimentos realizados. Os arquivos devem incluir informações como código do procedimento, beneficiário e médicos participantes.'
                : 'Envie PDFs dos demonstrativos de pagamento do plano de saúde. O sistema extrairá automaticamente valores pagos, códigos de procedimentos e glosas.'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {hasFiles && (
        <div className="mt-1 px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">
          Arquivos adicionados
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
