
/**
 * FileDropZone.tsx
 * 
 * Componente de área de upload para arrastar e soltar arquivos.
 * Suporta upload específico por tipo de arquivo (guias ou demonstrativos).
 */

import { useState, useRef } from 'react';
import { FileText, Upload, X, CheckCircle2 } from 'lucide-react';
import { FileType } from '@/types/upload';

interface FileDropZoneProps {
  type: FileType;
  onDropFiles: (type: FileType, files: FileList) => Promise<void>;
  disabled?: boolean;
  hasFiles?: boolean;
}

/**
 * Componente para área de upload de arquivos
 */
const FileDropZone = ({
  type,
  onDropFiles,
  disabled = false,
  hasFiles = false
}: FileDropZoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determinar título e descrição com base no tipo
  const title = type === 'guia' 
    ? 'Guias TISS (Médicas)' 
    : 'Demonstrativos de Pagamento';
  
  const description = type === 'guia'
    ? 'Arraste arquivos PDF das guias médicas'
    : 'Arraste arquivos PDF dos demonstrativos';

  // Manipuladores de eventos para arrastar e soltar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onDropFiles(type, e.dataTransfer.files);
    }
  };
  
  // Manipulador para clique no botão de upload
  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  // Manipulador para seleção de arquivos via input
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onDropFiles(type, e.target.files);
    }
  };

  // Classes condicionais
  const boxClasses = `
    relative 
    rounded-lg 
    border-2 
    border-dashed 
    p-6 
    flex 
    flex-col 
    items-center 
    justify-center 
    h-48
    transition-all
    ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
    ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
    ${hasFiles ? 'bg-green-50 border-green-200' : ''}
  `;

  return (
    <div
      className={boxClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf"
        multiple={true}
        disabled={disabled}
      />
      
      {hasFiles ? (
        // Exibir ícone de confirmação quando arquivos foram selecionados
        <div className="text-center">
          <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-green-500" />
          <p className="text-green-700 font-medium">Arquivos selecionados</p>
          <p className="text-sm text-green-600 mt-1">
            Clique para adicionar mais arquivos
          </p>
        </div>
      ) : (
        // Exibir ícones e instruções para upload
        <>
          <div className="rounded-full bg-muted p-3 mb-3">
            {type === 'guia' ? (
              <FileText className="h-6 w-6 text-primary" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
          </div>
          <p className="font-medium text-lg mb-1">{title}</p>
          <p className="text-sm text-muted-foreground text-center mb-2">
            {description}
          </p>
          <p className="text-xs text-muted-foreground">
            ou <span className="underline text-primary">clique para selecionar</span>
          </p>
        </>
      )}
      
      {disabled && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <div className="bg-background/90 px-3 py-1 rounded-md text-sm">
            Upload em progresso...
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
