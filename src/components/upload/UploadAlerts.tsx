
import { AlertTriangle } from "lucide-react";
import { FileType } from "@/types/upload";

interface UploadAlertsProps {
  hasGuiaDemonstrativoPair: boolean;
  hasInvalidFiles: boolean;
  hasFile: (type: FileType) => boolean;
}

const UploadAlerts = ({ hasGuiaDemonstrativoPair, hasInvalidFiles, hasFile }: UploadAlertsProps) => {
  if (!hasGuiaDemonstrativoPair && (hasFile('guia') || hasFile('demonstrativo'))) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 p-3 text-sm flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">Lembrete:</span> Para realizar uma análise completa, você precisa enviar pelo menos 
          {!hasFile('guia') && " uma guia médica"} 
          {!hasFile('guia') && !hasFile('demonstrativo') && " e "} 
          {!hasFile('demonstrativo') && " um demonstrativo de pagamento"}.
        </div>
      </div>
    );
  }
  
  if (hasInvalidFiles) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 p-3 text-sm flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium">Atenção:</span> Alguns arquivos podem estar em formato não reconhecido ou serem ilegíveis.
          Arquivos marcados como inválidos serão ignorados durante o processamento.
        </div>
      </div>
    );
  }
  
  return null;
};

export default UploadAlerts;
