
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { generateContestation } from "@/services/contestationService";
import { jsPDF } from "jspdf";

interface ContestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  procedureDetails: {
    codigo: string;
    procedimento: string;
    valorCBHPM: number;
    valorPago: number;
    diferenca: number;
    papel?: string;
    justificativa?: string;
  };
}

export function ContestationDialog({ 
  open, 
  onOpenChange,
  procedureDetails 
}: ContestationDialogProps) {
  const [contestationText, setContestationText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerateContestation = async () => {
    setLoading(true);
    try {
      const text = await generateContestation({
        procedureCode: procedureDetails.codigo,
        procedureDescription: procedureDetails.procedimento,
        cbhpmValue: procedureDetails.valorCBHPM,
        paidValue: procedureDetails.valorPago,
        difference: procedureDetails.diferenca,
        role: procedureDetails.papel,
        reasonGiven: procedureDetails.justificativa
      });
      
      setContestationText(text);
      setGenerated(true);
      toast.success("Contestação gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar contestação:", error);
      toast.error("Erro ao gerar contestação", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contestationText);
      toast.success("Texto copiado para a área de transferência");
    } catch (error) {
      toast.error("Erro ao copiar texto");
      console.error("Erro ao copiar para o clipboard:", error);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Configure PDF
      doc.setFont("helvetica");
      doc.setFontSize(12);
      
      // Add text with proper line breaks
      const splitText = doc.splitTextToSize(contestationText, 180);
      doc.text(splitText, 15, 15);
      
      // Save PDF
      doc.save(`contestacao-${procedureDetails.codigo}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("PDF baixado com sucesso");
    } catch (error) {
      toast.error("Erro ao gerar PDF");
      console.error("Erro ao gerar PDF:", error);
    }
  };

  const handleDownloadText = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([contestationText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `contestacao-${procedureDetails.codigo}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Arquivo de texto baixado com sucesso");
    } catch (error) {
      toast.error("Erro ao baixar arquivo de texto");
      console.error("Erro ao baixar arquivo de texto:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Contestação de Glosa - Procedimento {procedureDetails.codigo}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex flex-col space-y-2 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium mb-1">Código do Procedimento</p>
                <p className="text-sm text-muted-foreground">{procedureDetails.codigo}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Procedimento</p>
                <p className="text-sm text-muted-foreground">{procedureDetails.procedimento}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Valor CBHPM</p>
                <p className="text-sm text-muted-foreground">R$ {procedureDetails.valorCBHPM.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Valor Pago</p>
                <p className="text-sm text-muted-foreground">R$ {procedureDetails.valorPago.toFixed(2)}</p>
              </div>
            </div>
            
            {!generated ? (
              <Button 
                onClick={handleGenerateContestation} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando contestação...
                  </>
                ) : (
                  'Gerar Contestação Automática'
                )}
              </Button>
            ) : (
              <Textarea
                className="h-[300px] font-mono text-sm"
                value={contestationText}
                onChange={(e) => setContestationText(e.target.value)}
              />
            )}
          </div>
        </div>
        
        {generated && (
          <DialogFooter>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-end">
              <Button onClick={handleCopy} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copiar Texto
              </Button>
              <Button onClick={handleDownloadText} variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Baixar .TXT
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
